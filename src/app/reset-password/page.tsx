import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/auth-shell";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Choose a new password for your FizzMoments account.",
  robots: NOINDEX_ROBOTS,
};

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-eyebrow font-medium uppercase">Reset password</span>
        <h1 className="font-display text-card-title text-balance">Choose a new password.</h1>
      </div>

      <ResetPasswordForm />
    </AuthShell>
  );
}
