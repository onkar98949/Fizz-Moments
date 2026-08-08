"use client";

import { useRef, type ReactNode } from "react";
import { useCameraAnimation } from "../gsap/useCameraAnimation";

/**
 * Wraps a scene's visual layers in continuous, subtle GSAP-driven camera
 * motion (scale/pan/rotate only — GPU-accelerated transforms, nothing that
 * touches layout). Reusable across every cinematic scene; the scene itself
 * only needs to render its content inside this and never think about the
 * camera again.
 */
export function CameraRig({ children, className }: { children: ReactNode; className?: string }) {
  const cameraRef = useRef<HTMLDivElement | null>(null);
  useCameraAnimation(cameraRef);

  return (
    <div ref={cameraRef} className={className ?? "absolute inset-0"} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
