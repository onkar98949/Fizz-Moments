"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { getCameraRollHighlights, type CameraRollData } from "../config";

const MS_PER_HIGHLIGHT = 3000;

export function ScrollCameraRoll({ data }: { data: CameraRollData }) {
  const highlights = getCameraRollHighlights(data);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (highlights.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1 >= highlights.length ? i : i + 1));
    }, MS_PER_HIGHLIGHT);
    return () => clearInterval(interval);
  }, [highlights.length]);

  const current = highlights[index];
  const strip = [...data.photos, ...data.photos];

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div className="absolute inset-0 flex flex-col justify-center gap-1.5 opacity-40 blur-[1px]">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="animate-marquee flex gap-1.5"
            style={{ animationDuration: `${18 + row * 4}s`, animationDirection: row % 2 ? "reverse" : "normal" }}
          >
            {strip.map((p, i) => (
              <div key={`${row}-${p.id}-${i}`} className="relative size-16 shrink-0 overflow-hidden rounded-md">
                <Image src={p.photoUrl} alt="" fill sizes="10vw" className="object-cover" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/45" />

      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-6 top-16 bottom-20 overflow-hidden rounded-[1.75rem] border-4 border-white/90 shadow-2xl"
          >
            <Image src={current.photoUrl} alt="" fill sizes="80vw" className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <Heart className="size-4 fill-white text-white" />
            </div>
            {current.caption ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-x-4 bottom-4 text-sm text-white"
              >
                {current.caption}
              </motion.p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="absolute inset-x-6 top-4 z-10 flex gap-1">
        {highlights.map((h, i) => (
          <div key={h.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
            {i < index ? (
              <div className="h-full w-full bg-white/70" />
            ) : i === index ? (
              <motion.div
                className="h-full bg-white/70"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: MS_PER_HIGHLIGHT / 1000, ease: "linear" }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
