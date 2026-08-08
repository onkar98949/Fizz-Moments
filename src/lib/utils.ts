import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A server action's `redirect()` throws a special NEXT_REDIRECT digest that
 * Next.js's client runtime intercepts to perform navigation. When the action
 * is awaited from a plain client-side function call (not `<form action>` or
 * `startTransition`), that throw can still reach a surrounding try/catch —
 * re-throw it here instead of treating it as a real failure.
 */
export function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}
