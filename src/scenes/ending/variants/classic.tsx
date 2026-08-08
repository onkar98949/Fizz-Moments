"use client";

import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import type { EndingData } from "../config";

export function ClassicEnding({ data }: { data: EndingData }) {
  return (
    <div className="bg-card relative flex h-full w-full flex-col items-center justify-center gap-6 overflow-hidden px-8 text-center">
      <div className="ambient-orb bg-lavender absolute -bottom-24 left-1/2 size-72 -translate-x-1/2" />

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 14 }}
        className="bg-coral relative flex size-16 items-center justify-center rounded-full text-white shadow-lg"
      >
        <Sparkle className="size-7 fill-current" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-foreground relative max-w-sm text-lg leading-relaxed text-balance"
      >
        {data.closingMessage}
      </motion.p>
    </div>
  );
}
