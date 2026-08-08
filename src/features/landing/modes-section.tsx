"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const MODES = [
  {
    href: "/gifts",
    eyebrow: "Playful",
    title: "Something they'll actually play with.",
    description:
      "Scratch cards, treasure hunts, a wrapped-up recap of your relationship — interactive surprises built to be discovered, not just viewed.",
    cta: "Explore Gifts",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop",
    alt: "Two hands forming a heart shape against a sunset sky",
  },
  {
    href: "/create",
    eyebrow: "Effortless",
    title: "Let the story write itself.",
    description:
      "Start from a professionally designed template, or build your own from a library of animated scenes. No editing required.",
    cta: "Start Your Story",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1000&auto=format&fit=crop",
    alt: "Three friends laughing together, arms raised, at sunset",
  },
  {
    href: "/templates",
    eyebrow: "Customizable",
    title: "Or design every detail yourself.",
    description:
      "Start from a blank canvas or a beautiful ready-made layout, and shape every word, photo, and animation by hand.",
    cta: "Browse Templates",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
    alt: "Friends gathered around laptops, working and laughing together",
  },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

/** Three equally-weighted, clearly separated cards — deliberately not
 *  alternating rows, so the three paths into the product stay easy to
 *  compare and pick between at a glance. */
export function ModesSection() {
  return (
    <section className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-4"
        >
          <span className="text-muted-foreground text-eyebrow font-medium uppercase">Three ways to begin</span>
          <h2 className="font-display text-section max-w-lg text-balance">However you want to make it.</h2>
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
              className="border-border bg-card shadow-soft hover:shadow-soft-lg flex flex-col overflow-hidden rounded-2xl border transition-shadow duration-300"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={mode.image}
                  alt={mode.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col items-start gap-3 p-7">
                <span className="text-muted-foreground text-eyebrow font-medium uppercase">{mode.eyebrow}</span>
                <h3 className="font-display text-card-title text-balance">{mode.title}</h3>
                <p className="text-muted-foreground text-caption leading-relaxed">{mode.description}</p>
                <Button
                  variant="outline"
                  className="group/btn mt-auto pt-2"
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
