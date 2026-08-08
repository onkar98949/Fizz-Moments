"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { FirstDateData } from "../config";

export function CafeFirstDate({ data }: { data: FirstDateData }) {
  return (
    <motion.div
      initial={{ scale: 1.05 }}
      animate={{ scale: 1 }}
      transition={{ duration: 5, ease: "easeOut" }}
      className="relative flex h-full w-full flex-col items-center justify-end overflow-hidden bg-gradient-to-b from-[#f3d9b1] to-[#e2a86f]"
    >
      <div className="ambient-orb bg-warm-yellow absolute -top-10 left-1/2 size-64 -translate-x-1/2" />

      <div className="relative flex w-full max-w-xs items-end justify-center gap-10 pb-6">
        {[0, 1].map((cup) => (
          <div key={cup} className="relative flex flex-col items-center">
            {[0, 1, 2].map((wisp) => (
              <motion.span
                key={wisp}
                className="absolute -top-6 h-8 w-1.5 rounded-full bg-white/60 blur-[2px]"
                style={{ left: wisp * 6 - 6 }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.7, 0], y: -34 }}
                transition={{ duration: 2.4, delay: cup * 0.4 + wisp * 0.5, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
            <span className="text-4xl">☕</span>
          </div>
        ))}
      </div>
      <div className="h-6 w-full max-w-[17rem] rounded-t-2xl bg-[#8a5a34]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
        className="absolute inset-x-8 top-16 flex flex-col items-center gap-3 rounded-[1.5rem] border-4 border-white bg-white p-2 shadow-2xl"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          {data.photoUrl ? <Image src={data.photoUrl} alt="" fill sizes="80vw" className="object-cover" /> : null}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.7 }}
        className="relative z-10 flex flex-col items-center gap-0.5 px-6 pb-24 text-center"
      >
        {data.location || data.date ? (
          <p className="text-xs font-medium tracking-wide text-[#5c3a1d]/80">
            {[data.location, data.date].filter(Boolean).join(" · ")}
          </p>
        ) : null}
        {data.caption ? <p className="font-display text-lg text-[#3f2712]">{data.caption}</p> : null}
      </motion.div>
    </motion.div>
  );
}
