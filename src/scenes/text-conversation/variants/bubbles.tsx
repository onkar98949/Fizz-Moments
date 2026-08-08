"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FilmGrain } from "@/animations/effects/FilmGrain";
import type { TextConversationData, Wallpaper } from "../config";

const MS_PER_MESSAGE = 1500;

const WALLPAPERS: Record<Wallpaper, string> = {
  default: "linear-gradient(160deg, var(--secondary) 0%, var(--background) 100%)",
  love: "var(--gradient-love)",
  dreamy: "var(--gradient-dreamy)",
  sky: "linear-gradient(160deg, #8fd3ff 0%, #cdeeff 100%)",
};

export function BubblesConversation({ data }: { data: TextConversationData }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const total = data.messages.length;

  useEffect(() => {
    setVisibleCount(0);
    setShowFinal(false);
    if (total === 0) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= total) {
        clearInterval(interval);
        setTimeout(() => setShowFinal(true), 800);
      }
    }, MS_PER_MESSAGE);
    return () => clearInterval(interval);
  }, [total]);

  const isTyping = visibleCount < total;
  const lastVisible = data.messages[visibleCount - 1];

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ backgroundImage: WALLPAPERS[data.wallpaper ?? "default"] }}
    >
      <FilmGrain opacity={0.04} />
      <AnimatePresence mode="wait">
        {!showFinal ? (
          <motion.div key="chat" exit={{ opacity: 0 }} className="flex h-full flex-col justify-end gap-2 px-4 pt-16 pb-8">
            <div className="glass-surface mx-auto mb-3 rounded-full px-3 py-1 text-center text-xs font-medium">
              {data.receiverName || "Them"}
            </div>

            <div className="flex flex-col gap-2 overflow-hidden">
              {data.messages.slice(0, visibleCount).map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 14, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-snug",
                    m.from === "sender"
                      ? "bg-primary text-primary-foreground self-end rounded-br-md"
                      : "bg-white/95 text-foreground self-start rounded-bl-md shadow-sm",
                  )}
                >
                  {m.text}
                </motion.div>
              ))}

              {isTyping ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/95 flex w-fit items-center gap-1 self-start rounded-2xl rounded-bl-md px-3.5 py-2.5 shadow-sm"
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="bg-muted-foreground/50 size-1.5 animate-bounce rounded-full"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </motion.div>
              ) : lastVisible ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-ink-muted self-end pr-1 text-[10px]"
                >
                  Read
                </motion.p>
              ) : null}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {data.finalImageUrl ? (
              <Image src={data.finalImageUrl} alt="" fill sizes="100vw" className="object-cover" priority />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
