import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const foodMemoryDataSchema = z.object({
  photoUrl: z.string().url({ message: "Add a photo of the food." }),
  restaurant: z.string().trim().min(1, "Name the restaurant.").max(60),
  caption: z.string().trim().max(STORY_LIMITS.CAPTION_MAX_LENGTH).optional().default(""),
});

export type FoodMemoryData = z.infer<typeof foodMemoryDataSchema>;

export const foodMemoryInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("food-memory"),
  variant: z.string().min(1),
  data: foodMemoryDataSchema,
});

export const foodMemoryConfig: SceneConfig<FoodMemoryData> = {
  id: "food-memory",
  label: "Food Memory",
  description: "An elegant menu card unfolds to showcase your favorite meal from the trip.",
  category: "travel",
  tags: ["food", "restaurant", "menu", "travel", "meal", "dining"],
  emoji: "🍽️",
  variants: [{ id: "menu", label: "Menu" }],
  defaultVariant: "menu",
  dataSchema: foodMemoryDataSchema,
  defaultData: () => ({ photoUrl: "", restaurant: "", caption: "" }),
  previewData: () => ({
    photoUrl: "https://picsum.photos/seed/moment-preview-food/900/900",
    restaurant: "Trattoria Bellina",
    caption: "Best pasta of the entire trip, no contest",
  }),
  getDurationMs: () => 4200,
};
