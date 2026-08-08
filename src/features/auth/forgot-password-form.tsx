"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthErrorBanner, AuthSuccessBanner } from "./auth-banners";
import { requestPasswordResetAction } from "@/actions/auth-actions";
import type { AuthFormState } from "@/actions/auth-actions";

const INITIAL_STATE: AuthFormState = { status: "idle" };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, INITIAL_STATE);

  if (state.status === "success") {
    return <AuthSuccessBanner message={state.message} />;
  }

  const values = state.status === "error" ? state.values : undefined;

  return (
    <form key={state.status === "error" ? state.error : "idle"} action={formAction} className="flex flex-col gap-4">
      {state.status === "error" ? <AuthErrorBanner message={state.error} /> : null}

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

      <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
