"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInViewport } from "@/hooks/use-in-viewport";
import type { SceneDefinition, StoryContext } from "@/scenes/types";
import { PreviewErrorBoundary } from "./preview-error-boundary";

// A square crop, not the real 9:16 StoryPlayer frame — keeps each card's
// preview big and legible in a 2-column mobile grid, and short enough that
// several rows (with their labels) fit the library's scroll area at once.
// Renderers lay out relative to their container, so this still reads
// correctly, just less extreme than the real player.
const BASELINE_WIDTH = 360;
const BASELINE_HEIGHT = BASELINE_WIDTH;
const MIN_LOOP_MS = 3000;
const LOOP_GAP_MS = 500;

const PREVIEW_STORY_CONTEXT: StoryContext = {
  title: "A Story For You",
  subtitle: "Made with love",
  recipientName: "You",
};

type ScenePreviewCardProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see scenes/registry.ts
  scene: SceneDefinition<any>;
  onClick: () => void;
};

export function ScenePreviewCard({ scene, onClick }: ScenePreviewCardProps) {
  const { ref: viewportRef, inView } = useInViewport<HTMLDivElement>(0.4);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const scale = width / BASELINE_WIDTH;

  const previewData = scene.config.previewData();
  const durationMs = Math.max(scene.config.getDurationMs(previewData), MIN_LOOP_MS);

  // Renderers animate once on mount and settle — remounting on an interval
  // (only while the card is actually visible) is what makes the preview loop.
  useEffect(() => {
    if (!inView) return;
    setLoopKey((k) => k + 1);
    const interval = setInterval(() => setLoopKey((k) => k + 1), durationMs + LOOP_GAP_MS);
    return () => clearInterval(interval);
  }, [inView, durationMs]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="border-border hover:border-primary/50 hover:ring-primary/20 relative flex flex-col overflow-hidden rounded-2xl border text-left shadow-soft transition-colors hover:ring-2"
    >
      <div
        ref={(node) => {
          frameRef.current = node;
          viewportRef.current = node;
        }}
        // Explicit pixel height derived from the measured width (not
        // `aspect-*` or a padding-percentage trick) on purpose: both collapse
        // this box to ~0 height here — a CSS Grid auto-row-sizing quirk when
        // a grid item's height is itself derived from its own resolved width
        // (confirmed via computed-style inspection, not a guess). A real,
        // JS-computed height sidesteps the ambiguity entirely.
        className="bg-secondary relative w-full overflow-hidden"
        style={{ height: width || undefined }}
      >
        {inView && scale > 0 ? (
          <div
            className="pointer-events-none absolute top-0 left-0 origin-top-left"
            style={{ width: BASELINE_WIDTH, height: BASELINE_HEIGHT, transform: `scale(${scale})` }}
          >
            <PreviewErrorBoundary
              key={loopKey}
              fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl opacity-60">{scene.config.emoji}</span>
                </div>
              }
            >
              {scene.Thumbnail ? (
                <scene.Thumbnail />
              ) : (
                <scene.Renderer data={previewData} variant={scene.config.defaultVariant} story={PREVIEW_STORY_CONTEXT} />
              )}
            </PreviewErrorBoundary>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-60">{scene.config.emoji}</span>
          </div>
        )}
      </div>

      <div className="bg-card flex flex-col gap-0.5 border-t border-border px-3 py-2">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <span>{scene.config.emoji}</span>
          {scene.config.label}
        </p>
        <p className="text-muted-foreground line-clamp-1 text-xs leading-snug">{scene.config.description}</p>
      </div>
    </motion.button>
  );
}
