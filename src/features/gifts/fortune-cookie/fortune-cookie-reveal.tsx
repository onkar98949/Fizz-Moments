"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Fortune } from "@/types/gifts";

type Stage = "closed" | "shaking" | "split" | "revealed";
const EASE = [0.16, 1, 0.3, 1] as const;

function pickRandom(fortunes: Fortune[], excludeId?: string): Fortune {
  const pool = fortunes.length > 1 && excludeId ? fortunes.filter((f) => f.id !== excludeId) : fortunes;
  return pool[Math.floor(Math.random() * pool.length)] ?? fortunes[0];
}

export function FortuneCookieReveal({ recipientName, fortunes }: { recipientName: string; fortunes: Fortune[] }) {
  const [stage, setStage] = useState<Stage>("closed");
  const [current, setCurrent] = useState<Fortune>(() => pickRandom(fortunes));
  const [direction, setDirection] = useState(1);

  function crack() {
    setDirection((d) => -d);
    setStage("shaking");
    window.setTimeout(() => setStage("split"), 500);
    window.setTimeout(() => setStage("revealed"), 1100);
  }

  function again() {
    setCurrent((prev) => pickRandom(fortunes, prev.id));
    setStage("closed");
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {stage !== "revealed" ? (
          <motion.div
            key="cookie"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex flex-col items-center gap-5"
          >
            <p className="font-display text-card-title text-balance text-center">
              {recipientName ? `A fortune for ${recipientName}` : "Your fortune is waiting…"}
            </p>

            <motion.div
              animate={
                stage === "closed"
                  ? { y: [0, -5, 0], rotate: [0, -2, 0, 2, 0] }
                  : stage === "shaking"
                    ? { x: [0, -6, 6, -6, 6, 0], rotate: [0, -3, 3, -3, 3, 0] }
                    : {}
              }
              transition={
                stage === "closed"
                  ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.5, ease: "easeInOut" }
              }
              className="relative flex h-40 w-full items-center justify-center"
            >
              {/* Left half */}
              <motion.div
                animate={
                  stage === "split"
                    ? { x: -direction * 46, rotate: -direction * 22, opacity: 0 }
                    : { x: 0, rotate: 0, opacity: 1 }
                }
                transition={{ duration: 0.55, ease: EASE }}
                className="shadow-soft-lg absolute h-32 w-24 rounded-l-full"
                style={{
                  right: "50%",
                  background: "linear-gradient(135deg, #F0D9A8 0%, #D9B26E 100%)",
                }}
              />
              {/* Right half */}
              <motion.div
                animate={
                  stage === "split"
                    ? { x: direction * 46, rotate: direction * 22, opacity: 0 }
                    : { x: 0, rotate: 0, opacity: 1 }
                }
                transition={{ duration: 0.55, ease: EASE }}
                className="shadow-soft-lg absolute h-32 w-24 rounded-r-full"
                style={{
                  left: "50%",
                  background: "linear-gradient(225deg, #F0D9A8 0%, #D9B26E 100%)",
                }}
              />

              {/* Peeking paper strip, shared layoutId with the revealed card */}
              {stage === "split" ? (
                <motion.div
                  layoutId="fortune-paper"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: -6 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                  className="absolute h-24 w-16 rounded-sm bg-white shadow-md"
                />
              ) : null}
            </motion.div>

            {stage === "closed" ? (
              <Button size="lg" onClick={crack} className="rounded-full">
                Crack it open
              </Button>
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key="paper"
            layoutId="fortune-paper"
            transition={{ duration: 0.6, ease: EASE }}
            className="bg-card shadow-soft-xl flex w-full flex-col items-center gap-4 rounded-2xl p-8 text-center"
          >
            <span className="text-primary-active text-eyebrow font-medium uppercase">Your fortune says…</span>
            <p className="font-display text-card-title text-balance">{current.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {stage === "revealed" ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-muted-foreground flex items-center gap-1.5 text-caption italic">
            <Sparkles className="text-primary-active size-3.5" />
            Pretty accurate, huh?
          </p>
          <Button variant="outline" onClick={again} className="rounded-full">
            <RotateCcw className="size-4" />
            {fortunes.length > 1 ? "One more?" : "Crack again"}
          </Button>
        </motion.div>
      ) : null}
    </div>
  );
}
