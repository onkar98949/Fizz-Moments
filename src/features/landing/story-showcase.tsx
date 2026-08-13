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
  { category: "BIRTHDAY", depth: 30 },
  { category: "LOVE", depth: -20 },
  { category: "TRAVEL", depth: 40 },
];

/** Display-only labels — not stored anywhere, not tied to filtering or the
 *  database. Just a friendlier tag layered on top of the real category so
 *  the showcase reads as "vibes" instead of a product taxonomy. */
const VIBE_TAGS: Record<StoryTemplateCategory, string> = {
  LOVE: "Lowkey Romantic",
  TRAVEL: "Long Distance",
  BIRTHDAY: "Birthday Chaos",
  ANNIVERSARY: "Core Memories",
  FAMILY: "For the Fam",
  GRADUATION: "Main Character",
  THANK_YOU: "Just Because",
};

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
      className="flex flex-col gap-4"
    >
      <motion.div
        whileHover={{ scale: 1.015, rotate: index % 2 === 0 ? -0.6 : 0.6 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="shadow-soft-lg hover:shadow-float relative aspect-[9/16] w-full overflow-hidden rounded-2xl transition-shadow duration-300"
      >
        <LiveStoryPreview scenes={contentScenes} className="rounded-2xl" />
        <span className="bg-card/95 text-foreground absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
          {VIBE_TAGS[template.category]}
        </span>
      </motion.div>
      <div className="flex flex-col gap-1 px-1">
        <p className="font-heading text-lg font-semibold">{template.name}</p>
        <p className="text-muted-foreground text-caption">{template.description}</p>
      </div>
    </motion.div>
  );
}

type StoryShowcaseProps = {
  storyTemplates: StoryTemplateEntry[];
};

/** Real, running previews of the actual seeded Story Templates — proof, not
 *  a mockup — tagged with playful "vibe" labels instead of raw category
 *  names, so it's obvious this isn't a romance-only product. */
export function StoryShowcase({ storyTemplates }: StoryShowcaseProps) {
  const featured = FEATURED.map((f) => ({
    ...f,
    template: storyTemplates.find((t) => t.category === f.category),
  })).filter((f): f is typeof f & { template: StoryTemplateEntry } => Boolean(f.template));

  if (featured.length === 0) return null;

  return (
    <section id="vibes" className="scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-3"
        >
          <span className="text-primary-active text-eyebrow font-semibold uppercase">Pick your vibe</span>
          <h2 className="font-heading text-section max-w-lg text-balance font-semibold">
            Not every gift has to be romantic.
          </h2>
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
