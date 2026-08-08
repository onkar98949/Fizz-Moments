"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  requestPasswordResetSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
} from "@/schemas/auth";

async function getOrigin() {
  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host");
  return `${proto}://${host}`;
}

export type AuthFormState =
  | { status: "idle" }
  | { status: "error"; error: string; values?: { name?: string; email?: string } }
  | { status: "success"; message: string };

/** Supabase's own error messages are mostly presentable, but a few are
 *  worth softening or making actionable. Anything not in this list passes
 *  through unchanged rather than being swallowed. */
function humanizeAuthError(message: string): string {
  const known: Record<string, string> = {
    "Invalid login credentials": "That email or password isn't right.",
    "User already registered": "An account with that email already exists — try logging in instead.",
    "Email not confirmed": "Please confirm your email first — check your inbox for the link we sent.",
    "Password should be at least 6 characters.": "Use at least 8 characters.",
    "Email rate limit exceeded": "Too many attempts right now — please wait a few minutes and try again.",
  };
  return known[message] ?? message;
}

/** Starts the Google OAuth flow. `next` is where the user should land
 *  after signing in — bind it when wiring this up as a form action, e.g.
 *  `action={signInWithGoogleAction.bind(null, "/create")}`. */
export async function signInWithGoogleAction(next: string = "/") {
  const origin = await getOrigin();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    redirect(`/login?error=${encodeURIComponent("Couldn't start Google sign-in. Please try again.")}`);
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signInWithPasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const values = { email };

  const parsed = signInSchema.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Check your details and try again.", values };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { status: "error", error: humanizeAuthError(error.message), values };
  }

  redirect(String(formData.get("next") || "/"));
}

export async function signUpWithPasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const values = { name, email };

  const parsed = signUpSchema.safeParse({ name, email, password: formData.get("password") });
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Check your details and try again.", values };
  }

  const origin = await getOrigin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.name },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { status: "error", error: humanizeAuthError(error.message), values };
  }

  // No session back means the project requires email confirmation before
  // the account can actually sign in — that's a config choice made in the
  // Supabase dashboard, not something this code controls either way.
  if (!data.session) {
    return {
      status: "success",
      message: "Check your inbox — we sent a confirmation link to finish creating your account.",
    };
  }

  redirect(String(formData.get("next") || "/"));
}

export async function requestPasswordResetAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const parsed = requestPasswordResetSchema.safeParse({ email });
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Enter a valid email.", values: { email } };
  }

  const origin = await getOrigin();
  const supabase = await createSupabaseServerClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
  });

  // Same message whether or not the email is registered — confirming
  // account existence to an anonymous requester is its own leak.
  return {
    status: "success",
    message: "If an account exists for that email, we've sent a link to reset the password.",
  };
}

export async function updatePasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = updatePasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Use at least 8 characters." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { status: "error", error: humanizeAuthError(error.message) };
  }

  redirect("/");
}
