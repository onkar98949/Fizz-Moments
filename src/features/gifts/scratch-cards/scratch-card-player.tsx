"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScratchCardTile } from "./scratch-card-tile";
import type { ScratchCardGiftData } from "@/types/gifts";

type ScratchCardPlayerProps = {
  gift: ScratchCardGiftData;
};

/** The public, recipient-facing experience: one ticket at a time, "lottery
 *  ticket" style — scratch it, then the next one unlocks. Deliberately not
 *  a grid: a chain of one-at-a-time reveals is what makes each surprise
 *  land on its own instead of being scanned all at once. */
export function ScratchCardPlayer({ gift }: ScratchCardPlayerProps) {
  const [index, setIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [replayNonce, setReplayNonce] = useState(0);
  const isLast = index === gift.cards.length - 1;
  const finished = isRevealed && isLast;

  function goNext() {
    if (isLast) return;
    setIndex((i) => i + 1);
    setIsRevealed(false);
  }

  function replay() {
    setIndex(0);
    setIsRevealed(false);
    setReplayNonce((n) => n + 1);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-3xl">🎟️</span>
        <h1 className="font-display text-section text-balance">{gift.title}</h1>
        <p className="text-muted-foreground text-caption">Scratch each card to reveal what&apos;s underneath.</p>
      </div>

      <div className="flex items-center gap-1.5">
        {gift.cards.map((card, i) => (
          <span
            key={card.id}
            className={
              i === index
                ? "bg-primary h-2 w-6 rounded-full transition-all"
                : i < index
                  ? "bg-primary/50 h-2 w-2 rounded-full transition-all"
                  : "bg-secondary h-2 w-2 rounded-full transition-all"
            }
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key={`${index}-${replayNonce}`}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xs"
          >
            <ScratchCardTile card={gift.cards[index]} onRevealed={() => setIsRevealed(true)} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex min-h-11 items-center">
        {isRevealed && !isLast ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button onClick={goNext} size="lg">
              Next Card
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        ) : null}

        {finished ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="font-script text-primary-active text-3xl">That&apos;s all of them!</p>
            <Button variant="outline" onClick={replay} className="rounded-full">
              <RotateCcw className="size-4" />
              Replay
            </Button>
          </motion.div>
        ) : null}
      </div>

      <p className="text-muted-foreground flex items-center gap-1.5 text-meta">
        <Sparkles className="size-3.5" />
        Made with FizzMoments
      </p>
    </div>
  );
}
