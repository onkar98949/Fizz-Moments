import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";
import type { EmailOtpType } from "@supabase/supabase-js";

// The full set Supabase's verifyOtp accepts. Validated explicitly rather
// than trusting (and blindly casting) whatever string shows up in the
// query — `type` picks which verification codepath runs server-side.
const VALID_OTP_TYPES: ReadonlySet<string> = new Set([
  "signup",
  "recovery",
  "invite",
  "magiclink",
  "email_change",
  "email",
]);

function parseOtpType(raw: string | null): EmailOtpType | null {
  return raw && VALID_OTP_TYPES.has(raw) ? (raw as EmailOtpType) : null;
}

/** Handles email-delivered auth links — signup confirmation and password
 *  recovery. These get opened from wherever the email client happens to
 *  be (a different device, browser, or even an in-app webview than the
 *  one that started the flow), so unlike the OAuth callback this can't
 *  rely on a PKCE code_verifier cookie surviving the trip. `verifyOtp`
 *  with a token_hash is self-contained — the hash itself is the proof —
 *  so it works regardless of where the link gets clicked.
 *
 *  Supabase's default "Confirm signup" / "Reset password" email templates
 *  don't point here out of the box; they use `{{ .ConfirmationURL }}`,
 *  which goes to Supabase's own /auth/v1/verify and redirects back with
 *  the session in a URL hash fragment — invisible to a server-side route.
 *  The templates need to be changed (Supabase Dashboard → Authentication
 *  → Email Templates) to link here instead, with
 *  `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=TYPE&next={{ .RedirectTo }}`. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = parseOtpType(searchParams.get("type"));
  const next = safeRedirectPath(searchParams.get("next"));

  if (tokenHash && type) {
    const supabase = await createSupabaseServerClient();
    // Never log `error` verbatim if that's ever added here — Supabase's
    // verifyOtp errors don't include the token, but as a rule this route
    // must never log token_hash, and doesn't.
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("That link is invalid or has expired. Please try again.")}`,
  );
}
