/** A `next`/redirect-destination value round-trips through a URL (query
 *  param, form field, email link), which makes it attacker-influenced —
 *  redirecting to it unchecked is an open-redirect vector (e.g.
 *  `next=//evil.com` or `next=https://evil.com`). Only a same-origin,
 *  relative path is ever a valid destination in this app, so anything
 *  else collapses to the safe default. */
export function safeRedirectPath(next: string | null | undefined, fallback = "/"): string {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback; // must be relative
  if (next.startsWith("//")) return fallback; // protocol-relative ("//evil.com")
  if (next.includes("://")) return fallback; // absolute URL smuggled into the path
  if (next.startsWith("/\\") || next.includes("\\")) return fallback; // backslash tricks some URL parsers treat as "/"
  return next;
}
