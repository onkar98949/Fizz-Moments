"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { FilmGrain } from "@/animations/effects/FilmGrain";

/**
 * "Full-bleed photo, slow continuous camera drift, heading + caption rise
 * from the bottom" — the shared shape behind any scene that's fundamentally
 * a single themed photo moment (Landmark Memory, Sunset Memory, Forever
 * today). The photo never settles into a static hold: it keeps a slow
 * push-and-drift going for the scene's entire life, like a camera operator
 * holding a shot rather than a UI panel that finished animating. Each caller
 * supplies its own `decoration` overlay (a pin drop, a sunset gradient,
 * drifting particles) so the scenes stay visually distinct.
 */
type PhotoRevealProps = {
  photoUrl: string;
  heading?: string;
  caption?: string;
  decoration?: ReactNode;
  overlayClassName?: string;
};

export function PhotoReveal({ photoUrl, heading, caption, decoration, overlayClassName }: PhotoRevealProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 1.22, x: 0, y: 10 }}
        animate={{ opacity: 1, scale: 1.06, x: -6, y: -10 }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 9, ease: "easeInOut" },
          x: { duration: 9, ease: "easeInOut" },
          y: { duration: 9, ease: "easeInOut" },
        }}
        className="absolute inset-0"
      >
        {photoUrl ? <Image src={photoUrl} alt="" fill sizes="100vw" className="object-cover" priority /> : null}
        <div className={overlayClassName ?? "absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/20"} />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 min(22vw,10rem) rgba(0,0,0,0.55)" }}
      />
      <FilmGrain opacity={0.06} />

      {decoration}

      <div className="relative z-10 flex h-full flex-col items-center justify-end gap-1 px-8 pb-14 text-center">
        {heading ? (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="font-display text-2xl text-white"
          >
            {heading}
          </motion.p>
        ) : null}
        {caption ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="text-sm text-white/80"
          >
            {caption}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}
