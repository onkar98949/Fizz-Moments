import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const cameraRollPhotoSchema = z.object({
  id: z.string(),
  photoUrl: z.string().url(),
  caption: z.string().trim().max(STORY_LIMITS.CAPTION_MAX_LENGTH).optional().default(""),
  isFavorite: z.boolean().optional().default(false),
});

export const cameraRollDataSchema = z.object({
  photos: z.array(cameraRollPhotoSchema).min(4, "Add at least 4 photos.").max(20, "Add at most 20 photos."),
});

export type CameraRollPhoto = z.infer<typeof cameraRollPhotoSchema>;
export type CameraRollData = z.infer<typeof cameraRollDataSchema>;

export const cameraRollInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("camera-roll"),
  variant: z.string().min(1),
  data: cameraRollDataSchema,
});

const MS_PER_HIGHLIGHT = 3000;

/** Only favorited photos get their own full-screen moment — everything else
 *  is decorative scrolling texture behind them. Falls back to all photos if
 *  nothing's been marked a favorite yet. */
export function getCameraRollHighlights(data: CameraRollData): CameraRollPhoto[] {
  const favorites = data.photos.filter((p) => p.isFavorite);
  return favorites.length > 0 ? favorites : data.photos.slice(0, 5);
}

export const cameraRollConfig: SceneConfig<CameraRollData> = {
  id: "camera-roll",
  label: "Camera Roll",
  description: "A scrolling gallery that stops on your favorites and lets them fill the screen.",
  category: "memories",
  tags: ["camera roll", "gallery", "photos", "phone", "scroll", "favorites", "album"],
  emoji: "📱",
  variants: [{ id: "scroll", label: "Scroll" }],
  defaultVariant: "scroll",
  dataSchema: cameraRollDataSchema,
  defaultData: () => ({ photos: [] }),
  previewData: () => ({
    photos: [
      { id: "c1", photoUrl: "https://picsum.photos/seed/moment-preview-roll1/600/600", caption: "", isFavorite: false },
      { id: "c2", photoUrl: "https://picsum.photos/seed/moment-preview-roll2/600/600", caption: "", isFavorite: false },
      {
        id: "c3",
        photoUrl: "https://picsum.photos/seed/moment-preview-roll3/900/1400",
        caption: "This one lives in my head rent free",
        isFavorite: true,
      },
      { id: "c4", photoUrl: "https://picsum.photos/seed/moment-preview-roll4/600/600", caption: "", isFavorite: false },
      {
        id: "c5",
        photoUrl: "https://picsum.photos/seed/moment-preview-roll5/900/1400",
        caption: "Still can't believe this happened",
        isFavorite: true,
      },
      { id: "c6", photoUrl: "https://picsum.photos/seed/moment-preview-roll6/600/600", caption: "", isFavorite: false },
    ],
  }),
  getDurationMs: (data) => Math.min(Math.max(getCameraRollHighlights(data).length * MS_PER_HIGHLIGHT, 5000), 16000),
};
