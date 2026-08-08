import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const constellationDataSchema = z.object({
  title: z.string().trim().min(1, "Give this memory a title.").max(60),
  photoUrl: z.string().url({ message: "Add a photo for this scene." }),
  caption: z.string().trim().max(STORY_LIMITS.CAPTION_MAX_LENGTH).optional().default(""),
});

export type ConstellationData = z.infer<typeof constellationDataSchema>;

export const constellationInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("constellation"),
  variant: z.string().min(1),
  data: constellationDataSchema,
});

export const constellationConfig: SceneConfig<ConstellationData> = {
  id: "constellation",
  label: "Constellation Story",
  description: "A peaceful night sky where stars connect, one by one, to unlock a memory.",
  category: "emotional",
  tags: ["stars", "constellation", "night sky", "sky", "celestial", "space", "wish"],
  emoji: "🌌",
  variants: [{ id: "night-sky", label: "Night Sky" }],
  defaultVariant: "night-sky",
  dataSchema: constellationDataSchema,
  defaultData: () => ({ title: "", photoUrl: "", caption: "" }),
  previewData: () => ({
    title: "The night we met",
    photoUrl: "https://picsum.photos/seed/moment-preview-constellation/900/1400",
    caption: "Under the same sky, ever since",
  }),
  getDurationMs: () => 5800,
};
