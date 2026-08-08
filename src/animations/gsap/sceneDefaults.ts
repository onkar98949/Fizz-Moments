/**
 * Shared constants for the GSAP cinematic engine (`src/animations/`). Every
 * scene's timeline should pull eases/bounds from here instead of hand-rolling
 * its own numbers, so a "physical" feel stays consistent scene to scene.
 */

/** Camera motion caps, per the architecture spec — subtle enough to be felt,
 *  not seen. `useCameraAnimation` reads these directly. */
export const CAMERA_BOUNDS = {
  scaleMax: 1.06,
  rotationMaxDeg: 1,
  panPx: 18,
} as const;

export const EASE = {
  /** Something with weight settling into place — envelope, paper, photo. */
  landing: "back.out(1.6)",
  /** A soft, even reveal — fades, glows, light. */
  soft: "power2.out",
  /** Continuous ambient drift — particles, lighting, the camera rig. */
  drift: "sine.inOut",
  /** A snappy, precise beat — sparkles, seal pulse. */
  pop: "back.out(2.2)",
} as const;

/** Standard duration for a scene's establishing fade-in (background, camera
 *  waking up) before any object-specific choreography begins. */
export const AMBIENT_FADE_IN_S = 1;
