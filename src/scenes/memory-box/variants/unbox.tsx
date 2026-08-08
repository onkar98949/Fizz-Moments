"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { MemoryBoxData } from "../config";

const PHOTO_OFFSETS = [
  { x: -70, y: -190, rotate: -10 },
  { x: 55, y: -210, rotate: 8 },
  { x: -110, y: -110, rotate: 6 },
  { x: 95, y: -120, rotate: -7 },
  { x: -20, y: -230, rotate: 3 },
  { x: 130, y: -60, rotate: -4 },
];

export function UnboxBox({ data }: { data: MemoryBoxData }) {
  return (
    <div className="bg-background relative flex h-full w-full items-center justify-center overflow-hidden px-8">
      <div className="ambient-orb bg-warm-yellow absolute top-1/3 left-1/2 size-72 -translate-x-1/2" />

      {data.photos.map((photo, index) => {
        const offset = PHOTO_OFFSETS[index] ?? PHOTO_OFFSETS[PHOTO_OFFSETS.length - 1];
        return (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
            animate={{ opacity: 1, x: offset.x, y: offset.y, scale: 1, rotate: offset.rotate }}
            transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.9 + index * 0.32 }}
            className="absolute size-20 overflow-hidden rounded-xl border-4 border-white shadow-xl"
          >
            <Image src={photo.photoUrl} alt="" fill sizes="10vw" className="object-cover" />
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.9, scale: 1.6 }}
        transition={{ delay: 0.55, duration: 0.9, ease: "easeOut" }}
        className="bg-warm-yellow pointer-events-none absolute size-24 rounded-full blur-3xl"
      />

      <div style={{ perspective: 800 }} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex h-24 w-32 items-end justify-center rounded-b-2xl bg-gradient-to-b from-[#c98c4a] to-[#a86b32] shadow-2xl"
        >
          <span className="mb-2 text-2xl">{data.keepsakeEmoji || "🎁"}</span>
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -115 }}
            transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
            style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
            className="absolute -top-4 left-0 h-6 w-32 rounded-t-xl bg-gradient-to-b from-[#d9a05f] to-[#c98c4a]"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.7 }}
        className="absolute inset-x-8 bottom-10 flex flex-col items-center gap-1 text-center"
      >
        {data.date ? <p className="text-muted-foreground text-xs tracking-wide uppercase">{data.date}</p> : null}
        {data.note ? <p className="font-display text-foreground text-lg text-balance">{data.note}</p> : null}
      </motion.div>
    </div>
  );
}
