"use client";

import { motion } from "framer-motion";

type ProgressDashesProps = {
  count: number;
  activeIndex: number;
  activeDurationMs: number | null;
  paused: boolean;
};

export function ProgressDashes({ count, activeIndex, activeDurationMs, paused }: ProgressDashesProps) {
  return (
    <div className="absolute top-3 right-3 left-3 z-20 flex gap-1.5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
          {index < activeIndex ? (
            <div className="h-full w-full bg-white" />
          ) : index === activeIndex && activeDurationMs ? (
            <motion.div
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: paused ? undefined : "100%" }}
              transition={{ duration: activeDurationMs / 1000, ease: "linear" }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
