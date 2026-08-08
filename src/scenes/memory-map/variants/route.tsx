"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { MemoryMapData } from "../config";

const MS_PER_STOP = 3400;

const POINTS = [
  { x: 70, y: 90 },
  { x: 220, y: 150 },
  { x: 90, y: 250 },
  { x: 230, y: 330 },
  { x: 110, y: 430 },
];
const SEGMENTS = ["M70,90 Q150,80 220,150", "M220,150 Q180,220 90,250", "M90,250 Q170,270 230,330", "M230,330 Q200,400 110,430"];

export function RouteMap({ data }: { data: MemoryMapData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stops = data.stops;

  useEffect(() => {
    setActiveIndex(0);
    if (stops.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1 >= stops.length ? i : i + 1));
    }, MS_PER_STOP);
    return () => clearInterval(interval);
  }, [stops.length]);

  const stop = stops[activeIndex];
  if (!stop) return <div className="bg-secondary h-full w-full" />;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={stop.id}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image src={stop.photoUrl} alt={stop.name} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-4 top-4 z-10 flex gap-1">
        {stops.map((s, i) => (
          <div key={s.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
            {i < activeIndex ? (
              <div className="h-full w-full bg-white/70" />
            ) : i === activeIndex ? (
              <motion.div
                className="h-full bg-white/70"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: MS_PER_STOP / 1000, ease: "linear" }}
              />
            ) : null}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute top-9 right-4 z-10 h-28 w-20 overflow-hidden rounded-2xl border border-white/15 bg-black/25 p-1.5 backdrop-blur-xl"
      >
        <svg viewBox="0 0 300 500" className="h-full w-full">
          {SEGMENTS.slice(0, activeIndex).map((d) => (
            <path key={d} d={d} fill="none" stroke="white" strokeOpacity="0.85" strokeWidth="10" strokeLinecap="round" />
          ))}
          {activeIndex > 0 && SEGMENTS[activeIndex - 1] ? (
            <motion.path
              key={`drawing-${activeIndex}`}
              d={SEGMENTS[activeIndex - 1]}
              fill="none"
              stroke="white"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={500}
              initial={{ strokeDashoffset: 500 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />
          ) : null}
          {POINTS.slice(0, stops.length).map((p, i) =>
            i <= activeIndex ? (
              <motion.circle
                key={p.x + "-" + p.y}
                cx={p.x}
                cy={p.y}
                r={i === activeIndex ? 22 : 14}
                fill={i === activeIndex ? "var(--primary)" : "white"}
                initial={i === activeIndex ? { scale: 0 } : false}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              />
            ) : null,
          )}
        </svg>
      </motion.div>

      <motion.div
        key={`card-${stop.id}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="absolute inset-x-4 bottom-8 z-10 flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/25 px-4 py-3.5 backdrop-blur-xl"
      >
        <div className="flex items-center gap-1.5">
          <MapPin className="text-primary size-4" />
          <p className="font-display text-lg text-white">{stop.name}</p>
          {stop.date ? <span className="text-xs text-white/70">· {stop.date}</span> : null}
        </div>
        {stop.caption ? <p className="text-sm text-white/85">{stop.caption}</p> : null}
      </motion.div>
    </div>
  );
}
