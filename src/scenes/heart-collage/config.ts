import { z } from "zod";
import type { SceneConfig } from "../types";

export const heartCollagePhotoSchema = z.object({ id: z.string(), photoUrl: z.string().url() });

export const heartCollageDataSchema = z.object({
  photos: z.array(heartCollagePhotoSchema).min(6, "Add at least 6 photos.").max(12, "Add at most 12 photos."),
});

export type HeartCollagePhoto = z.infer<typeof heartCollagePhotoSchema>;
export type HeartCollageData = z.infer<typeof heartCollageDataSchema>;

export const heartCollageInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("heart-collage"),
  variant: z.string().min(1),
  data: heartCollageDataSchema,
});

export const heartCollageConfig: SceneConfig<HeartCollageData> = {
  id: "heart-collage",
  label: "Heart Collage",
  description: "Your favorite photos fly in from every direction and assemble into one big heart.",
  category: "love-story",
  tags: ["love story", "heart", "collage", "photos", "assemble"],
  emoji: "💖",
  variants: [{ id: "assemble", label: "Assemble" }],
  defaultVariant: "assemble",
  dataSchema: heartCollageDataSchema,
  defaultData: () => ({ photos: [] }),
  previewData: () => ({
    photos: Array.from({ length: 8 }, (_, i) => ({
      id: `h${i}`,
      photoUrl: `https://picsum.photos/seed/moment-preview-heart${i}/600/600`,
    })),
  }),
  getDurationMs: (data) => 900 + data.photos.length * 220 + 1600,
};
