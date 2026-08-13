"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StoryTemplateEntry } from "@/types/story";

const LiveStoryPreview = dynamic(() => import("./live-story-preview").then((m) => m.LiveStoryPreview), {
  ssr: false,
  loading: () => <div className="bg-secondary/60 h-full w-full animate-pulse" />,
});

const EASE = [0.16, 1, 0.3, 1] as const;

type HeroSectionProps = {
  storyTemplates: StoryTemplateEntry[];
};

/** The opening statement, rebuilt around showing the actual product instead
 *  of a stock lifestyle photo: a phone-shaped frame runs a real, live Story
 *  Template preview — same renderers, same seed data the product actually
 *  ships. Two small clay stickers float around it for personality; the copy
 *  says what you'd make, not how it'll make you feel. */
export function HeroSection({ storyTemplates }: HeroSectionProps) {
  const featured =
    storyTemplates.find((t) => t.category === "BIRTHDAY") ??
    storyTemplates.find((t) => t.seedScenes.length > 0) ??
    null;
  const previewScenes = featured?.seedScenes.filter((scene) => scene.scene !== "cover") ?? [];

  return (
    <section className="px-6 pt-10 pb-14 sm:px-10 sm:pt-20 sm:pb-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="flex flex-col gap-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-primary-active text-eyebrow font-semibold uppercase"
          >
            For your favorite people ✦
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="font-heading text-hero max-w-xl text-balance font-semibold"
          >
            Make them a little something.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            className="text-muted-foreground text-body-lg max-w-md text-balance"
          >
            Add photos, memories, and a few inside jokes. We&apos;ll turn it into a personalized
            digital gift you can send with one link.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
            className="flex flex-col items-start gap-4 pt-1"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="group/cta gap-2"
                nativeButton={false}
                render={
                  <Link href="/gifts">
                    Make a Moment
                    <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
                  </Link>
                }
              />
              <Button
                size="lg"
                variant="ghost"
                nativeButton={false}
                render={<Link href="#vibes">See an example</Link>}
              />
            </div>
            <p className="text-muted-foreground/80 text-meta">
              Free to start · No app required · Ready in minutes
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="relative mx-auto flex w-full max-w-[13.5rem] items-center justify-center sm:max-w-[19rem]"
        >
          {/* Phone frame — a real, live-running Story Template inside, not a
              mockup image, so the hero shows the actual product. */}
          <div className="shadow-float relative aspect-[9/17.5] w-full overflow-hidden rounded-[2.75rem] border-[6px] border-[#1b1b1f] bg-[#1b1b1f]">
            <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-1.5">
              <div className="h-4 w-20 rounded-full bg-[#1b1b1f]" />
            </div>
            <div className="relative h-full w-full overflow-hidden rounded-[2.25rem]">
              {previewScenes.length > 0 ? (
                <LiveStoryPreview scenes={previewScenes} className="h-full rounded-[2.25rem]" />
              ) : (
                <div className="bg-secondary h-full w-full" />
              )}
            </div>
          </div>

          {/* Floating clay stickers — small tactile personality, not a
              claymorphism makeover of the whole hero. */}
          <motion.span
            aria-hidden
            animate={{ y: [0, -10, 0], rotate: [-6, 2, -6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="clay clay-yellow absolute -top-2 -left-2 flex size-10 rotate-[-6deg] items-center justify-center rounded-xl text-2xl sm:-top-3 sm:-left-10 sm:size-14 sm:rounded-2xl"
          >
            <Sparkles className="size-4 text-white sm:size-6" strokeWidth={1.75} />
          </motion.span>
          <motion.span
            aria-hidden
            animate={{ y: [0, 10, 0], rotate: [8, -2, 8] }}
            transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="clay clay-coral absolute -right-1 -bottom-2 flex size-11 rotate-[8deg] items-center justify-center rounded-xl sm:-right-8 sm:-bottom-4 sm:size-16 sm:rounded-2xl"
          >
            <Camera className="size-5 text-white sm:size-7" strokeWidth={1.75} />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
