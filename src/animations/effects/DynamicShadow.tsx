"use client";

import { forwardRef } from "react";

type DynamicShadowProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
  top?: string;
};

/**
 * A blurred contact shadow, deliberately a *separate* element from the
 * object casting it rather than an animated `box-shadow` — `box-shadow`
 * isn't GPU-accelerated, `transform`/`opacity` are. A scene's timeline
 * targets this ref directly (`tl.to(shadowRef.current, {scaleX, opacity},
 * "<")`) at the same position as the object's own tween, so the shadow
 * reacts in lockstep with whatever is moving above it.
 */
export const DynamicShadow = forwardRef<HTMLDivElement, DynamicShadowProps>(function DynamicShadow(
  { className, width = 220, height = 28, top = "60%" },
  ref,
) {
  return (
    <div
      ref={ref}
      className={className ?? "pointer-events-none absolute rounded-full bg-black blur-xl"}
      style={{ width, height, top, opacity: 0 }}
    />
  );
});
