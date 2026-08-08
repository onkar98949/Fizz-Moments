"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "./password-field";
import { AuthErrorBanner, AuthSuccessBanner } from "./auth-banners";
import { signInWithPasswordAction, signUpWithPasswordAction } from "@/actions/auth-actions";
import type { AuthFormState } from "@/actions/auth-actions";

const INITIAL_STATE: AuthFormState = { status: "idle" };

type EmailPasswordFormProps = {
  mode: "login" | "signup";
  next: string;
};

export function EmailPasswordForm({ mode, next }: EmailPasswordFormProps) {
  const action = mode === "login" ? signInWithPasswordAction : signUpWithPasswordAction;
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);

  if (state.status === "success") {
    return <AuthSuccessBanner message={state.message} />;
  }

  const values = state.status === "error" ? state.values : undefined;

  return (
    // Keyed on the error so the fields below remount with fresh defaultValues
    // instead of clearing — retyping a whole signup form after one typo in
    // the password is exactly the friction this avoids.
    <form key={state.status === "error" ? state.error : "idle"} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      {state.status === "error" ? <AuthErrorBanner message={state.error} /> : null}

      {mode === "signup" ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            maxLength={80}
            autoComplete="name"
            placeholder="Your name"
            defaultValue={values?.name}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={values?.email}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {mode === "login" ? (
            <Link href="/forgot-password" className="text-primary-active text-xs font-medium underline underline-offset-2">
              Forgot password?
            </Link>
          ) : null}
        </div>
        <PasswordField
          id="password"
          name="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={mode === "signup" ? 8 : undefined}
          placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
        />
      </div>

      <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
        {pending ? (mode === "login" ? "Logging in…" : "Creating account…") : mode === "login" ? "Log in" : "Create account"}
      </Button>
    </form>
  );
}
