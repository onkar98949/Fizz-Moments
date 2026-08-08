import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const landmarkMemoryDataSchema = z.object({
  photoUrl: z.string().url({ message: "Add a photo for this scene." }),
  landmarkName: z.string().trim().min(1, "Name this place.").max(60),
  caption: z.string().trim().max(STORY_LIMITS.CAPTION_MAX_LENGTH).optional().default(""),
});

export type LandmarkMemoryData = z.infer<typeof landmarkMemoryDataSchema>;

export const landmarkMemoryInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("landmark-memory"),
  variant: z.string().min(1),
  data: landmarkMemoryDataSchema,
});

export const landmarkMemoryConfig: SceneConfig<LandmarkMemoryData> = {
  id: "landmark-memory",
  label: "Landmark Memory",
  description: "A cinematic destination photo with a location pin dropping into place.",
  category: "travel",
  tags: ["landmark", "travel", "destination", "pin", "location", "sightseeing"],
  emoji: "📍",
  variants: [{ id: "pin-drop", label: "Pin Drop" }],
  defaultVariant: "pin-drop",
  dataSchema: landmarkMemoryDataSchema,
  defaultData: () => ({ photoUrl: "", landmarkName: "", caption: "" }),
  previewData: () => ({
    photoUrl: "https://picsum.photos/seed/moment-preview-landmark/900/1400",
    landmarkName: "Eiffel Tower",
    caption: "We climbed every single step",
  }),
  getDurationMs: () => 4400,
};
