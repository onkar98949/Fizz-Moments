"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { TimelineData } from "../config";

const MS_PER_MOMENT = 3200;

export function CascadeTimeline({ data }: { data: TimelineData }) {
  const [index, setIndex] = useState(0);
  const moment = data.moments[index];

  useEffect(() => {
    setIndex(0);
    if (data.moments.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1 >= data.moments.length ? i : i + 1));
    }, MS_PER_MOMENT);
    return () => clearInterval(interval);
  }, [data.moments.length]);

  if (!moment) {
    return <div className="bg-secondary h-full w-full" />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={moment.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: MS_PER_MOMENT / 1000, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image src={moment.photoUrl} alt={moment.title} fill sizes="100vw" className="object-cover" priority />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-6 pb-16 text-white">
            <p className="font-display text-3xl text-balance">{moment.title}</p>
            {moment.caption ? <p className="text-sm text-balance text-white/85">{moment.caption}</p> : null}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-4 top-4 z-10 flex gap-1">
        {data.moments.map((m, i) => (
          <div key={m.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
            {i < index ? (
              <div className="h-full w-full bg-white/70" />
            ) : i === index ? (
              <motion.div
                className="h-full bg-white/70"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: MS_PER_MOMENT / 1000, ease: "linear" }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
