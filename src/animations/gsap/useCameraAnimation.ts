"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { CAMERA_BOUNDS, EASE } from "./sceneDefaults";

/**
 * "The camera should never remain static." A separate, independent GSAP
 * loop from the scene's own content timeline (`useSceneTimeline`) — camera
 * drift runs continuously for the whole scene life regardless of what phase
 * the story content is in, the way a held shot keeps breathing even when
 * nothing else on screen is moving.
 */
export function useCameraAnimation(cameraRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (!cameraRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(cameraRef.current, { transformOrigin: "50% 50%" });
      gsap.to(cameraRef.current, {
        scale: CAMERA_BOUNDS.scaleMax,
        x: CAMERA_BOUNDS.panPx,
        y: -CAMERA_BOUNDS.panPx * 0.7,
        rotation: CAMERA_BOUNDS.rotationMaxDeg,
        duration: 8,
        ease: EASE.drift,
        yoyo: true,
        repeat: -1,
      });
    }, cameraRef);

    return () => ctx.revert();
  }, [cameraRef]);
}
