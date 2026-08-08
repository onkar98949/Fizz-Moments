import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const REEL_EMOJI_OPTIONS = ["❤️", "🔥", "😂", "🥹", "😍", "✨"] as const;

export const memoryReelDataSchema = z.object({
  photoUrl: z.string().url({ message: "Add a photo for this scene." }),
  caption: z.string().trim().max(STORY_LIMITS.CAPTION_MAX_LENGTH).optional().default(""),
  emoji: z.string().optional().default("❤️"),
  date: z.string().trim().max(40).optional().default(""),
});

export type MemoryReelData = z.infer<typeof memoryReelDataSchema>;

export const memoryReelInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("memory-reel"),
  variant: z.string().min(1),
  data: memoryReelDataSchema,
});

export const memoryReelConfig: SceneConfig<MemoryReelData> = {
  id: "memory-reel",
  label: "Memory Reel",
  description: "A full-screen, swipe-style moment with a floating reaction — modern and fast.",
  category: "modern",
  tags: ["reel", "story", "swipe", "vertical", "social", "reaction", "modern"],
  emoji: "🎞️",
  variants: [{ id: "swipe", label: "Swipe" }],
  defaultVariant: "swipe",
  dataSchema: memoryReelDataSchema,
  defaultData: () => ({ photoUrl: "", caption: "", emoji: "❤️", date: "" }),
  previewData: () => ({
    photoUrl: "https://picsum.photos/seed/moment-preview-reel/900/1400",
    caption: "This one's living in my camera roll forever",
    emoji: "🔥",
    date: "",
  }),
  getDurationMs: () => 4200,
};
