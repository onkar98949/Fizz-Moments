import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const foreverDataSchema = z.object({
  photoUrl: z.string().url({ message: "Add a photo for this scene." }),
  endingMessage: z.string().trim().min(1, "Write a closing message.").max(STORY_LIMITS.MESSAGE_MAX_LENGTH),
});

export type ForeverData = z.infer<typeof foreverDataSchema>;

export const foreverInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("forever"),
  variant: z.string().min(1),
  data: foreverDataSchema,
});

export const foreverConfig: SceneConfig<ForeverData> = {
  id: "forever",
  label: "Forever",
  description: "A cinematic golden-hour close — your favorite memory and one last message.",
  category: "love-story",
  tags: ["love story", "forever", "sunset", "ending", "cinematic"],
  emoji: "🌅",
  variants: [{ id: "golden-hour", label: "Golden Hour" }],
  defaultVariant: "golden-hour",
  dataSchema: foreverDataSchema,
  defaultData: () => ({ photoUrl: "", endingMessage: "" }),
  previewData: () => ({
    photoUrl: "https://picsum.photos/seed/moment-preview-forever/900/1400",
    endingMessage: "Here's to every sunset still ahead of us.",
  }),
  getDurationMs: () => 4600,
};
