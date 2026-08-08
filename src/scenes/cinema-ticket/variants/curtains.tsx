"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FilmGrain } from "@/animations/effects/FilmGrain";
import type { CinemaTicketData } from "../config";

export function CurtainsTicket({ data }: { data: CinemaTicketData }) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), 1300);
    const t2 = setTimeout(() => setPhase(2), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [data.movieTitle, data.posterUrl]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 10, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image src={data.posterUrl} alt="" fill sizes="100vw" className="object-cover" priority />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />
        {phase >= 2 ? (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-white"
            animate={{ opacity: [0, 0.05, 0, 0.03, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
        <FilmGrain opacity={0.05} />
      </div>

      {phase >= 1 ? (
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: phase >= 2 ? 2.6 : 1, opacity: phase >= 2 ? 0 : 0.9 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="pointer-events-none absolute top-1/3 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl"
        />
      ) : null}

      <AnimatePresence>
        {phase === 0 ? (
          <motion.div
            key="ticket"
            initial={{ opacity: 0, y: 30, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="absolute inset-0 flex items-center justify-center px-8"
          >
            <div className="relative flex w-full max-w-[15rem] flex-col gap-2 rounded-2xl bg-white px-5 py-5 text-center shadow-2xl">
              <span className="absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 rounded-full bg-black" />
              <span className="absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 rounded-full bg-black" />
              <p className="text-ink-muted text-[10px] font-semibold tracking-widest uppercase">Admit One</p>
              <p className="font-display text-foreground text-xl">{data.movieTitle}</p>
              {data.subtitle ? <p className="text-muted-foreground text-xs">{data.subtitle}</p> : null}
              <div className="border-border my-1 border-t border-dashed" />
              <div className="text-muted-foreground flex items-center justify-between text-[11px]">
                <span>{data.date || "Tonight"}</span>
                <span>{data.location || "Front Row"}</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ x: 0 }}
        animate={{ x: phase >= 1 ? "-100%" : 0 }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#3a0d0d] to-[#7a1f1f]"
        style={{ boxShadow: "inset -20px 0 40px rgba(0,0,0,0.4)" }}
      />
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: phase >= 1 ? "100%" : 0 }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#3a0d0d] to-[#7a1f1f]"
        style={{ boxShadow: "inset 20px 0 40px rgba(0,0,0,0.4)" }}
      />

      {phase >= 2 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="absolute inset-x-6 bottom-10 flex flex-col items-center gap-1 text-center"
        >
          <p className="font-display text-3xl text-white">{data.movieTitle}</p>
          {data.subtitle ? <p className="text-sm text-white/75">{data.subtitle}</p> : null}
        </motion.div>
      ) : null}
    </div>
  );
}
