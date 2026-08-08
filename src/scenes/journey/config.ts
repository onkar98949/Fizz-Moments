import { z } from "zod";
import type { SceneConfig } from "../types";

export const transportationSchema = z.enum(["plane", "car", "train"]);

export const journeyDataSchema = z.object({
  from: z.string().trim().min(1, "Where did the journey start?").max(60),
  to: z.string().trim().min(1, "Where did the journey end?").max(60),
  transportation: transportationSchema,
  photoUrl: z.string().url().optional().or(z.literal("")),
  caption: z.string().trim().max(120).optional().default(""),
});

export type Transportation = z.infer<typeof transportationSchema>;
export type JourneyData = z.infer<typeof journeyDataSchema>;

export const journeyInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("journey"),
  variant: z.string().min(1),
  data: journeyDataSchema,
});

export const journeyConfig: SceneConfig<JourneyData> = {
  id: "journey",
  label: "Journey",
  description: "A travel route from one place to another.",
  category: "travel",
  tags: ["journey", "travel", "trip", "location", "flight", "plane", "road trip", "map", "destination", "compass"],
  emoji: "🧭",
  variants: [{ id: "plane-route", label: "Plane Route" }],
  defaultVariant: "plane-route",
  dataSchema: journeyDataSchema,
  defaultData: () => ({ from: "", to: "", transportation: "plane", photoUrl: "", caption: "" }),
  previewData: () => ({
    from: "Paris",
    to: "Rome",
    transportation: "plane",
    photoUrl: "https://picsum.photos/seed/moment-preview-journey/900/1400",
    caption: "Chasing sunsets across two cities",
  }),
  getDurationMs: () => 5000,
};
