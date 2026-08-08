import type { Transition, Variants } from "framer-motion";

/** Shared timing so every hover/press/reveal in the app moves at the same
 *  rhythm — mirrors the duration/ease custom properties in globals.css. */
export const EASE_OUT_SOFT: Transition["ease"] = [0.16, 1, 0.3, 1];
export const EASE_SPRING: Transition["ease"] = [0.34, 1.56, 0.64, 1];

export const springTransition: Transition = { type: "spring", stiffness: 340, damping: 28 };

/** A section revealing as the user scrolls to it — fade + translate, once. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_SOFT } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT_SOFT } },
};

/** Parent for a list of cards/rows — children stagger in one after another.
 *  Pair with `fadeInUp` (or similar) on each child. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT_SOFT } },
};

/** The default "premium card" hover/tap — a small lift and scale, spring-back
 *  on release. Use with `whileHover`/`whileTap` directly on a motion element. */
export const cardHover = { y: -6, scale: 1.015, transition: springTransition };
export const cardTap = { scale: 0.985 };

export const viewportOnce = { once: true, margin: "-80px" as const };
