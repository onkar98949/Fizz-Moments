import { z } from "zod";
import type { SceneConfig } from "../types";

export const coverDataSchema = z.object({
  emoji: z.string().min(1).max(8),
});

export type CoverData = z.infer<typeof coverDataSchema>;

export const coverInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("cover"),
  variant: z.string().min(1),
  data: coverDataSchema,
});

export const COVER_EMOJI_OPTIONS = ["✨", "💕", "🎂", "✈️", "🎓", "🙏", "🥂", "👨‍👩‍👧"];

export const coverConfig: SceneConfig<CoverData> = {
  id: "cover",
  label: "Cover",
  description: "The opening title card for your story.",
  category: "structure",
  tags: ["cover", "intro", "title", "opening", "start"],
  emoji: "✨",
  variants: [{ id: "classic", label: "Classic" }],
  defaultVariant: "classic",
  dataSchema: coverDataSchema,
  defaultData: () => ({ emoji: "✨" }),
  previewData: () => ({ emoji: "💕" }),
  getDurationMs: () => 2800,
};
