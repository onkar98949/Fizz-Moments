"use client";

import { motion } from "framer-motion";
import type { CoverData } from "../config";
import type { StoryContext } from "../../types";

export function ClassicCover({ data, story }: { data: CoverData; story: StoryContext }) {
  return (
    <div className="bg-background relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden px-8 text-center">
      <div className="ambient-orb bg-primary absolute -top-24 -left-16 size-64" />
      <div className="ambient-orb bg-coral absolute -right-20 -bottom-16 size-72" />

      <motion.span
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative text-4xl"
      >
        {data.emoji}
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-foreground font-display relative text-3xl text-balance sm:text-4xl"
      >
        {story.title}
      </motion.h1>
      {story.subtitle ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-muted-foreground relative text-balance"
        >
          {story.subtitle}
        </motion.p>
      ) : null}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="text-ink-muted relative text-xs tracking-wide uppercase"
      >
        For {story.recipientName}
      </motion.p>
    </div>
  );
}
