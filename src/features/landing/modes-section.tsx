"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MODES = [
  {
    href: "/gifts",
    emoji: "🎁",
    tint: "coral",
    title: "Make something they'll actually open",
    description: "Scratch cards, treasure hunts, a wrapped-up recap of your year together — pick one and go.",
    cta: "Browse gifts",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop",
    alt: "A hand-drawn heart shape photographed up close",
    rotate: "-3deg",
  },
  {
    href: "/create",
    emoji: "📸",
    tint: "sky",
    title: "Drop in your favorite memories",
    description: "Your photos, your words, your inside jokes. No design skills needed.",
    cta: "Start a story",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600&auto=format&fit=crop",
    alt: "Friends laughing together with arms raised",
    rotate: "2.5deg",
  },
  {
    href: "/templates",
    emoji: "✨",
    tint: "lavender",
    title: "Pick a vibe and make it yours",
    description: "Start from a template or build it scene by scene. Either way, it's still very you.",
    cta: "See templates",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
    alt: "Friends gathered around laptops, working and laughing",
    rotate: "-2deg",
  },
] as const;

const TINT_BG: Record<(typeof MODES)[number]["tint"], string> = {
  coral: "color-mix(in oklch, var(--coral) 16%, var(--background))",
  sky: "color-mix(in oklch, var(--sky) 20%, var(--background))",
  lavender: "color-mix(in oklch, var(--lavender) 16%, var(--background))",
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** Three benefit-first cards — what you'd actually make, not abstract value
 *  props. Each photo sits in a small rotated polaroid frame instead of
 *  filling the card, so the card itself carries the color and the photo
 *  reads as a keepsake, not a stock lifestyle ad. */
export function ModesSection() {
  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-3"
        >
          <span className="text-primary-active text-eyebrow font-semibold uppercase">What you can make</span>
          <h2 className="font-heading text-section max-w-lg text-balance font-semibold">
            Not another boring birthday text.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-7"
        >
          {MODES.map((mode) => (
            <motion.div
              key={mode.href}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="flex flex-col overflow-hidden rounded-2xl p-6"
              style={{ backgroundColor: TINT_BG[mode.tint] }}
            >
              <div
                className="shadow-soft-lg relative mx-auto aspect-square w-32 shrink-0 overflow-hidden rounded-lg border-4 border-white bg-white sm:w-36"
                style={{ transform: `rotate(${mode.rotate})` }}
              >
                <Image
                  src={mode.image}
                  alt={mode.alt}
                  fill
                  loading="lazy"
                  sizes="160px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col items-start gap-2.5 pt-6">
                <span className="text-2xl" aria-hidden>
                  {mode.emoji}
                </span>
                <h3 className="font-heading text-card-title text-balance font-semibold">{mode.title}</h3>
                <p className="text-foreground/70 text-caption leading-relaxed">{mode.description}</p>
                <Button
                  variant="ghost"
                  className={cn("group/btn -ml-3.5 mt-auto pt-2")}
                  nativeButton={false}
                  render={
                    <Link href={mode.href}>
                      {mode.cta}
                      <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                  }
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
