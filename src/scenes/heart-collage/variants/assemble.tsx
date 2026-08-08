"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FilmGrain } from "@/animations/effects/FilmGrain";
import type { HeartCollageData } from "../config";

// 12 points tracing a heart outline (percentages within the frame), walked
// clockwise from the top notch — enough to read as a heart with 6-12 photos.
const HEART_POINTS = [
  { top: "26%", left: "50%" },
  { top: "16%", left: "62%" },
  { top: "12%", left: "74%" },
  { top: "18%", left: "84%" },
  { top: "32%", left: "82%" },
  { top: "48%", left: "68%" },
  { top: "66%", left: "50%" },
  { top: "48%", left: "32%" },
  { top: "32%", left: "18%" },
  { top: "18%", left: "16%" },
  { top: "12%", left: "26%" },
  { top: "16%", left: "38%" },
];

const START_OFFSETS = [
  { x: -140, y: -80 },
  { x: 130, y: -100 },
  { x: -110, y: 100 },
  { x: 150, y: 90 },
  { x: -160, y: 10 },
  { x: 100, y: -140 },
  { x: -90, y: -130 },
  { x: 140, y: 60 },
  { x: -130, y: -60 },
  { x: 90, y: 130 },
  { x: -100, y: 90 },
  { x: 120, y: -60 },
];

export function AssembleHeart({ data }: { data: HeartCollageData }) {
  return (
    <div className="bg-background relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="ambient-orb bg-coral absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2" />
      <FilmGrain opacity={0.045} />

      <motion.div
        animate={{ scale: [1, 1.05, 1, 1.03, 1] }}
        transition={{
          duration: 1.1,
          times: [0, 0.25, 0.4, 0.6, 1],
          delay: 0.5 + data.photos.length * 0.22 + 0.5,
          repeat: Infinity,
          repeatDelay: 0.9,
          ease: "easeInOut",
        }}
        className="relative h-full w-full max-w-xs"
      >
        {data.photos.map((photo, index) => {
          const point = HEART_POINTS[index % HEART_POINTS.length];
          const start = START_OFFSETS[index % START_OFFSETS.length];
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, x: start.x, y: start.y, scale: 0.4, rotate: start.x > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.5 + index * 0.22 }}
              className="absolute size-14 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-white shadow-lg"
              style={{ top: point.top, left: point.left }}
            >
              <Image src={photo.photoUrl} alt="" fill sizes="15vw" className="object-cover" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
