"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordField } from "./password-field";
import { AuthErrorBanner } from "./auth-banners";
import { updatePasswordAction } from "@/actions/auth-actions";
import type { AuthFormState } from "@/actions/auth-actions";

const INITIAL_STATE: AuthFormState = { status: "idle" };

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.status === "error" ? <AuthErrorBanner message={state.error} /> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">New password</Label>
        <PasswordField id="password" name="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" />
      </div>

      <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
