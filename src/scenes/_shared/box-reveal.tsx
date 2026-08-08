"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { FilmGrain } from "@/animations/effects/FilmGrain";

/**
 * The "box/case opens, glow emerges, content takes over" mechanic — reused
 * across any scene whose animation is fundamentally an opening reveal
 * (The Promise's ring box today; Gift Box, Appreciation Gift, etc. reuse
 * this too rather than re-implementing the same lid-rotate choreography).
 * The revealed content keeps a slow ambient float + glow pulse for the rest
 * of the scene instead of freezing the instant it appears.
 */
type BoxRevealProps = {
  icon?: string;
  colorFrom?: string;
  colorTo?: string;
  openDelayMs?: number;
  children: ReactNode;
};

const MOTES = [
  { left: "20%", delay: 0 },
  { left: "75%", delay: 0.5 },
  { left: "45%", delay: 1 },
  { left: "60%", delay: 1.6 },
];

export function BoxReveal({ icon = "🎁", colorFrom = "#c98c4a", colorTo = "#a86b32", openDelayMs = 500, children }: BoxRevealProps) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), openDelayMs);
    const t2 = setTimeout(() => setPhase(2), openDelayMs + 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [openDelayMs]);

  return (
    <div className="bg-background relative flex h-full w-full items-center justify-center overflow-hidden px-8">
      <FilmGrain opacity={0.045} />

      {phase >= 1
        ? MOTES.map((mote, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute bottom-1/3 size-1 rounded-full"
              style={{ left: mote.left, backgroundColor: colorFrom }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.9, 0], y: -180 }}
              transition={{ duration: 3.6, delay: mote.delay, repeat: Infinity, repeatDelay: 0.6, ease: "easeOut" }}
            />
          ))
        : null}

      <motion.div
        animate={{ opacity: phase < 2 ? 1 : 0, scale: phase < 2 ? 1 : 0.7 }}
        transition={{ duration: 0.5 }}
        className="absolute flex flex-col items-center"
        style={{ perspective: 800 }}
      >
        <div
          className="relative flex h-20 w-28 items-end justify-center rounded-b-2xl shadow-2xl"
          style={{ backgroundImage: `linear-gradient(180deg, ${colorFrom}, ${colorTo})` }}
        >
          <span className="mb-2 text-2xl">{icon}</span>
          <motion.div
            animate={{ rotateX: phase >= 1 ? -115 : 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ transformOrigin: "top", transformStyle: "preserve-3d", backgroundImage: `linear-gradient(180deg, ${colorFrom}, ${colorTo})` }}
            className="absolute -top-4 left-0 h-6 w-28 rounded-t-xl"
          />
        </div>
        {phase >= 1 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.9, scale: 1.8 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="pointer-events-none absolute top-4 size-20 rounded-full blur-3xl"
            style={{ backgroundColor: colorFrom }}
          />
        ) : null}
      </motion.div>

      {phase >= 2 ? (
        <motion.div
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1.4, 1.7, 1.4] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute size-28 rounded-full blur-3xl"
          style={{ backgroundColor: colorFrom }}
        />
      ) : null}

      <motion.div
        animate={{
          opacity: phase >= 2 ? 1 : 0,
          scale: phase >= 2 ? 1 : 0.9,
          y: phase >= 2 ? [0, -6, 0] : 0,
        }}
        transition={{
          opacity: { duration: 0.7, ease: "easeOut" },
          scale: { duration: 0.7, ease: "easeOut" },
          y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
        }}
        className="relative z-10 flex w-full flex-col items-center"
      >
        {children}
      </motion.div>
    </div>
  );
}
