"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Car, Plane, TrainFront } from "lucide-react";
import { FilmGrain } from "@/animations/effects/FilmGrain";
import type { JourneyData } from "../config";

const ICONS = { plane: Plane, car: Car, train: TrainFront };

export function PlaneRouteJourney({ data }: { data: JourneyData }) {
  const Icon = ICONS[data.transportation];

  return (
    <div className="bg-secondary relative flex h-full w-full flex-col overflow-hidden">
      <FilmGrain opacity={0.04} />
      {data.photoUrl ? (
        <div className="relative h-1/2 w-full overflow-hidden">
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image src={data.photoUrl} alt={data.caption || ""} fill sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent" />
        </div>
      ) : (
        <div className="ambient-orb bg-sky absolute top-0 left-1/2 size-72 -translate-x-1/2" />
      )}

      <div className="relative flex flex-1 flex-col items-center justify-center gap-8 px-8">
        <div className="relative flex w-full max-w-xs items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-foreground max-w-24 text-lg text-balance"
          >
            {data.from}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-foreground max-w-24 text-right text-lg text-balance"
          >
            {data.to}
          </motion.div>
        </div>

        <div className="relative h-px w-full max-w-xs bg-[repeating-linear-gradient(90deg,var(--border)_0_8px,transparent_8px_16px)]">
          <motion.div
            initial={{ left: "0%", y: 0 }}
            animate={{ left: "100%", y: [0, -5, 0] }}
            transition={{
              left: { duration: 3.5, ease: "easeInOut" },
              y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 3.5 },
            }}
            className="bg-primary absolute top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-md"
          >
            <Icon className="size-4" />
          </motion.div>
        </div>

        {data.caption ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-muted-foreground text-center text-sm"
          >
            {data.caption}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}
