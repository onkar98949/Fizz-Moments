"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, Lightbulb, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfettiBurst } from "../confetti-burst";
import type { TreasureHuntData } from "@/types/gifts";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

type TreasureHuntPlayerProps = { hunt: TreasureHuntData };

/** The public, recipient-facing hunt: one clue at a time, each solved by
 *  entering its code before the next unlocks — deliberately no "skip"
 *  affordance, since the point is the sequence of small discoveries, not
 *  just reaching the end. */
export function TreasureHuntPlayer({ hunt }: TreasureHuntPlayerProps) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [shake, setShake] = useState(0);
  const [finished, setFinished] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const clue = hunt.clues[index];
  const isLastClue = index === hunt.clues.length - 1;
  const progress = finished ? 100 : (index / hunt.clues.length) * 100;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!clue || !input.trim()) return;

    if (normalize(input) === normalize(clue.code)) {
      setInput("");
      setShowHint(false);
      if (isLastClue) {
        setFinished(true);
        setBurstKey((k) => k + 1);
      } else {
        setIndex((i) => i + 1);
      }
    } else {
      setShake((s) => s + 1);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-3xl">🗺️</span>
        <h1 className="font-display text-section text-balance">{hunt.title}</h1>
        <p className="text-muted-foreground text-caption">Solve each clue to continue the hunt.</p>
      </div>

      <div className="bg-secondary h-1.5 w-full max-w-xs overflow-hidden rounded-full">
        <motion.div
          className="bg-primary h-full rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card shadow-soft-xl flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl p-8 text-center"
          >
            <span className="text-muted-foreground text-meta font-medium tracking-wide uppercase">
              Clue {index + 1} of {hunt.clues.length}
            </span>

            {clue?.photoUrl ? (
              <div className="relative aspect-square w-full max-w-[75%] overflow-hidden rounded-2xl">
                <Image src={clue.photoUrl} alt="" fill unoptimized className="object-cover" />
              </div>
            ) : (
              <span className="bg-accent flex size-16 items-center justify-center rounded-full">
                <MapPin className="text-primary-active size-7" />
              </span>
            )}

            <p className="font-display text-card-title text-balance">{clue?.text}</p>

            <form onSubmit={submit} className="flex w-full flex-col gap-3">
              <motion.div
                key={shake}
                initial={{ x: 0 }}
                animate={{ x: shake > 0 ? [0, -10, 10, -8, 8, -4, 4, 0] : 0 }}
                transition={{ duration: 0.45 }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter the code"
                  className="text-center"
                  autoFocus
                />
                <Button type="submit" size="icon-lg" aria-label="Unlock">
                  <KeyRound className="size-4" />
                </Button>
              </motion.div>

              {clue?.hint ? (
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowHint((v) => !v)}
                    className="text-primary-active flex items-center gap-1 text-sm font-medium"
                  >
                    <Lightbulb className="size-3.5" />
                    {showHint ? "Hide hint" : "Need a hint?"}
                  </button>
                  <AnimatePresence>
                    {showHint ? (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-muted-foreground text-caption"
                      >
                        {clue.hint}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>
              ) : null}
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="final"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card shadow-soft-xl relative flex w-full max-w-sm flex-col items-center gap-5 overflow-hidden rounded-3xl p-8 text-center"
          >
            <ConfettiBurst triggerKey={burstKey} />
            <span className="text-primary-active flex items-center gap-1.5 text-meta font-medium tracking-wide uppercase">
              <Sparkles className="size-3.5" />
              You found it
            </span>
            {hunt.finalPhotoUrl ? (
              <div className="relative aspect-square w-full max-w-[75%] overflow-hidden rounded-2xl">
                <Image src={hunt.finalPhotoUrl} alt="" fill unoptimized className="object-cover" />
              </div>
            ) : null}
            <p className="font-script text-primary-active text-3xl text-balance">{hunt.finalMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-muted-foreground flex items-center gap-1.5 text-meta">
        <Sparkles className="size-3.5" />
        Made with FizzMoments
      </p>
    </div>
  );
}
