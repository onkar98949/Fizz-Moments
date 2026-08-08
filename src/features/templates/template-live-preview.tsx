"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedElement } from "@/features/editor/elements/animated-element";
import { useInViewport } from "@/hooks/use-in-viewport";
import type { Scene } from "@/types/template";
import { cn } from "@/lib/utils";

type TemplateLivePreviewProps = {
  scenes: Scene[];
  className?: string;
};

/** A real, running preview of a prebuilt Template — the same scenes,
 *  elements and durations the editor would show, cycling on a silent loop.
 *  Deliberately stripped of TemplatePlayer's audio/mute/replay chrome: this
 *  is ambient decoration for a browsing grid, not something a visitor
 *  operates, and running 20 of these at once ruled out audio outright. */
export function TemplateLivePreview({ scenes, className }: TemplateLivePreviewProps) {
  const { ref, inView } = useInViewport<HTMLDivElement>(0.3);
  const [index, setIndex] = useState(0);
  const scene = scenes[index];

  useEffect(() => {
    if (!inView || scenes.length === 0) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % scenes.length), scene?.durationMs ?? 4000);
    return () => clearTimeout(timer);
  }, [inView, index, scene?.durationMs, scenes.length]);

  if (!scene) return null;

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="@container absolute inset-0"
          style={
            scene.background.type === "image"
              ? { backgroundImage: `url(${scene.background.value})`, backgroundSize: "cover", backgroundPosition: "center" }
              : scene.background.type === "gradient"
                ? { backgroundImage: scene.background.value }
                : { backgroundColor: scene.background.value }
          }
        >
          {scene.elements.map((element, elIndex) => (
            <AnimatedElement key={element.id} element={element} index={elIndex} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
