import { z } from "zod";
import type { SceneConfig } from "../types";

export const boardingLegSchema = z.object({
  id: z.string(),
  from: z.string().trim().min(1, "Where from?").max(40),
  to: z.string().trim().min(1, "Where to?").max(40),
  date: z.string().trim().max(40).optional().default(""),
  photoUrl: z.string().url(),
});

export const boardingTimelineDataSchema = z.object({
  legs: z.array(boardingLegSchema).min(2, "Add at least 2 destinations.").max(4, "Add at most 4 destinations."),
});

export type BoardingLeg = z.infer<typeof boardingLegSchema>;
export type BoardingTimelineData = z.infer<typeof boardingTimelineDataSchema>;

export const boardingTimelineInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("boarding-timeline"),
  variant: z.string().min(1),
  data: boardingTimelineDataSchema,
});

const MS_PER_LEG = 3600;

export const boardingTimelineConfig: SceneConfig<BoardingTimelineData> = {
  id: "boarding-timeline",
  label: "Boarding Timeline",
  description: "An airport departure board that flips through every destination you've shared.",
  category: "travel",
  tags: ["boarding", "airport", "flight", "departure", "travel", "flip board", "destinations"],
  emoji: "✈️",
  variants: [{ id: "departure-board", label: "Departure Board" }],
  defaultVariant: "departure-board",
  dataSchema: boardingTimelineDataSchema,
  defaultData: () => ({ legs: [] }),
  previewData: () => ({
    legs: [
      { id: "l1", from: "NYC", to: "LIS", date: "Mar 2023", photoUrl: "https://picsum.photos/seed/moment-preview-board1/900/1400" },
      { id: "l2", from: "LIS", to: "BCN", date: "Mar 2023", photoUrl: "https://picsum.photos/seed/moment-preview-board2/900/1400" },
      { id: "l3", from: "BCN", to: "NYC", date: "Apr 2023", photoUrl: "https://picsum.photos/seed/moment-preview-board3/900/1400" },
    ],
  }),
  getDurationMs: (data) => Math.min(Math.max(data.legs.length * MS_PER_LEG, 5500), 15000),
};
