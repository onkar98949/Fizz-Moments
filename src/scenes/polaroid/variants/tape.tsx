"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FilmGrain } from "@/animations/effects/FilmGrain";
import type { PolaroidData } from "../config";

export function TapePolaroid({ data }: { data: PolaroidData }) {
  return (
    <div className="bg-secondary relative flex h-full w-full items-center justify-center overflow-hidden px-10">
      <div className="ambient-orb bg-warm-yellow absolute top-6 left-1/2 size-56 -translate-x-1/2" />
      <FilmGrain opacity={0.045} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: [-6, -3, -1.5, -3] }}
        transition={{
          opacity: { duration: 0.7, ease: "easeOut" },
          scale: { duration: 0.7, ease: "easeOut" },
          rotate: { duration: 5, ease: "easeInOut", times: [0, 0.2, 0.6, 1], repeat: Infinity, repeatDelay: 0.5 },
        }}
        className="relative flex w-full max-w-[280px] flex-col gap-4 rounded-sm bg-white p-3 pb-6 shadow-xl"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-black">
          {data.photoUrl ? (
            <Image src={data.photoUrl} alt={data.caption || "Photo"} fill sizes="280px" className="object-cover" priority />
          ) : null}
        </div>
        {data.caption ? <p className="text-foreground px-1 text-center text-sm">{data.caption}</p> : null}
      </motion.div>
    </div>
  );
}
