"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getSceneDurationMs } from "@/scenes/schema";
import { getSceneDefinition } from "@/scenes/registry";
import { useInViewport } from "@/hooks/use-in-viewport";
import type { SceneInstance } from "@/types/story";
import { cn } from "@/lib/utils";

/** Same placeholder used by the Scene Library's own live-preview cards —
 *  a seed template has no real recipient, so scenes that reference one
 *  (the Letter's "Dear ___,", the Cover's title) get a stand-in. */
const PREVIEW_STORY_CONTEXT = { title: "A Story For You", subtitle: "Made with love", recipientName: "You" };

type LiveStoryPreviewProps = {
  scenes: SceneInstance[];
  className?: string;
};

/** A real, running preview of an actual Story Template — the same scene
 *  renderers, the same seed data, the same durations the product uses.
 *  Cycles on a loop and only advances while the card is on screen, mirroring
 *  StoryPlayer's scene-cycling logic but stripped of audio/controls, since
 *  this is ambient decoration, not something a visitor operates. */
export function LiveStoryPreview({ scenes, className }: LiveStoryPreviewProps) {
  const { ref, inView } = useInViewport<HTMLDivElement>(0.35);
  const [index, setIndex] = useState(0);

  const scene = scenes[index];
  const definition = scene ? getSceneDefinition(scene.scene) : undefined;
  const durationMs = scene ? getSceneDurationMs(scene) : 4000;

  useEffect(() => {
    if (!inView || scenes.length === 0) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % scenes.length), durationMs);
    return () => clearTimeout(timer);
  }, [inView, index, durationMs, scenes.length]);

  if (!scene) return null;

  const content = definition ? (
    <definition.Renderer data={scene.data} variant={scene.variant} story={PREVIEW_STORY_CONTEXT} />
  ) : (
    <div className="bg-secondary h-full w-full" />
  );

  return (
    <div ref={ref} className={cn("relative aspect-[9/16] w-full overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        {(definition?.config.transitionIn ?? "cut") === "fade" ? (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {content}
          </motion.div>
        ) : (
          <div key={index} className="absolute inset-0">
            {content}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
