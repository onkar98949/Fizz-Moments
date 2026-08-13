import Link from "next/link";
// Google sign-in temporarily disabled — see the commented block below.
// import { Button } from "@/components/ui/button";
// import { signInWithGoogleAction } from "@/actions/auth-actions";
// import { GoogleIcon } from "./google-icon";
import { EmailPasswordForm } from "./email-password-form";
import { AuthErrorBanner } from "./auth-banners";
import { AuthShell } from "./auth-shell";

type AuthCardProps = {
  mode: "login" | "signup";
  next?: string;
  error?: string;
};

const COPY = {
  login: {
    eyebrow: "Welcome back",
    title: "Log in to FizzMoments.",
    crossLinkLead: "New here?",
    crossLinkLabel: "Create an account",
    crossLinkHref: "/signup",
  },
  signup: {
    eyebrow: "Get started",
    title: "Create your account.",
    crossLinkLead: "Already have an account?",
    crossLinkLabel: "Log in",
    crossLinkHref: "/login",
  },
} as const;

/** Email/password auth — "login" and "signup" only differ in framing and
 *  in the email form asking for a name. Google sign-in is temporarily
 *  disabled (commented out below); the password form is the one client
 *  island on this page. */
export function AuthCard({ mode, next = "/", error }: AuthCardProps) {
  const copy = COPY[mode];

  return (
    <AuthShell>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-eyebrow font-medium uppercase">{copy.eyebrow}</span>
        <h1 className="font-display text-card-title text-balance">{copy.title}</h1>
      </div>

      {error ? <AuthErrorBanner message={error} /> : null}

      {/* Google sign-in temporarily disabled — uncomment to restore, along
          with the matching imports above.
      <form action={signInWithGoogleAction.bind(null, next)}>
        <Button type="submit" variant="outline" size="lg" className="w-full gap-3">
          <GoogleIcon className="size-5" />
          Continue with Google
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">or</span>
        <div className="bg-border h-px flex-1" />
      </div>
      */}

      <EmailPasswordForm mode={mode} next={next} />

      <p className="text-muted-foreground text-center text-sm">
        {copy.crossLinkLead}{" "}
        <Link href={copy.crossLinkHref} className="text-primary-active font-medium underline underline-offset-2">
          {copy.crossLinkLabel}
        </Link>
      </p>
    </AuthShell>
  );
}
