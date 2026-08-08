"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1] as const;

/** The opening statement: one large editorial headline, one immersive photo,
 *  one CTA. No badges, no floating icons, no gradient orbs — the emotion
 *  comes from typography, whitespace, and a single beautiful image. */
export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 64]);

  return (
    <section ref={ref} className="px-6 pt-16 pb-24 sm:px-10 sm:pt-20 sm:pb-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
        <div className="flex flex-col gap-7">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-muted-foreground text-eyebrow font-medium uppercase"
          >
            For the moments that matter
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
            className="font-display text-display text-balance"
          >
            Turn your memories into a story worth{" "}
            <em className="text-primary-active italic">reliving</em>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="text-muted-foreground text-body-lg max-w-md text-balance"
          >
            Let FizzMoments write the story for you, or design every detail yourself.
            Either way, they&apos;ll never forget it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="flex flex-col items-start gap-4 pt-1"
          >
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/create">Start Creating</Link>}
            />
            <p className="text-muted-foreground/80 text-meta">
              Free to start · No app required · Ready in minutes
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ y: imageY }}
          className="shadow-soft-xl relative aspect-[4/5] w-full overflow-hidden rounded-3xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?q=80&w=1000&auto=format&fit=crop"
            alt="Three friends dancing together on a hilltop at golden hour"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
