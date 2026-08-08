"use client";

import { forwardRef, type ReactNode } from "react";
import { CameraRig } from "../camera/CameraRig";
import { AmbientLighting } from "../effects/AmbientLighting";
import { FloatingParticles } from "../effects/FloatingParticles";
import { FilmGrain } from "../effects/FilmGrain";

type CinematicStageProps = {
  backgroundColor?: string;
  primaryLight?: string;
  accentLight?: string;
  particleColor?: string;
  particleCount?: number;
  grainOpacity?: number;
  vignetteOpacity?: number;
  children: ReactNode;
};

/**
 * The standard shell every cinematic scene renders into: a fading
 * background, two ambient light sources, the continuously-moving camera
 * rig, drifting dust, film grain, and a vignette — composed once here so no
 * scene re-implements this layering itself. The forwarded ref is the
 * background layer; a scene's own GSAP timeline targets it directly for the
 * Phase 1 fade-in (`tl.fromTo(stageRef.current, {opacity:0}, {opacity:1}, 0)`).
 * Everything else on this stage animates on its own, continuously, without
 * needing to be told to.
 */
export const CinematicStage = forwardRef<HTMLDivElement, CinematicStageProps>(function CinematicStage(
  {
    backgroundColor = "#FAF6EF",
    primaryLight,
    accentLight,
    particleColor,
    particleCount = 20,
    grainOpacity = 0.05,
    vignetteOpacity = 0.32,
    children,
  },
  backgroundRef,
) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ backgroundColor }}>
      <div ref={backgroundRef} className="absolute inset-0" style={{ opacity: 0 }}>
        <AmbientLighting primaryColor={primaryLight} accentColor={accentLight} />
        <CameraRig>{children}</CameraRig>
        <FloatingParticles count={particleCount} color={particleColor} />
      </div>

      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 0 min(26vw,11rem) rgba(0,0,0,${vignetteOpacity})` }} />
      <FilmGrain opacity={grainOpacity} />
    </div>
  );
});
