"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { EASE } from "../gsap/sceneDefaults";

type AmbientLightingProps = {
  /** Warm light, top-left. */
  primaryColor?: string;
  /** Accent glow, bottom-right. */
  accentColor?: string;
};

/**
 * Two cinematic light sources, both drifting position/opacity extremely
 * slowly and continuously — "never static." Pure radial gradients, GSAP
 * driving opacity + transform only.
 */
export function AmbientLighting({ primaryColor = "rgba(255,214,158,0.4)", accentColor = "rgba(232,180,158,0.3)" }: AmbientLightingProps) {
  const primaryRef = useRef<HTMLDivElement | null>(null);
  const accentRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      if (primaryRef.current) {
        gsap.to(primaryRef.current, {
          opacity: 0.85,
          x: 24,
          y: 16,
          duration: 11,
          ease: EASE.drift,
          yoyo: true,
          repeat: -1,
        });
      }
      if (accentRef.current) {
        gsap.to(accentRef.current, {
          opacity: 0.6,
          x: -18,
          y: -12,
          duration: 13,
          ease: EASE.drift,
          yoyo: true,
          repeat: -1,
          delay: 1.2,
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      <div
        ref={primaryRef}
        className="absolute -top-1/3 -left-1/4 h-3/4 w-3/4 rounded-full"
        style={{ background: `radial-gradient(circle, ${primaryColor}, transparent 70%)`, opacity: 0.55 }}
      />
      <div
        ref={accentRef}
        className="absolute -right-1/4 -bottom-1/3 h-3/4 w-3/4 rounded-full"
        style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)`, opacity: 0.35 }}
      />
    </div>
  );
}
