import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

/** Shared outer frame for /login, /signup, /forgot-password, and
 *  /reset-password — no site navbar/footer on purpose, a focused auth
 *  screen shouldn't offer a dozen exits. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between gap-12 px-6 py-12">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/fizzmoments-mark.png" alt="" width={43} height={32} className="h-8 w-auto" priority />
        <span className="text-lg font-semibold tracking-tight">FizzMoments</span>
      </Link>

      <div className="border-border bg-card shadow-soft-lg flex w-full max-w-sm flex-col gap-6 rounded-2xl border p-8 sm:p-10">
        {children}
      </div>

      <p className="text-muted-foreground/70 max-w-xs text-center text-xs leading-relaxed text-balance">
        By continuing, you agree to FizzMoments&apos;{" "}
        <Link href="/terms" className="underline underline-offset-2">
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
