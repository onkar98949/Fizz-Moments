import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password — FizzMoments",
  description: "Get a link to reset your FizzMoments password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-eyebrow font-medium uppercase">Reset password</span>
        <h1 className="font-display text-card-title text-balance">Forgot your password?</h1>
        <p className="text-muted-foreground text-sm">Enter your email and we&apos;ll send you a link to reset it.</p>
      </div>

      <ForgotPasswordForm />

      <p className="text-muted-foreground text-center text-sm">
        <Link href="/login" className="text-primary-active font-medium underline underline-offset-2">
          Back to log in
        </Link>
      </p>
    </AuthShell>
  );
}
