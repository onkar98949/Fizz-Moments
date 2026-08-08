import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const firstDateDataSchema = z.object({
  photoUrl: z.string().url({ message: "Add a photo for this scene." }),
  location: z.string().trim().max(60).optional().default(""),
  date: z.string().trim().max(40).optional().default(""),
  caption: z.string().trim().max(STORY_LIMITS.CAPTION_MAX_LENGTH).optional().default(""),
});

export type FirstDateData = z.infer<typeof firstDateDataSchema>;

export const firstDateInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("first-date"),
  variant: z.string().min(1),
  data: firstDateDataSchema,
});

export const firstDateConfig: SceneConfig<FirstDateData> = {
  id: "first-date",
  label: "First Date",
  description: "A cozy cafe scene — steam rises from the cups while your memory gently appears.",
  category: "love-story",
  tags: ["love story", "first date", "cafe", "coffee", "cozy", "romance"],
  emoji: "☕",
  variants: [{ id: "cafe", label: "Cafe" }],
  defaultVariant: "cafe",
  dataSchema: firstDateDataSchema,
  defaultData: () => ({ photoUrl: "", location: "", date: "", caption: "" }),
  previewData: () => ({
    photoUrl: "https://picsum.photos/seed/moment-preview-firstdate/900/1400",
    location: "Corner Cafe",
    date: "Feb 14, 2022",
    caption: "Three hours felt like ten minutes",
  }),
  getDurationMs: () => 4800,
};
