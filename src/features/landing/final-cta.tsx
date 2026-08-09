"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { viewportOnce } from "@/lib/motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/** The closing statement — full-bleed, cinematic, breaking the page's
 *  max-w-6xl rhythm on purpose so it reads as a moment, not another section. */
export function FinalCta() {
  return (
    <section className="relative isolate flex min-h-[34rem] items-center justify-center overflow-hidden py-28">
      <motion.div
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src="https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?q=80&w=1800&auto=format&fit=crop"
          alt="Friends gathered together at a golden hour rooftop pool party"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-black/55" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto flex max-w-2xl flex-col items-center gap-7 px-6 text-center"
      >
        <span className="text-eyebrow font-medium text-white/70 uppercase">Start today</span>
        <h2 className="font-display text-hero text-balance text-white">
          Create something they&apos;ll remember forever.
        </h2>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/gifts">Start Creating</Link>}
        />
      </motion.div>
    </section>
  );
}
