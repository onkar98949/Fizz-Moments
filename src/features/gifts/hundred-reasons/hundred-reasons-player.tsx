"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { ConfettiBurst } from "../confetti-burst";
import type { HundredReasonsData } from "@/types/gifts";

const EASE = [0.16, 1, 0.3, 1] as const;

type View = "intro" | "reason" | "halfway" | "final";

export function HundredReasonsPlayer({ gift }: { gift: HundredReasonsData }) {
  const total = gift.reasons.length;
  const halfwayIndex = total >= 10 ? Math.floor(total / 2) - 1 : -1;

  const [view, setView] = useState<View>("intro");
  const [index, setIndex] = useState(0);
  const [seenHalfway, setSeenHalfway] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const reason = gift.reasons[index];

  function next() {
    if (view === "intro") {
      setView("reason");
      return;
    }
    if (view === "halfway") {
      setSeenHalfway(true);
      setView("reason");
      setIndex((i) => i + 1);
      return;
    }
    if (index === total - 1) {
      setView("final");
      setConfettiKey((k) => k + 1);
      return;
    }
    if (index === halfwayIndex && !seenHalfway) {
      setView("halfway");
      return;
    }
    setIndex((i) => i + 1);
  }

  function prev() {
    if (view === "final") {
      setView("reason");
      return;
    }
    if (view === "halfway") {
      setView("reason");
      return;
    }
    if (index > 0) setIndex((i) => i - 1);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-16">
      {view === "intro" ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <span className="text-3xl">💚</span>
          <h1 className="font-display text-hero text-balance">{gift.title || `${total} reasons.`}</h1>
          <p className="text-muted-foreground text-body-lg">You probably know some of them already.</p>
          <motion.button
            type="button"
            onClick={next}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-primary text-primary-foreground shadow-soft mt-2 rounded-full px-8 py-3.5 text-base font-medium"
          >
            Show me one
          </motion.button>
        </motion.div>
      ) : (
        <>
          {view === "reason" ? (
            <div className="bg-secondary h-1.5 w-full max-w-sm overflow-hidden rounded-full">
              <motion.div
                className="bg-primary h-full rounded-full"
                animate={{ width: `${((index + 1) / total) * 100}%` }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            {view === "reason" ? (
              <motion.div
                key={reason.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex w-full max-w-sm flex-col items-center gap-6 text-center"
              >
                <span className="text-muted-foreground text-eyebrow font-medium uppercase">
                  Reason #{String(index + 1).padStart(2, "0")} / {total}
                </span>

                {reason.photoUrl ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-soft-lg">
                    <Image src={reason.photoUrl} alt="" fill unoptimized className="object-cover" />
                  </div>
                ) : null}

                <p className="font-display text-hero text-balance">{reason.text}</p>
              </motion.div>
            ) : view === "halfway" ? (
              <motion.div
                key="halfway"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <p className="font-script text-primary-active text-4xl">Halfway there ❤️</p>
              </motion.div>
            ) : (
              <motion.div
                key="final"
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="bg-card shadow-soft-xl relative flex w-full max-w-sm flex-col items-center gap-4 overflow-hidden rounded-3xl p-8 text-center"
              >
                <ConfettiBurst triggerKey={confettiKey} />
                <p className="font-display text-card-title">That&apos;s only {total}.</p>
                <p className="text-muted-foreground text-caption">
                  Ask me tomorrow and I&apos;ll give you {total} more.
                </p>
                {gift.finalMessage ? (
                  <p className="font-script text-primary-active mt-2 text-3xl text-balance">{gift.finalMessage}</p>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          {view !== "final" ? (
            <div className="flex items-center gap-6">
              <button
                type="button"
                aria-label="Previous"
                onClick={prev}
                disabled={index === 0 && view === "reason"}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={next}
                className="bg-secondary hover:bg-secondary/70 rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
              >
                {view === "halfway" ? "Keep going" : "Next reason"}
              </button>
              <button type="button" aria-label="Next" onClick={next} className="text-muted-foreground hover:text-foreground">
                <ChevronRight className="size-6" />
              </button>
            </div>
          ) : null}
        </>
      )}

      <p className="text-muted-foreground flex items-center gap-1.5 text-meta">
        <Sparkles className="size-3.5" />
        Made with FizzMoments
      </p>
    </div>
  );
}
