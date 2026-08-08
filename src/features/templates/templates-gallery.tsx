"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, PenLine, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createBlankProjectAction, createFromTemplateAction } from "@/actions/template-actions";
import { TEMPLATE_CATEGORIES } from "@/constants/template";
import { isNextRedirectError } from "@/lib/utils";
import { cardTap, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { TemplateLivePreview } from "./template-live-preview";
import type { TemplateCategory, TemplateCatalogEntry } from "@/types/template";
import { cn } from "@/lib/utils";

type TemplatesGalleryProps = {
  templates: TemplateCatalogEntry[];
};

/** Each category gets its own soft-tinted "shelf" so the page reads as five
 *  distinct collections, not one long undifferentiated grid — except
 *  Minimal, which deliberately stays on the plain page background. A
 *  colorful shelf around the one category defined by restraint would be a
 *  contradiction, not a decoration. */
const CATEGORY_STYLE: Partial<Record<TemplateCategory, { clay: string; tintVar: string }>> = {
  LOVE: { clay: "clay-coral", tintVar: "--coral" },
  BIRTHDAY: { clay: "clay-yellow", tintVar: "--warm-yellow" },
  ANNIVERSARY: { clay: "clay-lavender", tintVar: "--lavender" },
  SCRAPBOOK: { clay: "clay-sky", tintVar: "--sky" },
};

export function TemplatesGallery({ templates }: TemplatesGalleryProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function startBlank() {
    setLoadingId("blank");
    try {
      await createBlankProjectAction();
    } catch (error) {
      if (isNextRedirectError(error)) throw error;
      toast.error("Couldn't start a new project. Please try again.");
      setLoadingId(null);
    }
  }

  async function startFromTemplate(id: string) {
    setLoadingId(id);
    try {
      const result = await createFromTemplateAction(id);
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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-5 py-16 sm:py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-section">Templates</h1>
        <p className="text-muted-foreground text-body-lg max-w-md">
          Start from scratch, or edit a beautiful ready-made design.
        </p>
      </div>

      <section className="flex flex-col gap-5">
        <h2 className="text-muted-foreground text-meta font-medium tracking-wide uppercase">Blank Template</h2>
        <motion.button
          type="button"
          onClick={startBlank}
          disabled={loadingId !== null}
          whileHover={{ y: -3 }}
          whileTap={cardTap}
          className="border-border/70 hover:border-primary/40 hover:bg-secondary/30 flex items-center gap-4 rounded-xl border-2 border-dashed p-7 text-left transition-colors duration-200"
        >
          <span className="bg-secondary text-foreground flex size-12 shrink-0 items-center justify-center rounded-lg">
            {loadingId === "blank" ? <Loader2 className="size-5 animate-spin" /> : <PenLine className="size-5" />}
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-display text-card-title">Start from scratch</span>
            <span className="text-muted-foreground text-caption">An empty canvas — total creative freedom.</span>
          </div>
        </motion.button>
      </section>

      {TEMPLATE_CATEGORIES.map((category) => {
        const categoryTemplates = templates.filter((t) => t.category === category.value);
        if (categoryTemplates.length === 0) return null;
        const style = CATEGORY_STYLE[category.value];

        return (
          <section
            key={category.value}
            className={cn("rounded-3xl", style && "p-5 sm:p-7")}
            style={style ? { backgroundColor: `color-mix(in oklch, var(${style.tintVar}) 13%, var(--background))` } : undefined}
          >
            <div className="mb-5 flex items-center gap-3">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-2xl text-lg",
                  style ? cn("clay text-white", style.clay) : "bg-secondary",
                )}
              >
                {category.emoji}
              </span>
              <div className="flex flex-col">
                <h2 className="font-display text-card-title leading-tight">{category.label}</h2>
                <span className="text-muted-foreground text-meta">
                  {categoryTemplates.length} design{categoryTemplates.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            >
              {categoryTemplates.map((template) => {
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
                    className="group bg-card shadow-soft hover:shadow-soft-lg relative flex flex-col overflow-hidden rounded-xl text-left transition-shadow duration-300 disabled:opacity-60"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <TemplateLivePreview scenes={template.seedScenes} />
                      {/* Shine sweep — a signature premium-card moment, not a decoration
                          repeated everywhere; reserved for the primary browsing surfaces. */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-10 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                      />
                      {isLoading ? (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 backdrop-blur-[2px]">
                          <Loader2 className="size-6 animate-spin text-white" />
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col p-5">
                      <h3 className="font-display text-foreground line-clamp-2 h-[3.25rem] text-lg leading-snug">
                        {template.name}
                      </h3>
                      <p className="text-muted-foreground mt-1.5 line-clamp-2 h-10 text-caption leading-snug">
                        {template.description}
                      </p>
                    </div>
                    <div
                      aria-hidden
                      className="ring-primary/25 pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-2 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </motion.button>
                );
              })}
            </motion.div>
          </section>
        );
      })}

      <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-center text-meta">
        <Sparkles className="size-3.5" />
        More templates coming soon.
      </p>
    </div>
  );
}
