"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REACTIONS } from "@/constants/story";
import type { ReactionType } from "@/types/story";
import { cn } from "@/lib/utils";

type ReactionBarProps = {
  onReact: (reaction: ReactionType) => void | Promise<void>;
  className?: string;
};

export function ReactionBar({ onReact, className }: ReactionBarProps) {
  const [sent, setSent] = useState<ReactionType | null>(null);

  async function handleReact(reaction: ReactionType) {
    if (sent) return;
    setSent(reaction);
    await onReact(reaction);
  }

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="flex items-center gap-3">
        {REACTIONS.map(({ value, emoji, label }) => (
          <motion.button
            key={value}
            type="button"
            aria-label={label}
            onClick={() => handleReact(value)}
            whileHover={{ scale: sent ? 1 : 1.12 }}
            whileTap={{ scale: 0.9 }}
            disabled={Boolean(sent)}
            className={cn(
              "glass-surface flex size-14 items-center justify-center rounded-full text-2xl shadow-soft transition-opacity",
              sent && sent !== value && "opacity-40",
              sent === value && "border-primary",
            )}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {sent ? (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-muted-foreground text-sm"
          >
            Thanks for sharing that ✨
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
