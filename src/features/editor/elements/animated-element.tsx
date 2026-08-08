"use client";

import { motion } from "framer-motion";
import { ElementView } from "./element-view";
import type { SceneElement } from "@/types/template";

const EASE_OUT_SOFT = [0.16, 1, 0.3, 1] as const;

/** Text's entrance takes its personality from the font it's already set
 *  in — no extra data to author, and it means the 20 seeded templates
 *  automatically read as different from each other: a script headline pops
 *  like a handwritten flourish, a display headline settles in elegantly, a
 *  plain body line just quietly appears. */
function textMotion(fontFamily: "display" | "body" | "script") {
  switch (fontFamily) {
    case "script":
      return {
        initial: { opacity: 0, scale: 0.7 },
        animate: { opacity: 1, scale: 1 },
        transition: { type: "spring" as const, stiffness: 260, damping: 15 },
      };
    case "display":
      return {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.75, ease: EASE_OUT_SOFT },
      };
    case "body":
      return {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: EASE_OUT_SOFT },
      };
  }
}

type AnimatedElementProps = {
  element: SceneElement;
  /** Position within the scene's element list — the only "choreography
   *  data" this needs, since it's just used to stagger entrances. */
  index: number;
};

/** Wraps ElementView with an entrance (and, for stickers, a continuous idle
 *  float) for playback contexts — TemplatePlayer and the gallery's live
 *  previews. Deliberately NOT used by the editor's Canvas: while dragging
 *  and resizing an element, it needs to sit still and exactly where the
 *  user put it, not be mid-animation. */
export function AnimatedElement({ element, index }: AnimatedElementProps) {
  const delay = 0.15 + index * 0.12;
  const basePosition = {
    left: `${element.x}%`,
    top: `${element.y}%`,
    width: `${element.width}%`,
    height: `${element.height}%`,
  };

  if (element.type === "text") {
    const { initial, animate, transition } = textMotion(element.fontFamily);
    return (
      <motion.div
        style={{ position: "absolute", ...basePosition, rotate: element.rotation }}
        initial={initial}
        animate={animate}
        transition={{ ...transition, delay }}
      >
        <ElementView element={element} />
      </motion.div>
    );
  }

  if (element.type === "sticker") {
    return (
      <motion.div
        style={{ position: "absolute", ...basePosition }}
        initial={{ opacity: 0, scale: 0.4, rotate: element.rotation - 18 }}
        animate={{ opacity: 1, scale: 1, rotate: element.rotation }}
        transition={{ type: "spring", stiffness: 300, damping: 13, delay }}
      >
        <motion.div
          className="h-full w-full"
          animate={{ y: [0, -4, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 }}
        >
          <ElementView element={element} />
        </motion.div>
      </motion.div>
    );
  }

  // Image — a slow Ken Burns drift makes even a placeholder photo feel like
  // a held shot rather than a pasted-in rectangle.
  return (
    <motion.div
      style={{ position: "absolute", ...basePosition, rotate: element.rotation, overflow: "hidden" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1 }}
        animate={{ scale: 1.09 }}
        transition={{ duration: 6, ease: "easeOut", delay }}
      >
        <ElementView element={element} />
      </motion.div>
    </motion.div>
  );
}
