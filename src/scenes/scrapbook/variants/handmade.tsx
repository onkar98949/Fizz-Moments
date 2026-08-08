"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getScrapbookCharDelay, type ScrapbookData } from "../config";

const PHOTO_LAYOUT = [
  { top: "6%", left: "8%", width: "42%" },
  { top: "5%", left: "52%", width: "42%" },
  { top: "34%", left: "26%", width: "44%" },
  { top: "38%", left: "6%", width: "36%" },
  { top: "58%", left: "50%", width: "40%" },
];

const STICKER_LAYOUT = [
  { top: "3%", left: "80%" },
  { top: "82%", left: "8%" },
  { top: "12%", left: "3%" },
  { top: "80%", left: "78%" },
];

export function HandmadeScrapbook({ data }: { data: ScrapbookData }) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    const delay = getScrapbookCharDelay(data.note.length);
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setVisibleChars(count);
      if (count >= data.note.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [data.note]);

  return (
    <div className="bg-background relative flex h-full w-full flex-col overflow-hidden px-6 pt-16 pb-24">
      <div className="ambient-orb bg-warm-yellow absolute -top-16 -left-10 size-56" />
      <div className="ambient-orb bg-coral absolute -right-14 bottom-10 size-64" />

      <div className="relative flex-1">
        {data.photos.map((photo, index) => {
          const layout = PHOTO_LAYOUT[index] ?? PHOTO_LAYOUT[PHOTO_LAYOUT.length - 1];
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: -30, rotate: 0, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, rotate: photo.rotation, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 + index * 0.28 }}
              className="absolute overflow-hidden rounded-sm border-4 border-white bg-white shadow-lg"
              style={{ top: layout.top, left: layout.left, width: layout.width, aspectRatio: "1 / 1" }}
            >
              <div className="relative h-full w-full">
                <Image src={photo.photoUrl} alt="" fill sizes="50vw" className="object-cover" />
              </div>
              <motion.span
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.4 + index * 0.28, duration: 0.3 }}
                className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 -rotate-6 bg-white/70"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
              />
            </motion.div>
          );
        })}

        {(data.stickers ?? []).map((sticker, index) => {
          const pos = STICKER_LAYOUT[index] ?? STICKER_LAYOUT[STICKER_LAYOUT.length - 1];
          return (
            <motion.span
              key={`${sticker}-${index}`}
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 14, delay: 1.4 + index * 0.15 }}
              className="absolute text-3xl drop-shadow-sm"
              style={{ top: pos.top, left: pos.left }}
            >
              {sticker}
            </motion.span>
          );
        })}
      </div>

      <div className="relative flex flex-col items-center gap-1 text-center">
        {data.date ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-muted-foreground text-xs tracking-wide uppercase"
          >
            {data.date}
          </motion.p>
        ) : null}
        <p className="font-script text-foreground max-w-xs text-2xl leading-snug">
          {data.note.slice(0, visibleChars)}
          <span className="text-primary animate-pulse">▍</span>
        </p>
      </div>
    </div>
  );
}
