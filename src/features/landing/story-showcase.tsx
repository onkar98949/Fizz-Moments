"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { viewportOnce } from "@/lib/motion";
import type { StoryTemplateCategory, StoryTemplateEntry } from "@/types/story";

/** Pulls in every scene renderer in the registry — real weight, loaded
 *  client-side only, after the fold, with a same-shape skeleton so there's
 *  no layout shift once it arrives. */
const LiveStoryPreview = dynamic(() => import("./live-story-preview").then((m) => m.LiveStoryPreview), {
  ssr: false,
  loading: () => <div className="bg-secondary/60 h-full w-full animate-pulse" />,
});

const FEATURED: { category: StoryTemplateCategory; depth: number }[] = [
  { category: "LOVE", depth: 30 },
  { category: "TRAVEL", depth: -20 },
  { category: "BIRTHDAY", depth: 40 },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function ShowcaseCard({ template, depth, index }: { template: StoryTemplateEntry; depth: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [depth, -depth]);

  // The cover scene shares one generic placeholder title/subtitle across
  // every template here, so every card opens on near-identical UI. Skipping
  // it means each card starts on content that's actually distinct.
  const contentScenes = template.seedScenes.filter((scene) => scene.scene !== "cover");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      style={{ y }}
      className="flex flex-col gap-5"
    >
      <motion.div
        whileHover={{ scale: 1.015 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="shadow-soft-lg hover:shadow-float relative aspect-[9/16] w-full overflow-hidden rounded-2xl transition-shadow duration-300"
      >
        <LiveStoryPreview scenes={contentScenes} className="rounded-2xl" />
      </motion.div>
      <div className="flex flex-col gap-1 px-1">
        <p className="font-display text-lg">{template.name}</p>
        <p className="text-muted-foreground text-caption">{template.description}</p>
      </div>
    </motion.div>
  );
}

type StoryShowcaseProps = {
  storyTemplates: StoryTemplateEntry[];
};

/** Real, running previews of the actual seeded Story Templates in large
 *  cinematic frames — proof, not a mockup. Each card drifts at a slightly
 *  different rate while scrolling for a quiet sense of depth. */
export function StoryShowcase({ storyTemplates }: StoryShowcaseProps) {
  const featured = FEATURED.map((f) => ({
    ...f,
    template: storyTemplates.find((t) => t.category === f.category),
  })).filter((f): f is typeof f & { template: StoryTemplateEntry } => Boolean(f.template));

  if (featured.length === 0) return null;

  return (
    <section className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-4"
        >
          <span className="text-muted-foreground text-eyebrow font-medium uppercase">Real stories, really told</span>
          <h2 className="font-display text-section max-w-lg text-balance">See it before you make it.</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {featured.map(({ template, depth }, index) => (
            <ShowcaseCard key={template.id} template={template} depth={depth} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
