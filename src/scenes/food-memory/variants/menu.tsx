"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { FoodMemoryData } from "../config";

export function MenuFoodMemory({ data }: { data: FoodMemoryData }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#f6efe1] px-8">
      <div className="ambient-orb bg-coral absolute -top-10 -left-10 size-56" />

      <motion.div
        initial={{ opacity: 0, scaleY: 0.4 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: "top" }}
        className="relative flex w-full max-w-xs flex-col items-center gap-4 rounded-2xl border border-[#d8c6a4] bg-[#fffaf0] px-6 py-8 shadow-xl"
      >
        <p className="text-[10px] font-semibold tracking-[0.3em] text-[#9c7b45] uppercase">Tonight&apos;s Memory</p>
        <div className="h-px w-16 bg-[#d8c6a4]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="relative size-28 overflow-hidden rounded-full border-4 border-[#f6efe1] shadow-lg"
        >
          {data.photoUrl ? <Image src={data.photoUrl} alt="" fill sizes="30vw" className="object-cover" /> : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col items-center gap-1 text-center"
        >
          <p className="font-display text-xl text-[#3a2c17]">{data.restaurant}</p>
          {data.caption ? <p className="text-sm text-[#7a6446] italic">{data.caption}</p> : null}
        </motion.div>
      </motion.div>
    </div>
  );
}
