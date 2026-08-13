"use client";

import { motion } from "framer-motion";
import { MousePointerClick, Share2, Sparkles } from "lucide-react";
import { viewportOnce } from "@/lib/motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    icon: MousePointerClick,
    tint: "clay-lavender",
    step: "01",
    title: "Pick a vibe",
    description: "A template that already fits, or a blank page if you'd rather build it yourself.",
  },
  {
    icon: Sparkles,
    tint: "clay-coral",
    step: "02",
    title: "Add your memories",
    description: "Photos, a few words, the moments only the two of you would get.",
  },
  {
    icon: Share2,
    tint: "clay-primary",
    step: "03",
    title: "Send the link",
    description: "They open it on their phone. No app, no account, no waiting.",
  },
] as const;

function StepIcon({ icon: Icon, tint }: { icon: (typeof STEPS)[number]["icon"]; tint: string }) {
  return (
    <span className={`clay ${tint} relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl`}>
      <Icon className="size-5 text-white" strokeWidth={1.75} />
    </span>
  );
}

/** Three steps, nothing more — the whole point is that it reads in one
 *  glance. Icons carry the palette (clay tints) so the section still feels
 *  colorful without any large photography. */
export function HowItWorks() {
  return (
    <section className="border-border border-y">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14 flex flex-col gap-3 sm:mb-16"
        >
          <span className="text-primary-active text-eyebrow font-semibold uppercase">How it works</span>
          <h2 className="font-heading text-section max-w-lg text-balance font-semibold">
            Genuinely takes a few minutes.
          </h2>
        </motion.div>

        {/* Desktop: horizontal, with a connecting line through the icon centers. */}
        <div className="relative hidden sm:grid sm:grid-cols-3 sm:gap-10">
          <div className="border-border absolute top-7 right-[16.6%] left-[16.6%] border-t border-dashed" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            className="border-primary-active/60 absolute top-7 right-[16.6%] left-[16.6%] origin-left border-t border-dashed"
          />
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.12, ease: EASE }}
              className="flex flex-col items-start gap-4"
            >
              <StepIcon icon={step.icon} tint={step.tint} />
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-meta font-semibold tracking-wide uppercase">
                  Step {step.step}
                </span>
                <p className="font-heading text-card-title font-semibold">{step.title}</p>
                <p className="text-muted-foreground text-caption max-w-[26ch] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical. */}
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
                <StepIcon icon={step.icon} tint={step.tint} />
                {index < STEPS.length - 1 ? <div className="bg-border my-2 w-px flex-1" /> : null}
              </div>
              <div className="flex flex-col gap-1.5 pb-10">
                <span className="text-muted-foreground text-meta font-semibold tracking-wide uppercase">
                  Step {step.step}
                </span>
                <p className="font-heading text-card-title font-semibold">{step.title}</p>
                <p className="text-muted-foreground text-caption leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
