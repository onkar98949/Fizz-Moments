"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ScratchCanvas } from "./scratch-canvas";
import { ConfettiBurst } from "../confetti-burst";
import type { ScratchCard } from "@/types/gifts";

type ScratchCardTileProps = {
  card: ScratchCard;
  onRevealed: () => void;
};

/** One physical "ticket" — the reward content sits underneath, the foil
 *  scratch layer sits on top. Revealing fires a confetti burst and a soft
 *  glow pulse around the card, then tells the parent so it can unlock the
 *  "next card" affordance. */
export function ScratchCardTile({ card, onRevealed }: ScratchCardTileProps) {
  const [revealed, setRevealed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  function handleRevealed() {
    setRevealed(true);
    setBurstKey((k) => k + 1);
    onRevealed();
  }

  return (
    <div className="relative mx-auto w-full max-w-xs">
      <motion.div
        animate={revealed ? { boxShadow: ["0 0 0 0 rgba(255,138,101,0)", "0 0 0 14px rgba(255,138,101,0.15)", "0 0 0 0 rgba(255,138,101,0)"] } : {}}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="shadow-soft-xl relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-white"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <span className="text-muted-foreground text-meta font-medium tracking-wide uppercase">{card.title}</span>
          {card.photoUrl ? (
            <div className="relative aspect-square w-full max-w-[70%] overflow-hidden rounded-2xl">
              <Image src={card.photoUrl} alt="" fill unoptimized className="object-cover" />
            </div>
          ) : (
            <span className="text-4xl">❤️</span>
          )}
          <p className="font-display text-card-title text-balance">{card.reward}</p>
        </div>

        <ScratchCanvas onRevealed={handleRevealed} />
        {revealed ? <ConfettiBurst triggerKey={burstKey} /> : null}
      </motion.div>
    </div>
  );
}
