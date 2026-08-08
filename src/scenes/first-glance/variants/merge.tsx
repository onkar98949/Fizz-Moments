"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { FirstGlanceData } from "../config";

const HEARTS = [
  { left: "20%", delay: 0 },
  { left: "70%", delay: 0.6 },
  { left: "45%", delay: 1.2 },
  { left: "85%", delay: 1.8 },
  { left: "10%", delay: 2.4 },
];

export function MergeGlance({ data }: { data: FirstGlanceData }) {
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    setShowPhoto(false);
    const t = setTimeout(() => setShowPhoto(true), 1100);
    return () => clearTimeout(t);
  }, [data.photoUrl]);

  return (
    <div className="bg-background relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      {HEARTS.map((h, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute bottom-0 text-lg"
          style={{ left: h.left }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: -260 }}
          transition={{ duration: 4.5, delay: h.delay, repeat: Infinity, repeatDelay: 1, ease: "easeOut" }}
        >
          💕
        </motion.span>
      ))}

      {!showPhoto ? (
        <div className="relative flex h-52 w-full items-end justify-center">
          <motion.div
            initial={{ x: -70, opacity: 0 }}
            animate={{ x: -10, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute bottom-0 h-40 w-28 rounded-t-full bg-[color-mix(in_oklch,var(--foreground)_75%,transparent)]"
          />
          <motion.div
            initial={{ x: 70, opacity: 0 }}
            animate={{ x: 10, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute bottom-0 h-40 w-28 rounded-t-full bg-[color-mix(in_oklch,var(--primary)_70%,transparent)]"
          />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="absolute inset-0">
          {data.photoUrl ? <Image src={data.photoUrl} alt="" fill sizes="100vw" className="object-cover" priority /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        </motion.div>
      )}

      {showPhoto ? (
        <div className="relative z-10 mt-auto flex flex-col items-center gap-1 px-8 pb-14 text-center">
          {data.title ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-xs tracking-widest text-white/70 uppercase"
            >
              {data.title}
            </motion.p>
          ) : null}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="font-display text-3xl text-white"
          >
            {data.nameA} <span className="text-primary">&</span> {data.nameB}
          </motion.p>
        </div>
      ) : null}
    </div>
  );
}
