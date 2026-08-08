"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plane } from "lucide-react";
import type { BoardingPassData } from "../config";

const CLOUDS = [
  { top: "18%", size: 90, duration: 14, delay: 0 },
  { top: "34%", size: 60, duration: 18, delay: 2 },
  { top: "58%", size: 100, duration: 16, delay: 1 },
  { top: "72%", size: 70, duration: 20, delay: 3 },
];

export function PrintBoardingPass({ data }: { data: BoardingPassData }) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
    const t = setTimeout(() => setZoomed(true), 1700);
    return () => clearTimeout(t);
  }, [data.departure, data.destination]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#7fc4e8] to-[#c9e9f7]">
      {CLOUDS.map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/70 blur-md"
          style={{ top: cloud.top, width: cloud.size, height: cloud.size * 0.5 }}
          initial={{ x: "-20vw" }}
          animate={{ x: "120vw" }}
          transition={{ duration: cloud.duration, delay: cloud.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}

      <AnimatePresence>
        {!zoomed ? (
          <motion.div
            key="pass"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.6 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 flex-col gap-3 rounded-2xl bg-white p-5 shadow-2xl"
          >
            <p className="text-ink-muted text-[10px] font-semibold tracking-widest uppercase">Boarding Pass</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-2xl font-bold">{data.departure}</p>
                <p className="text-muted-foreground text-[10px] uppercase">From</p>
              </div>
              <Plane className="text-primary size-5" />
              <div className="text-right">
                <p className="font-mono text-2xl font-bold">{data.destination}</p>
                <p className="text-muted-foreground text-[10px] uppercase">To</p>
              </div>
            </div>
            <div className="border-border flex items-center justify-between border-t border-dashed pt-3 text-xs text-muted-foreground">
              <span>{data.date || "Today"}</span>
              <span>{data.flightNumber || "—"}</span>
            </div>
            <div className="flex h-6 items-end gap-0.5">
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} className="bg-foreground/80" style={{ width: 2, height: (i % 3) * 5 + 8 }} />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {zoomed ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2"
        >
          <p className="font-display text-4xl text-white drop-shadow-md">
            {data.departure} <span className="text-white/70">→</span> {data.destination}
          </p>
          {data.date ? <p className="text-sm text-white/85">{data.date}</p> : null}
        </motion.div>
      ) : null}
    </div>
  );
}
