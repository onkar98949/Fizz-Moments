"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { MusicCassetteData } from "../config";

const EQ_HEIGHTS = [40, 75, 100, 55, 85, 35, 65];

export function PlayerCassette({ data }: { data: MusicCassetteData }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image src={data.photoUrl} alt="" fill sizes="100vw" className="object-cover blur-[2px]" priority />
        <div className="absolute inset-0 bg-black/55" />
      </motion.div>

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-8">
        <motion.div
          initial={{ opacity: 0, y: -60, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.1 }}
          className="relative flex w-full max-w-[15rem] flex-col gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between rounded-lg bg-black/40 px-4 py-3">
            {[0, 1].map((reel) => (
              <motion.div
                key={reel}
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, ease: "linear", repeat: Infinity, delay: 0.6 }}
                className="relative flex size-9 items-center justify-center rounded-full border-2 border-white/60"
              >
                <span className="absolute h-full w-0.5 bg-white/50" />
                <span className="absolute h-0.5 w-full bg-white/50" />
                <span className="size-1.5 rounded-full bg-white/80" />
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-end justify-center gap-1"
            aria-hidden="true"
          >
            {EQ_HEIGHTS.map((h, i) => (
              <motion.span
                key={i}
                className="bg-primary w-1.5 rounded-full"
                animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.5}%`] }}
                transition={{ duration: 0.9 + (i % 3) * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
                style={{ height: `${h * 0.3}%` }}
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center"
        >
          <p className="font-display text-xl text-white">{data.songTitle}</p>
          <p className="text-sm text-white/70">{data.artistName}</p>
        </motion.div>

        {data.caption ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.7 }}
            className="text-center text-sm text-white/80"
          >
            {data.caption}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}
