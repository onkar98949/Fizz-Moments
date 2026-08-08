"use client";

import { motion } from "framer-motion";
import { Share2, Upload, Wand2 } from "lucide-react";
import { viewportOnce } from "@/lib/motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    icon: Upload,
    step: "Step 01",
    title: "Upload your memories",
    description: "Photos, a few words, the moments you want to remember. Nothing else to fill in.",
  },
  {
    icon: Wand2,
    step: "Step 02",
    title: "We build the story",
    description: "FizzMoments arranges it into a cinematic, animated experience — timed, transitioned, complete.",
  },
  {
    icon: Share2,
    step: "Step 03",
    title: "Share one beautiful link",
    description: "Send it. They open it, and the surprise plays — right in their browser, no app required.",
  },
] as const;

function StepIcon({ icon: Icon }: { icon: (typeof STEPS)[number]["icon"] }) {
  return (
    <span className="border-border bg-background relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border">
      <Icon className="text-foreground size-5" strokeWidth={1.5} />
    </span>
  );
}

/** A visual, sequential timeline — the one place in the redesign where
 *  numbering is earned, since these three steps really do happen in order. */
export function HowItWorks() {
  return (
    <section className="border-border border-y">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-16 flex flex-col gap-4 sm:mb-20"
        >
          <span className="text-muted-foreground text-eyebrow font-medium uppercase">How it works</span>
          <h2 className="font-display text-section max-w-lg text-balance">
            Effortless for you. Unforgettable for them.
          </h2>
        </motion.div>

        {/* Desktop: horizontal timeline with a connecting line through the icon centers. */}
        <div className="relative hidden sm:grid sm:grid-cols-3 sm:gap-10">
          <div className="border-border absolute top-7 right-[16.6%] left-[16.6%] border-t" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            className="border-primary-active/50 absolute top-7 right-[16.6%] left-[16.6%] origin-left border-t"
          />
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.12, ease: EASE }}
              className="flex flex-col items-start gap-5"
            >
              <StepIcon icon={step.icon} />
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-eyebrow font-medium uppercase">{step.step}</span>
                <p className="font-display text-card-title">{step.title}</p>
                <p className="text-muted-foreground text-caption max-w-[26ch] leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical timeline. */}
        <div className="flex flex-col sm:hidden">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
              className="flex gap-5"
            >
              <div className="flex flex-col items-center">
                <StepIcon icon={step.icon} />
                {index < STEPS.length - 1 ? <div className="bg-border my-2 w-px flex-1" /> : null}
              </div>
              <div className="flex flex-col gap-2 pb-10">
                <span className="text-muted-foreground text-eyebrow font-medium uppercase">{step.step}</span>
                <p className="font-display text-card-title">{step.title}</p>
                <p className="text-muted-foreground text-caption leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
