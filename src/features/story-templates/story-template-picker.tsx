"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, PenLine, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createBlankStoryAction, createStoryFromTemplateAction } from "@/actions/story-actions";
import { isNextRedirectError } from "@/lib/utils";
import { cardTap, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import type { StoryTemplateEntry } from "@/types/story";

const CATEGORY_LABELS: Record<string, string> = {
  LOVE: "Love Story",
  TRAVEL: "Travel Journey",
  BIRTHDAY: "Birthday",
  ANNIVERSARY: "Anniversary",
  FAMILY: "Family Memories",
  GRADUATION: "Graduation",
  THANK_YOU: "Thank You",
};

const CATEGORY_EMOJI: Record<string, string> = {
  LOVE: "❤️",
  TRAVEL: "✈️",
  BIRTHDAY: "🎂",
  ANNIVERSARY: "💕",
  FAMILY: "👨‍👩‍👧",
  GRADUATION: "🎓",
  THANK_YOU: "🙏",
};

type StoryTemplatePickerProps = {
  templates: StoryTemplateEntry[];
};

export function StoryTemplatePicker({ templates }: StoryTemplatePickerProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function startBlank() {
    setLoadingId("blank");
    try {
      await createBlankStoryAction();
    } catch (error) {
      if (isNextRedirectError(error)) throw error;
      toast.error("Couldn't start a new story. Please try again.");
      setLoadingId(null);
    }
  }

  async function startFromTemplate(templateId: string) {
    setLoadingId(templateId);
    try {
      const result = await createStoryFromTemplateAction({ templateId });
      if (!result.success) {
        toast.error(result.error);
        setLoadingId(null);
      }
    } catch (error) {
      if (isNextRedirectError(error)) throw error;
      toast.error("Couldn't start that template. Please try again.");
      setLoadingId(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-16 px-5 py-16 sm:py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-section">Choose Your Experience</h1>
        <p className="text-muted-foreground text-body-lg">How should your surprise unfold?</p>
      </div>

      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <h2 className="text-muted-foreground text-meta font-medium tracking-wide uppercase">Story Templates</h2>
          <span className="bg-accent text-accent-foreground rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
            Recommended
          </span>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {templates.map((template) => {
            const isLoading = loadingId === template.id;
            return (
              <motion.button
                key={template.id}
                type="button"
                variants={staggerItem}
                onClick={() => startFromTemplate(template.id)}
                disabled={loadingId !== null}
                whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 340, damping: 26 } }}
                whileTap={cardTap}
                className="group bg-card shadow-soft hover:shadow-soft-lg relative flex flex-col items-start gap-1 overflow-hidden rounded-xl p-6 text-left transition-shadow duration-300 disabled:opacity-60"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
                <span className="text-3xl transition-transform duration-500 group-hover:scale-110">
                  {CATEGORY_EMOJI[template.category] ?? "✨"}
                </span>
                <span className="font-display text-card-title mt-2">
                  {CATEGORY_LABELS[template.category] ?? template.name}
                </span>
                <span className="text-muted-foreground line-clamp-2 h-10 text-caption leading-snug">
                  {template.description}
                </span>
                {isLoading ? (
                  <div className="bg-card/80 absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                    <Loader2 className="text-primary size-5 animate-spin" />
                  </div>
                ) : null}
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-muted-foreground text-meta font-medium tracking-wide uppercase">Blank Story</h2>
        <motion.button
          type="button"
          onClick={startBlank}
          disabled={loadingId !== null}
          whileHover={{ y: -3 }}
          whileTap={cardTap}
          className="border-border/70 hover:border-primary/40 hover:bg-secondary/30 flex items-center gap-4 rounded-xl border-2 border-dashed p-7 text-left transition-colors duration-200 disabled:opacity-60"
        >
          <span className="bg-secondary text-foreground flex size-12 shrink-0 items-center justify-center rounded-lg">
            {loadingId === "blank" ? <Loader2 className="size-5 animate-spin" /> : <PenLine className="size-5" />}
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-display text-card-title">Start from scratch</span>
            <span className="text-muted-foreground text-caption">
              An empty story — add scenes one at a time from the Scene Library.
            </span>
          </div>
        </motion.button>
      </section>

      <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-center text-meta">
        <Sparkles className="size-3.5" />
        Nothing is locked — every scene can be edited, replaced, or removed later.
      </p>
    </div>
  );
}
