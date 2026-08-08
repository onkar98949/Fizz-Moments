"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ConfettiBurst } from "../confetti-burst";

type Stage = "closed" | "shaking" | "opening" | "revealed";

const EASE = [0.16, 1, 0.3, 1] as const;

const lidVariants = {
  closed: { y: 0, rotate: 0, opacity: 1 },
  shaking: { y: 0, rotate: 0, opacity: 1 },
  opening: { y: -64, rotate: -16, opacity: 0, transition: { duration: 0.6, ease: EASE } },
  revealed: { y: -64, rotate: -16, opacity: 0 },
};

const ribbonVariants = {
  closed: { opacity: 1, scale: 1 },
  shaking: { opacity: 1, scale: 1 },
  opening: { opacity: 0, scale: 0.6, transition: { duration: 0.4 } },
  revealed: { opacity: 0, scale: 0.6 },
};

const glowVariants = {
  closed: { opacity: 0 },
  shaking: { opacity: 0 },
  opening: { opacity: 1, transition: { duration: 0.5 } },
  revealed: { opacity: 1 },
};

const contentVariants = {
  closed: { y: 36, opacity: 0, scale: 0.92 },
  shaking: { y: 36, opacity: 0, scale: 0.92 },
  opening: { y: 36, opacity: 0, scale: 0.92 },
  revealed: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.15, ease: EASE } },
};

/** Small gold/white spark burst for "particles escape" — distinct from the
 *  rainbow confetti reserved for the final reveal moment, so the two beats
 *  (lid popping vs. gift appearing) read as different events. */
function SparkBurst({ triggerKey }: { triggerKey: number }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        angle: (i / 14) * 360 + Math.random() * 20,
        distance: 50 + Math.random() * 40,
        delay: Math.random() * 0.1,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- triggerKey intentionally reseeds
    [triggerKey],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute size-1.5 rounded-full bg-gradient-to-br from-white to-[#FFD166]"
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: Math.cos((s.angle * Math.PI) / 180) * s.distance,
            y: Math.sin((s.angle * Math.PI) / 180) * s.distance,
            scale: 0.3,
          }}
          transition={{ duration: 0.9, delay: s.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

type GiftBoxRevealProps = {
  title: string;
  message: string;
  photoUrl: string | null;
};

/** The animated box itself — used both for the creator's "Preview" and the
 *  real public player. Tap advances closed → shaking → opening → revealed;
 *  there's no going back, matching the one-shot feel of unwrapping a real
 *  gift rather than a replayable toggle. */
export function GiftBoxReveal({ title, message, photoUrl }: GiftBoxRevealProps) {
  const [stage, setStage] = useState<Stage>("closed");
  const [sparkKey, setSparkKey] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);

  function open() {
    if (stage !== "closed") return;
    setStage("shaking");
    window.setTimeout(() => {
      setStage("opening");
      setSparkKey((k) => k + 1);
    }, 650);
    window.setTimeout(() => {
      setStage("revealed");
      setConfettiKey((k) => k + 1);
    }, 1350);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-3xl">🎁</span>
        <h1 className="font-display text-section text-balance">{title}</h1>
      </div>

      <button
        type="button"
        onClick={open}
        disabled={stage !== "closed"}
        aria-label={stage === "closed" ? "Tap to open" : undefined}
        className="relative flex h-72 w-64 items-end justify-center"
      >
        {/* Glow from inside the box */}
        <motion.div
          aria-hidden
          variants={glowVariants}
          animate={stage}
          className="absolute inset-x-4 top-8 h-40 rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(255,214,102,0.9) 0%, rgba(255,214,102,0) 70%)" }}
        />

        {sparkKey > 0 && stage === "opening" ? <SparkBurst triggerKey={sparkKey} /> : null}

        {/* Box shakes as a whole unit during the "shaking" stage */}
        <motion.div
          className="relative flex h-56 w-52 flex-col items-center"
          animate={
            stage === "shaking"
              ? { x: [0, -6, 6, -6, 6, -3, 3, 0], rotate: [0, -2, 2, -2, 2, -1, 1, 0] }
              : { x: 0, rotate: 0 }
          }
          transition={{ duration: 0.6 }}
        >
          {/* Lid */}
          <motion.div
            variants={lidVariants}
            animate={stage}
            className="clay relative z-10 flex h-16 w-full items-center justify-center rounded-t-2xl rounded-b-md"
            style={{ background: "linear-gradient(155deg, #FF8A9B 0%, #B79CED 100%)" }}
          >
            <motion.span variants={ribbonVariants} animate={stage} className="absolute text-3xl">
              🎀
            </motion.span>
            <motion.div
              variants={ribbonVariants}
              animate={stage}
              aria-hidden
              className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-white/70"
            />
          </motion.div>

          {/* Base */}
          <div
            className="clay relative flex h-44 w-full items-center justify-center overflow-hidden rounded-b-2xl"
            style={{ background: "linear-gradient(165deg, #FF8A9B 0%, #B79CED 100%)" }}
          >
            <motion.div variants={ribbonVariants} animate={stage} aria-hidden className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-white/70" />
          </div>
        </motion.div>

        {stage === "closed" ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 5, 0] }}
            transition={{ opacity: { delay: 0.3 }, y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }}
            className="text-muted-foreground absolute -bottom-8 text-sm font-medium"
          >
            Tap to open
          </motion.span>
        ) : null}
      </button>

      {stage === "revealed" ? (
        <motion.div
          variants={contentVariants}
          initial="closed"
          animate="revealed"
          className="bg-card shadow-soft-xl relative flex w-full max-w-xs flex-col items-center gap-4 overflow-hidden rounded-3xl p-7 text-center"
        >
          <ConfettiBurst triggerKey={confettiKey} />
          {photoUrl ? (
            <div className="relative aspect-square w-full max-w-[75%] overflow-hidden rounded-2xl">
              <Image src={photoUrl} alt="" fill unoptimized className="object-cover" />
            </div>
          ) : (
            <span className="text-4xl">❤️</span>
          )}
          <p className="font-script text-primary-active text-3xl text-balance">{message}</p>
        </motion.div>
      ) : null}

      <p className="text-muted-foreground flex items-center gap-1.5 text-meta">
        <Sparkles className="size-3.5" />
        Made with FizzMoments
      </p>
    </div>
  );
}
