"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { MemoryReelData } from "../config";

export function SwipeReel({ data }: { data: MemoryReelData }) {
  const words = (data.caption ?? "").split(" ").filter(Boolean);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 1.06, x: 30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        {data.photoUrl ? <Image src={data.photoUrl} alt="" fill sizes="100vw" className="object-cover" priority /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute text-4xl"
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 1, 0], y: -130, scale: [0.6, 1.1, 1, 0.9] }}
            transition={{ duration: 1.8, delay: 0.5 + i * 0.35, repeat: Infinity, repeatDelay: 1.4, ease: "easeOut" }}
          >
            {data.emoji || "❤️"}
          </motion.span>
        ))}
      </div>

      <div className="absolute inset-x-6 bottom-12 flex flex-col gap-2">
        {data.date ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xs tracking-wide text-white/70">
            {data.date}
          </motion.p>
        ) : null}
        {words.length > 0 ? (
          <p className="font-display flex flex-wrap gap-x-1.5 text-xl text-white">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.5 + i * 0.06 }}
              >
                {word}
              </motion.span>
            ))}
          </p>
        ) : null}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        className="absolute inset-x-0 bottom-4 flex justify-center text-[10px] tracking-widest text-white/70 uppercase"
      >
        Swipe up
      </motion.div>
    </div>
  );
}
