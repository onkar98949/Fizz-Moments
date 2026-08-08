import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const sunsetMemoryDataSchema = z.object({
  photoUrl: z.string().url({ message: "Add a photo for this scene." }),
  caption: z.string().trim().max(STORY_LIMITS.CAPTION_MAX_LENGTH).optional().default(""),
});

export type SunsetMemoryData = z.infer<typeof sunsetMemoryDataSchema>;

export const sunsetMemoryInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("sunset-memory"),
  variant: z.string().min(1),
  data: sunsetMemoryDataSchema,
});

export const sunsetMemoryConfig: SceneConfig<SunsetMemoryData> = {
  id: "sunset-memory",
  label: "Sunset Memory",
  description: "A golden-hour sun sets slowly behind your most emotional travel moment.",
  category: "travel",
  tags: ["sunset", "golden hour", "travel", "emotional", "horizon"],
  emoji: "🌇",
  variants: [{ id: "horizon", label: "Horizon" }],
  defaultVariant: "horizon",
  dataSchema: sunsetMemoryDataSchema,
  defaultData: () => ({ photoUrl: "", caption: "" }),
  previewData: () => ({
    photoUrl: "https://picsum.photos/seed/moment-preview-sunsettravel/900/1400",
    caption: "We just sat there and watched it happen",
  }),
  getDurationMs: () => 4400,
};
