"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import type { HotelCheckInData } from "../config";

export function KeyCardCheckIn({ data }: { data: HotelCheckInData }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
    const t = setTimeout(() => setFlipped(true), 1300);
    return () => clearTimeout(t);
  }, [data.hotelName]);

  return (
    <div className="bg-background relative flex h-full w-full flex-col items-center justify-center gap-6 overflow-hidden px-8">
      <div className="ambient-orb bg-warm-yellow absolute -top-16 left-1/2 size-64 -translate-x-1/2" />

      <div style={{ perspective: 1000 }} className="relative z-10 w-full max-w-[13rem]">
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="relative aspect-[8/5] w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#1b1b1f] to-[#3a3a42] p-4 shadow-xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <KeyRound className="size-5 text-[#d9b46a]" />
            <div>
              <p className="font-display text-lg text-white">{data.hotelName}</p>
              {data.city ? <p className="text-xs text-white/60">{data.city}</p> : null}
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#d9b46a]/70" />
          </div>

          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border-4 border-white shadow-xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {data.photoUrl ? <Image src={data.photoUrl} alt="" fill sizes="50vw" className="object-cover" /> : null}
          </div>
        </motion.div>
      </div>

      {flipped ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative z-10 flex flex-col items-center gap-0.5 text-center"
        >
          <p className="font-display text-foreground text-xl">{data.hotelName}</p>
          {data.city ? <p className="text-muted-foreground text-sm">{data.city}</p> : null}
        </motion.div>
      ) : null}
    </div>
  );
}
