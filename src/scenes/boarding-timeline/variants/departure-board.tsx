"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { PlaneTakeoff } from "lucide-react";
import type { BoardingTimelineData } from "../config";

const MS_PER_LEG = 3600;

function FlipField({ value, flipKey, className }: { value: string; flipKey: string; className?: string }) {
  return (
    <div style={{ perspective: 400 }} className="overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={flipKey}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={className}
          style={{ display: "inline-block", transformOrigin: "center" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function DepartureBoard({ data }: { data: BoardingTimelineData }) {
  const [index, setIndex] = useState(0);
  const legs = data.legs;

  useEffect(() => {
    setIndex(0);
    if (legs.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1 >= legs.length ? i : i + 1));
    }, MS_PER_LEG);
    return () => clearInterval(interval);
  }, [legs.length]);

  const leg = legs[index];
  if (!leg) return <div className="bg-secondary h-full w-full" />;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0c1220]">
      <AnimatePresence mode="wait">
        <motion.div
          key={leg.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image src={leg.photoUrl} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[#0c1220]/70" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-6 top-4 z-10 flex gap-1">
        {legs.map((l, i) => (
          <div key={l.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/20">
            {i < index ? (
              <div className="h-full w-full bg-[#ffd166]" />
            ) : i === index ? (
              <motion.div
                className="h-full bg-[#ffd166]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: MS_PER_LEG / 1000, ease: "linear" }}
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-6">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-[#ffd166] uppercase">Now Boarding</p>

        <div className="flex w-full max-w-xs items-center justify-between rounded-2xl border border-white/10 bg-black/50 px-5 py-4">
          <div className="flex flex-col items-start">
            <span className="text-[10px] tracking-widest text-white/50 uppercase">From</span>
            <FlipField value={leg.from} flipKey={`from-${leg.id}`} className="font-mono text-2xl font-bold text-white" />
          </div>
          <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
            <PlaneTakeoff className="size-5 text-[#ffd166]" />
          </motion.div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] tracking-widest text-white/50 uppercase">To</span>
            <FlipField value={leg.to} flipKey={`to-${leg.id}`} className="font-mono text-2xl font-bold text-white" />
          </div>
        </div>

        {leg.date ? (
          <FlipField value={leg.date} flipKey={`date-${leg.id}`} className="text-sm tracking-wide text-white/70" />
        ) : null}
      </div>
    </div>
  );
}
