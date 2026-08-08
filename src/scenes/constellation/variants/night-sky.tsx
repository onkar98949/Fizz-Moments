"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ConstellationData } from "../config";

const BACKGROUND_STARS = [
  { top: "8%", left: "12%", size: 2, delay: 0 },
  { top: "14%", left: "82%", size: 3, delay: 0.4 },
  { top: "22%", left: "45%", size: 2, delay: 0.8 },
  { top: "30%", left: "8%", size: 3, delay: 1.2 },
  { top: "18%", left: "65%", size: 2, delay: 1.6 },
  { top: "40%", left: "88%", size: 2, delay: 0.2 },
  { top: "55%", left: "15%", size: 3, delay: 0.6 },
  { top: "62%", left: "78%", size: 2, delay: 1.0 },
  { top: "70%", left: "30%", size: 2, delay: 1.4 },
  { top: "78%", left: "60%", size: 3, delay: 1.8 },
  { top: "85%", left: "20%", size: 2, delay: 0.3 },
  { top: "10%", left: "35%", size: 2, delay: 0.9 },
  { top: "48%", left: "5%", size: 2, delay: 1.3 },
  { top: "90%", left: "85%", size: 3, delay: 0.5 },
];

const POINTS = [
  { x: 150, y: 50 },
  { x: 205, y: 95 },
  { x: 190, y: 165 },
  { x: 150, y: 210 },
  { x: 110, y: 165 },
  { x: 95, y: 95 },
];

function pathFor(a: { x: number; y: number }, b: { x: number; y: number }) {
  return `M${a.x},${a.y} L${b.x},${b.y}`;
}

export function NightSkyConstellation({ data }: { data: ConstellationData }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#0b0e1c] px-8 text-center">
      {BACKGROUND_STARS.map((star, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          initial={{ opacity: 0.15 }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
        />
      ))}

      <svg viewBox="0 0 300 260" className="absolute top-[12%] h-[45%] w-full max-w-[15rem]">
        {POINTS.map((p, i) => {
          const next = POINTS[(i + 1) % POINTS.length];
          return (
            <motion.path
              key={i}
              d={pathFor(p, next)}
              fill="none"
              stroke="white"
              strokeOpacity="0.55"
              strokeWidth="1.5"
              strokeDasharray={200}
              initial={{ strokeDashoffset: 200 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.35, ease: "easeInOut" }}
            />
          );
        })}
        {POINTS.map((p, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r={5}
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.4 + i * 0.35 }}
          />
        ))}
      </svg>

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.7, duration: 0.9, ease: "easeOut" }}
        className="relative z-10 mt-4 size-28 overflow-hidden rounded-full border-2 border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.25)]"
      >
        {data.photoUrl ? <Image src={data.photoUrl} alt="" fill sizes="20vw" className="object-cover" /> : null}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.4, duration: 0.7 }}
        className="relative z-10 mt-5 flex flex-col items-center gap-1"
      >
        <p className="font-display text-2xl text-white">{data.title}</p>
        {data.caption ? <p className="text-sm text-white/70">{data.caption}</p> : null}
      </motion.div>
    </div>
  );
}
