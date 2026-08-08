"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { FilmGrain } from "@/animations/effects/FilmGrain";

const MOTES = [
  { left: "18%", top: "70%", delay: 0 },
  { left: "72%", top: "24%", delay: 0.8 },
  { left: "45%", top: "82%", delay: 1.6 },
  { left: "84%", top: "60%", delay: 2.4 },
  { left: "12%", top: "30%", delay: 3.2 },
  { left: "58%", top: "12%", delay: 4 },
];

/**
 * The Scene Library card runs this instead of the full `renderer.tsx` —
 * the real scene is nine layered phases over ~10s; looping all of that in a
 * thumbnail-sized card (possibly several at once, scrolling) is wasted GPU
 * work for something the user is glancing at, not watching. This is a
 * cheap, perpetual "glowing sealed letter" loop that reads instantly as
 * what the scene is, without running the actual choreography.
 */
export function LoveLetterThumbnail() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden" style={{ backgroundColor: "#FAF6EF" }}>
      <motion.div
        className="absolute -top-1/4 -left-1/4 h-3/4 w-3/4 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,214,158,0.4), transparent 70%)" }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <FilmGrain opacity={0.05} />

      {MOTES.map((m, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute size-1 rounded-full bg-[#FFE9C7]"
          style={{ left: m.left, top: m.top }}
          animate={{ opacity: [0, 0.35, 0], y: [0, -30] }}
          transition={{ duration: 3.5, delay: m.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div
        className="relative aspect-[3/2] w-40 rounded-lg"
        style={{
          background: "linear-gradient(160deg, #F3E4D0 0%, #E7D3B8 100%)",
          boxShadow: "0 14px 30px -12px rgba(0,0,0,0.32)",
        }}
      >
        <div className="absolute inset-0" style={{ clipPath: "polygon(0 0, 100% 0, 50% 62%)", background: "linear-gradient(200deg, #EFDCC2 0%, #DCC3A0 100%)" }} />

        <motion.div
          className="absolute top-[38%] left-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ background: "radial-gradient(circle at 35% 30%, #E0B091, #A8664A 70%)" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,214,158,0.9), transparent 70%)" }}
            animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.5, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <Heart className="relative size-2.5 text-[#FFEFDD]/80" fill="currentColor" strokeWidth={0} />
        </motion.div>
      </div>
    </div>
  );
}
