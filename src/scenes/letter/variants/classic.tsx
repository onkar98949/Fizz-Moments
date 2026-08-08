"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLetterCharDelay, type LetterData } from "../config";
import type { StoryContext } from "../../types";

export function ClassicLetter({ data, story }: { data: LetterData; story: StoryContext }) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    const delay = getLetterCharDelay(data.message.length);
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setVisibleChars(count);
      if (count >= data.message.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [data.message]);

  return (
    <div className="bg-background flex h-full w-full flex-col items-center justify-center px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex max-h-full w-full max-w-md flex-col gap-4 overflow-y-auto"
      >
        <p className="font-display text-foreground text-2xl">Dear {story.recipientName},</p>
        <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
          {data.message.slice(0, visibleChars)}
          <span className="text-primary animate-pulse">▍</span>
        </p>
      </motion.div>
    </div>
  );
}
