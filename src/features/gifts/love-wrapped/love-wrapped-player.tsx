"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { CountUp } from "../count-up";
import { ConfettiBurst } from "../confetti-burst";
import type { LoveWrappedData } from "@/types/gifts";

type Slide =
  | { kind: "cover"; days: number }
  | { kind: "stats" }
  | { kind: "moment"; index: number }
  | { kind: "closing" };

function daysTogether(startDate: string): number {
  const start = new Date(startDate);
  const ms = Date.now() - start.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

/** A tap-through cinematic recap — Spotify Wrapped's pacing (tap right to
 *  advance, tap left to go back), not an auto-playing slideshow, since
 *  each stat/moment is meant to land on its own beat before moving on. */
export function LoveWrappedPlayer({ wrapped }: { wrapped: LoveWrappedData }) {
  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = [{ kind: "cover", days: daysTogether(wrapped.startDate) }];
    if (wrapped.stats.length > 0) list.push({ kind: "stats" });
    wrapped.moments.forEach((_, index) => list.push({ kind: "moment", index }));
    list.push({ kind: "closing" });
    return list;
  }, [wrapped]);

  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  function next() {
    setIndex((i) => Math.min(i + 1, slides.length - 1));
  }
  function prev() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#1B1B1F] px-5 py-16">
      <div className="relative flex aspect-[9/16] w-full max-w-sm flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FF8A9B] via-[#D89AE8] to-[#A47CE8] shadow-2xl">
        <div className="absolute top-4 right-4 left-4 z-20 flex gap-1.5">
          {slides.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
              <div className={i <= index ? "h-full w-full bg-white" : "h-full w-full bg-transparent"} />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center text-white"
          >
            {slide.kind === "cover" ? (
              <>
                <span className="text-4xl">🎵</span>
                <p className="text-lg font-medium text-white/85">{wrapped.title}</p>
                <div className="flex flex-col items-center gap-1">
                  <p className="font-display flex items-baseline gap-2 text-6xl">
                    <CountUp value={slide.days} />
                  </p>
                  <p className="text-lg text-white/85">days together, and counting ❤️</p>
                </div>
              </>
            ) : null}

            {slide.kind === "stats" ? (
              <>
                <p className="font-display text-2xl">A few numbers</p>
                <div className="grid grid-cols-2 gap-6">
                  {wrapped.stats.map((stat) => (
                    <div key={stat.id} className="flex flex-col items-center gap-1">
                      <span className="text-2xl">{stat.emoji}</span>
                      <p className="font-display text-4xl">
                        <CountUp value={stat.value} />
                      </p>
                      <p className="text-sm text-white/80">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {slide.kind === "moment" ? (
              (() => {
                const moment = wrapped.moments[slide.index];
                return (
                  <>
                    <span className="text-4xl">{moment.emoji}</span>
                    <p className="text-meta font-medium tracking-wide text-white/70 uppercase">{moment.label}</p>
                    {moment.photoUrl ? (
                      <div className="relative aspect-square w-full max-w-[70%] overflow-hidden rounded-2xl">
                        <Image src={moment.photoUrl} alt="" fill unoptimized className="object-cover" />
                      </div>
                    ) : null}
                    <p className="font-display text-2xl text-balance">{moment.text}</p>
                  </>
                );
              })()
            ) : null}

            {slide.kind === "closing" ? (
              <div className="relative flex flex-col items-center gap-4">
                <ConfettiBurst triggerKey={index} />
                <Sparkles className="size-8" />
                <p className="font-script text-4xl text-balance">{wrapped.closingMessage}</p>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-10 flex">
          <button type="button" aria-label="Previous" className="h-full w-1/3" onClick={prev} />
          <button type="button" aria-label="Next" className="h-full w-2/3" onClick={next} disabled={isLast} />
        </div>
      </div>

      <p className="absolute bottom-6 flex items-center gap-1.5 text-meta text-white/60">
        <Sparkles className="size-3.5" />
        Made with FizzMoments
      </p>
    </div>
  );
}
