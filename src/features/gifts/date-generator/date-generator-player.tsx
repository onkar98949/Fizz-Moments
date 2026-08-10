"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock3, Gauge, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfettiBurst } from "../confetti-burst";
import type { DateGeneratorData, DateIdea } from "@/types/gifts";

const EASE = [0.16, 1, 0.3, 1] as const;

function randomIdea(ideas: DateIdea[], excludeId?: string): DateIdea {
  const pool = ideas.length > 1 && excludeId ? ideas.filter((i) => i.id !== excludeId) : ideas;
  return pool[Math.floor(Math.random() * pool.length)] ?? ideas[0];
}

export function DateGeneratorPlayer({ generator }: { generator: DateGeneratorData }) {
  const [displayed, setDisplayed] = useState<DateIdea | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  async function spin() {
    setIsSpinning(true);
    setConfirmed(false);
    let delay = 55;
    let last = displayed?.id;
    for (let i = 0; i < 12; i++) {
      await new Promise((resolve) => window.setTimeout(resolve, delay));
      const next = randomIdea(generator.ideas, last);
      last = next.id;
      setDisplayed(next);
      delay += 18;
    }
    setIsSpinning(false);
    setConfettiKey((k) => k + 1);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-3xl">🎲</span>
        <h1 className="font-display text-section text-balance">{generator.title}</h1>
        {!displayed ? <p className="text-muted-foreground text-caption">What should we do tonight?</p> : null}
      </div>

      <div className="relative flex w-full max-w-sm flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          {displayed ? (
            <motion.div
              key={isSpinning ? displayed.id : "final"}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: isSpinning ? 0.12 : 0.4, ease: EASE }}
              className="bg-card shadow-soft-xl relative flex w-full flex-col items-center gap-4 overflow-hidden rounded-3xl p-8 text-center"
            >
              {!isSpinning ? <ConfettiBurst triggerKey={confettiKey} /> : null}
              {!isSpinning ? (
                <span className="text-muted-foreground text-eyebrow font-medium uppercase">Tonight&apos;s date</span>
              ) : null}
              <p className="font-display text-card-title text-balance">{displayed.text}</p>

              {!isSpinning ? (
                <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="size-3.5" />
                    {displayed.difficulty}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="size-3.5" />
                    {displayed.budget}
                  </span>
                  {displayed.timeEstimate ? (
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="size-3.5" />
                      {displayed.timeEstimate}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-secondary/60 flex aspect-[4/3] w-full items-center justify-center rounded-3xl"
            >
              <span className="text-4xl">🎲</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSpinning ? (
          <div className="flex w-full flex-col items-center gap-3">
            {!displayed ? (
              <Button size="lg" onClick={spin} className="rounded-full">
                Pick our date
              </Button>
            ) : confirmed ? (
              <p className="text-primary-active flex items-center gap-1.5 text-sm font-medium">
                <Check className="size-4" />
                Let&apos;s do it — have fun! 🎉
              </p>
            ) : (
              <div className="flex items-center gap-3">
                <Button size="lg" onClick={() => setConfirmed(true)} className="rounded-full">
                  Let&apos;s do it
                </Button>
                <Button size="lg" variant="outline" onClick={spin} className="rounded-full">
                  Spin again
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <p className="text-muted-foreground flex items-center gap-1.5 text-meta">
        <Sparkles className="size-3.5" />
        Made with FizzMoments
      </p>
    </div>
  );
}
