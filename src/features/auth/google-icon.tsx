/** Google's official "G" logomark, per their brand guidelines for
 *  sign-in buttons — a generic icon here would look off-brand and less
 *  trustworthy on a real auth screen. */
export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.6-6 7.9-11.3 7.9-6.9 0-12.5-5.6-12.5-12.5S17.1 10.5 24 10.5c3.2 0 6.1 1.2 8.3 3.2l5.1-5.1C34.5 5.6 29.5 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5c11 0 20.5-8 20.5-20.5 0-1.4-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 5.9 4.3C13.8 15.5 18.5 12.5 24 12.5c3.2 0 6.1 1.2 8.3 3.2l5.1-5.1C34.5 7.6 29.5 5.5 24 5.5c-7.6 0-14.1 4.3-17.7 10.6z"
      />
      <path
        fill="#4CAF50"
        d="M24 44.5c5.4 0 10.3-2 13.9-5.4l-6.4-5.4c-2 1.5-4.6 2.4-7.5 2.4-5.3 0-9.8-3.4-11.3-8.1l-6.1 4.7C9.9 39.9 16.4 44.5 24 44.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.2-2.2 4.1-4.1 5.5v.1l6.4 5.4c-.4.4 6.9-5 6.9-15.6 0-1.4-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
