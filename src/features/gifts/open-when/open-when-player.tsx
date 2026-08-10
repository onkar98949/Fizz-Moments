"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { openLetterAction } from "@/actions/gift-actions";
import { cn } from "@/lib/utils";
import type { OpenWhenCollectionData, OpenWhenLetter } from "@/types/gifts";

const EASE = [0.16, 1, 0.3, 1] as const;

export function OpenWhenPlayer({ collection }: { collection: OpenWhenCollectionData }) {
  const [letters, setLetters] = useState<OpenWhenLetter[]>(collection.letters);
  const [activeId, setActiveId] = useState<string | null>(null);

  const openedCount = letters.filter((l) => l.opened).length;
  const active = letters.find((l) => l.id === activeId) ?? null;

  function open(letter: OpenWhenLetter) {
    setActiveId(letter.id);
    if (letter.opened) return;

    // Content is already known client-side, so the letter opens instantly —
    // marking it opened just persists quietly in the background.
    openLetterAction({ id: collection.id, letterId: letter.id }).then((result) => {
      if (result.success) {
        setLetters(result.data.letters);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 px-5 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-3xl">✉️</span>
        <h1 className="font-display text-section text-balance">{collection.title}</h1>
        <p className="text-muted-foreground text-caption">Letters from me, for whenever you need them.</p>
        <p className="text-muted-foreground text-meta">
          {openedCount} / {letters.length} opened
        </p>
      </div>

      <div className="grid w-full max-w-md grid-cols-2 gap-4">
        {letters.map((letter) => (
          <motion.button
            key={letter.id}
            layoutId={`open-when-${letter.id}`}
            type="button"
            onClick={() => open(letter)}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={cn(
              "shadow-soft flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center",
              letter.opened ? "bg-secondary/50" : "bg-card",
            )}
          >
            <span className="text-3xl">{letter.emoji}</span>
            <span className="text-muted-foreground text-meta font-medium tracking-wide uppercase">Open when</span>
            <span className="font-display text-balance text-sm leading-snug">{letter.label}</span>
          </motion.button>
        ))}
      </div>

      <p className="text-muted-foreground text-meta">Come back whenever you need one.</p>

      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveId(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-5"
          >
            <motion.div
              layoutId={`open-when-${active.id}`}
              onClick={(e) => e.stopPropagation()}
              transition={{ duration: 0.4, ease: EASE }}
              className="bg-card shadow-soft-xl relative flex w-full max-w-sm flex-col gap-4 rounded-2xl p-7"
            >
              <button
                type="button"
                aria-label="Close letter"
                onClick={() => setActiveId(null)}
                className="text-muted-foreground hover:text-foreground absolute top-4 right-4"
              >
                <X className="size-4" />
              </button>

              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-3xl">{active.emoji}</span>
                <span className="text-muted-foreground text-eyebrow font-medium uppercase">Open when {active.label}</span>
              </div>

              {active.photoUrl ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image src={active.photoUrl} alt="" fill unoptimized className="object-cover" />
                </div>
              ) : null}

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-body-lg text-center leading-relaxed"
              >
                {active.message}
              </motion.p>

              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="text-primary-active mt-1 self-center text-sm font-medium underline underline-offset-2"
              >
                Close letter
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <p className="text-muted-foreground flex items-center gap-1.5 text-meta">
        <Sparkles className="size-3.5" />
        Made with FizzMoments
      </p>
    </div>
  );
}
