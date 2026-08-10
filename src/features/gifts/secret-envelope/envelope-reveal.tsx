"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, RotateCcw, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EnvelopeStyle } from "@/types/gifts";

const THEMES: Record<EnvelopeStyle, { body: string; flap: string; seal: string; paper: string; ink: string; accent: string }> = {
  classic: { body: "#F3E6D0", flap: "#E8D4B0", seal: "#B5432F", paper: "#FFFDF7", ink: "#2B2418", accent: "#B5432F" },
  minimal: { body: "#F1F1EC", flap: "#E4E4DD", seal: "#1B1B1F", paper: "#FFFFFF", ink: "#1B1B1F", accent: "#5EAD27" },
  romantic: { body: "#FBE4E8", flap: "#F6CCD4", seal: "#C0447A", paper: "#FFFBFA", ink: "#3A1E28", accent: "#C0447A" },
  vintage: { body: "#E4D3AC", flap: "#D6C093", seal: "#7A2E12", paper: "#F6EFDD", ink: "#3B2E1A", accent: "#7A2E12" },
  playful: { body: "#FFD9E8", flap: "#FFC2DC", seal: "#FF6B9D", paper: "#FFFFFF", ink: "#3A1730", accent: "#FF6B9D" },
};

const SEAL_ICON: Record<EnvelopeStyle, typeof Heart> = {
  classic: Star,
  minimal: Star,
  romantic: Heart,
  vintage: Star,
  playful: Heart,
};

type Stage = "closed" | "opening" | "peeking" | "revealed";
const EASE = [0.16, 1, 0.3, 1] as const;

type EnvelopeRevealProps = {
  style: EnvelopeStyle;
  recipientName: string;
  letterTitle: string;
  message: string;
  senderName: string;
  photoUrl: string | null;
};

export function EnvelopeReveal({ style, recipientName, letterTitle, message, senderName, photoUrl }: EnvelopeRevealProps) {
  const [stage, setStage] = useState<Stage>("closed");
  const theme = THEMES[style];
  const SealIcon = SEAL_ICON[style];
  const paragraphs = message.split("\n").filter((p) => p.trim().length > 0);

  function open() {
    setStage("opening");
    window.setTimeout(() => setStage("peeking"), 700);
    window.setTimeout(() => setStage("revealed"), 1500);
  }

  function replay() {
    setStage("closed");
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {stage !== "revealed" ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center gap-5"
          >
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-card-title text-balance"
            >
              To {recipientName || "you"}
            </motion.p>

            <div className="relative w-full" style={{ perspective: 1200 }}>
              <motion.div
                animate={stage === "closed" ? { y: [0, -6, 0] } : { y: 0 }}
                transition={stage === "closed" ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                className="relative aspect-[4/3] w-full"
              >
                {/* Envelope body */}
                <div
                  className="shadow-soft-xl absolute inset-0 rounded-2xl"
                  style={{ background: theme.body }}
                />

                {/* Peeking paper corner, layoutId shared with the full letter card */}
                {stage === "peeking" ? (
                  <motion.div
                    layoutId="envelope-paper"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -14 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="absolute inset-x-6 top-2 aspect-[3/4] rounded-t-md rounded-b-sm"
                    style={{ background: theme.paper, boxShadow: "0 -4px 16px rgba(0,0,0,0.12)" }}
                  />
                ) : null}

                {/* Flap */}
                <motion.div
                  animate={{ rotateX: stage === "closed" ? 0 : -160 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute inset-x-0 top-0 h-1/2 origin-top"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      background: theme.flap,
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      borderRadius: "16px 16px 0 0",
                    }}
                  />
                </motion.div>

                {/* Wax seal */}
                {stage === "closed" ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 18 }}
                    className="absolute top-[42%] left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full shadow-md"
                    style={{ background: theme.seal }}
                  >
                    <SealIcon className="size-4 fill-white text-white" strokeWidth={1.5} />
                  </motion.span>
                ) : null}
              </motion.div>
            </div>

            {stage === "closed" ? (
              <>
                <p className="text-muted-foreground text-caption">You have a letter.</p>
                <Button size="lg" onClick={open} className="rounded-full">
                  Open it
                </Button>
              </>
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            layoutId="envelope-paper"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="shadow-soft-xl flex w-full flex-col gap-4 rounded-2xl p-7"
            style={{ background: theme.paper, color: theme.ink }}
          >
            {photoUrl ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-lg"
              >
                <Image src={photoUrl} alt="" fill unoptimized className="object-cover" />
              </motion.div>
            ) : null}

            {letterTitle ? (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-muted-foreground text-meta font-medium tracking-wide uppercase"
                style={{ color: theme.accent, opacity: 0.75 }}
              >
                {letterTitle}
              </motion.p>
            ) : null}

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-script text-3xl"
              style={{ color: theme.accent }}
            >
              Dear {recipientName || "you"},
            </motion.p>

            <div className="flex flex-col gap-3">
              {paragraphs.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.22, duration: 0.5, ease: EASE }}
                  className="text-body-lg leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + paragraphs.length * 0.22 + 0.2, duration: 0.5 }}
              className="font-script self-end text-2xl"
              style={{ color: theme.accent }}
            >
              — {senderName || "someone who loves you"} ❤️
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {stage === "revealed" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + paragraphs.length * 0.22 + 0.6, duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-muted-foreground flex items-center gap-1.5 text-caption italic">
            <Sparkles className="text-primary-active size-3.5" />
            Some things are better written down.
          </p>
          <Button variant="outline" onClick={replay} className="rounded-full">
            <RotateCcw className="size-4" />
            Read again
          </Button>
        </motion.div>
      ) : null}
    </div>
  );
}
