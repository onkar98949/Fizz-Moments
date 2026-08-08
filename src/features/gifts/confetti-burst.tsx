"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#FF8A65", "#B79CED", "#8CD94A", "#FFD166", "#8FD3FF", "#FF6B9D"];

/** A lightweight confetti burst — no canvas, no dependency, just a handful
 *  of Framer Motion particles shot up and out, then falling while fading.
 *  Remounts (and replays) whenever `triggerKey` changes. Shared across every
 *  Romantic Interactive Gift's reveal moment, not reinvented per gift. */
export function ConfettiBurst({ triggerKey }: { triggerKey: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 280,
        rotate: Math.random() * 360 - 180,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.12,
        width: 5 + Math.random() * 5,
        height: 8 + Math.random() * 6,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- triggerKey intentionally reseeds the burst
    [triggerKey],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-start justify-center overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-1/3"
          style={{ width: p.width, height: p.height, backgroundColor: p.color, borderRadius: 2 }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{ opacity: [1, 1, 0], x: p.x, y: [0, -50, 170], rotate: p.rotate }}
          transition={{ duration: 1.5, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}
