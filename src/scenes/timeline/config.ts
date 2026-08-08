import { z } from "zod";
import type { SceneConfig } from "../types";

export const timelineMomentSchema = z.object({
  id: z.string(),
  photoUrl: z.string().url(),
  title: z.string().trim().min(1, "Give this moment a title.").max(80),
  caption: z.string().trim().max(120).optional().default(""),
});

export const timelineDataSchema = z.object({
  moments: z.array(timelineMomentSchema).min(2, "Add at least 2 moments.").max(6, "Add at most 6 moments."),
});

export type TimelineMoment = z.infer<typeof timelineMomentSchema>;
export type TimelineData = z.infer<typeof timelineDataSchema>;

export const timelineInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("timeline"),
  variant: z.string().min(1),
  data: timelineDataSchema,
});

const MS_PER_MOMENT = 3200;

export const timelineConfig: SceneConfig<TimelineData> = {
  id: "timeline",
  label: "Timeline",
  description: "A chronological sequence of your favorite memories together.",
  category: "memories",
  tags: ["timeline", "memories", "photos", "moments", "chronological", "milestone"],
  emoji: "📍",
  variants: [{ id: "cascade", label: "Cascade" }],
  defaultVariant: "cascade",
  dataSchema: timelineDataSchema,
  defaultData: () => ({ moments: [] }),
  previewData: () => ({
    moments: [
      { id: "p1", photoUrl: "https://picsum.photos/seed/moment-preview-tl1/900/1400", title: "The first hello", caption: "Where it all began" },
      { id: "p2", photoUrl: "https://picsum.photos/seed/moment-preview-tl2/900/1400", title: "Summer road trip", caption: "Windows down, laughing" },
      { id: "p3", photoUrl: "https://picsum.photos/seed/moment-preview-tl3/900/1400", title: "That perfect evening", caption: "Still my favorite" },
    ],
  }),
  getDurationMs: (data) => Math.min(Math.max(data.moments.length * MS_PER_MOMENT, 4000), 14000),
};
