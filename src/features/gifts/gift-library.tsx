"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock3, Gauge, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GIFT_TYPES } from "@/constants/gifts";
import {
  createBlankScratchCardGiftAction,
  createBlankTreasureHuntAction,
  createBlankGiftBoxAction,
  createBlankLoveWrappedAction,
  createBlankCouponBookAction,
  createBlankRelationshipQuizAction,
  createBlankSecretEnvelopeAction,
  createBlankFortuneCookieAction,
  createBlankMemoryQuizAction,
  createBlankOpenWhenCollectionAction,
  createBlankDateGeneratorAction,
  createBlankHundredReasonsAction,
} from "@/actions/gift-actions";
import { isNextRedirectError } from "@/lib/utils";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** One creation action per gift — every gift in the library is real today. */
const CREATE_ACTIONS: Record<string, () => Promise<never>> = {
  "scratch-cards": createBlankScratchCardGiftAction,
  "treasure-hunt": createBlankTreasureHuntAction,
  "gift-box": createBlankGiftBoxAction,
  "love-wrapped": createBlankLoveWrappedAction,
  "coupon-book": createBlankCouponBookAction,
  "how-well": createBlankRelationshipQuizAction,
  "secret-envelope": createBlankSecretEnvelopeAction,
  "fortune-cookie": createBlankFortuneCookieAction,
  "memory-quiz": createBlankMemoryQuizAction,
  "open-when": createBlankOpenWhenCollectionAction,
  "date-generator": createBlankDateGeneratorAction,
  "100-reasons": createBlankHundredReasonsAction,
};

export function GiftLibrary() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function createGift(id: string) {
    const action = CREATE_ACTIONS[id];
    if (!action) return;
    setLoadingId(id);
    try {
      await action();
    } catch (error) {
      if (isNextRedirectError(error)) throw error;
      toast.error("Couldn't start that gift. Please try again.");
      setLoadingId(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-5 py-16 sm:py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-primary-active bg-accent inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-meta font-medium tracking-wide uppercase">
          <Sparkles className="size-3.5" />
          Romantic Interactive Gifts
        </span>
        <h1 className="font-display text-section text-balance">
          Interactive surprises they&apos;ll play, discover, and remember.
        </h1>
        <p className="text-muted-foreground text-body-lg max-w-xl text-balance">
          Create playful, romantic digital gifts that go beyond watching a story — scratch to reveal
          surprises, follow a treasure hunt, unlock a gift box, and more.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {GIFT_TYPES.map((gift) => {
          const isAvailable = gift.status === "available";
          const isLoading = loadingId === gift.id;

          return (
            <motion.div
              key={gift.id}
              variants={staggerItem}
              whileHover={isAvailable ? { y: -6, scale: 1.015, transition: { type: "spring", stiffness: 320, damping: 26 } } : undefined}
              className={cn(
                "bg-card shadow-soft relative flex flex-col gap-4 rounded-xl p-7 transition-shadow duration-300",
                isAvailable ? "hover:shadow-soft-lg" : "opacity-90",
              )}
            >
              {!isAvailable && (
                <span className="bg-secondary text-muted-foreground absolute top-5 right-5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase">
                  Coming soon
                </span>
              )}

              <span className={cn("clay flex size-14 items-center justify-center rounded-2xl text-2xl", gift.tint)}>
                {gift.icon}
              </span>

              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-card-title leading-tight">{gift.title}</h3>
                <p className="text-muted-foreground text-caption leading-relaxed">{gift.shortDescription}</p>
              </div>

              <div className="bg-secondary/50 flex flex-col gap-2 rounded-lg p-4">
                {gift.exampleLabel ? (
                  <span className="text-muted-foreground text-meta font-medium">{gift.exampleLabel}</span>
                ) : null}
                <div className="flex flex-wrap gap-1.5">
                  {gift.exampleChips.map((chip) => (
                    <span key={chip} className="bg-card shadow-xs rounded-full px-2.5 py-1 text-xs font-medium">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-muted-foreground mt-auto flex items-center gap-4 text-meta">
                <span className="flex items-center gap-1">
                  <Gauge className="size-3.5" />
                  {gift.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <Clock3 className="size-3.5" />
                  {gift.estimatedMinutes}
                </span>
              </div>

              {isAvailable ? (
                <Button
                  onClick={() => createGift(gift.id)}
                  disabled={loadingId !== null}
                  className="w-full"
                >
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
                  {isLoading ? "Creating…" : "Create Gift"}
                </Button>
              ) : (
                <Button variant="secondary" disabled className="w-full">
                  Coming soon
                </Button>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-center text-meta">
        <Sparkles className="size-3.5" />
        More gifts on the way —{" "}
        <Link href="/" className="text-primary-active underline underline-offset-2">
          back home
        </Link>
      </p>
    </div>
  );
}
