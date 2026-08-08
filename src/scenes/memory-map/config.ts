import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const mapStopSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Name this place.").max(60),
  date: z.string().trim().max(40).optional().default(""),
  photoUrl: z.string().url(),
  caption: z.string().trim().max(STORY_LIMITS.CAPTION_MAX_LENGTH).optional().default(""),
});

export const memoryMapDataSchema = z.object({
  stops: z.array(mapStopSchema).min(2, "Add at least 2 stops.").max(5, "Add at most 5 stops."),
});

export type MapStop = z.infer<typeof mapStopSchema>;
export type MemoryMapData = z.infer<typeof memoryMapDataSchema>;

export const memoryMapInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("memory-map"),
  variant: z.string().min(1),
  data: memoryMapDataSchema,
});

const MS_PER_STOP = 3400;

export const memoryMapConfig: SceneConfig<MemoryMapData> = {
  id: "memory-map",
  label: "Memory Map",
  description: "An illustrated map that drops a pin and draws a route to every place that mattered.",
  category: "travel",
  tags: ["map", "travel", "route", "pin", "location", "trip", "places", "journey", "destinations"],
  emoji: "🗺️",
  variants: [{ id: "route", label: "Route" }],
  defaultVariant: "route",
  dataSchema: memoryMapDataSchema,
  defaultData: () => ({ stops: [] }),
  previewData: () => ({
    stops: [
      {
        id: "s1",
        name: "Paris",
        date: "Jun 2023",
        photoUrl: "https://picsum.photos/seed/moment-preview-map1/900/1400",
        caption: "Where the trip began",
      },
      {
        id: "s2",
        name: "Florence",
        date: "Jun 2023",
        photoUrl: "https://picsum.photos/seed/moment-preview-map2/900/1400",
        caption: "Gelato every single day",
      },
      {
        id: "s3",
        name: "Santorini",
        date: "Jul 2023",
        photoUrl: "https://picsum.photos/seed/moment-preview-map3/900/1400",
        caption: "That sunset we still talk about",
      },
    ],
  }),
  getDurationMs: (data) => Math.min(Math.max(data.stops.length * MS_PER_STOP, 5000), 17000),
};
