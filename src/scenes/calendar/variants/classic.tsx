"use client";

import { motion } from "framer-motion";
import type { CalendarData } from "../config";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function parseDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return { month: "—", day: "—", year: "" };
  return {
    month: MONTHS[parsed.getMonth()],
    day: String(parsed.getDate()).padStart(2, "0"),
    year: String(parsed.getFullYear()),
  };
}

export function ClassicCalendar({ data }: { data: CalendarData }) {
  const { month, day, year } = parseDate(data.date);

  return (
    <div className="bg-background relative flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden px-8">
      <div className="ambient-orb bg-lavender absolute -top-20 -left-16 size-64" />

      <motion.div
        initial={{ opacity: 0, rotateX: -60 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transformPerspective: 800, transformOrigin: "top" }}
        className="border-border relative flex w-40 flex-col overflow-hidden rounded-2xl border bg-white shadow-xl"
      >
        <div className="bg-coral py-1.5 text-center text-xs font-semibold tracking-widest text-white">{month}</div>
        <div className="text-foreground py-4 text-center font-display text-5xl">{day}</div>
        {year ? <div className="text-muted-foreground pb-2 text-center text-xs">{year}</div> : null}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative flex flex-col items-center gap-1 text-center"
      >
        <p className="font-display text-2xl">{data.title}</p>
        {data.caption ? <p className="text-muted-foreground text-sm">{data.caption}</p> : null}
      </motion.div>
    </div>
  );
}
