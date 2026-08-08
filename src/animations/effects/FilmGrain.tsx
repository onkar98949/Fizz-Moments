/**
 * A near-invisible noise texture over otherwise-flat digital photos/gradients
 * — the cheapest single change that makes a scene read as footage instead of
 * a UI panel. Pure inline SVG filter, no asset, no dependency. Drop inside
 * any `relative overflow-hidden` scene root. Static by design — no animation
 * needed to read as texture, so this is the one effect here that isn't GSAP.
 */
export function FilmGrain({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
