import { z } from "zod";
import type { SceneConfig } from "../types";

export const firstGlanceDataSchema = z.object({
  photoUrl: z.string().url({ message: "Add the couple's photo." }),
  nameA: z.string().trim().min(1, "First name?").max(40),
  nameB: z.string().trim().min(1, "Second name?").max(40),
  title: z.string().trim().max(60).optional().default(""),
});

export type FirstGlanceData = z.infer<typeof firstGlanceDataSchema>;

export const firstGlanceInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("first-glance"),
  variant: z.string().min(1),
  data: firstGlanceDataSchema,
});

export const firstGlanceConfig: SceneConfig<FirstGlanceData> = {
  id: "first-glance",
  label: "First Glance",
  description: "Two silhouettes merge into your first photo together, in a soft glow of hearts.",
  category: "love-story",
  tags: ["love story", "first glance", "silhouette", "romance", "hearts", "opening"],
  emoji: "❤️",
  variants: [{ id: "merge", label: "Merge" }],
  defaultVariant: "merge",
  dataSchema: firstGlanceDataSchema,
  defaultData: () => ({ photoUrl: "", nameA: "", nameB: "", title: "" }),
  previewData: () => ({
    photoUrl: "https://picsum.photos/seed/moment-preview-firstglance/900/1400",
    nameA: "Sam",
    nameB: "Alex",
    title: "Where it all started",
  }),
  getDurationMs: () => 4600,
};
