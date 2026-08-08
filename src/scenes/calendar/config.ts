import { z } from "zod";
import type { SceneConfig } from "../types";

export const calendarDataSchema = z.object({
  date: z.string().trim().min(1, "Pick a date."),
  title: z.string().trim().min(1, "Give this date a title.").max(60),
  caption: z.string().trim().max(120).optional().default(""),
});

export type CalendarData = z.infer<typeof calendarDataSchema>;

export const calendarInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("calendar"),
  variant: z.string().min(1),
  data: calendarDataSchema,
});

export const calendarConfig: SceneConfig<CalendarData> = {
  id: "calendar",
  label: "Calendar",
  description: "Mark a meaningful date on a flipping calendar page.",
  category: "moments",
  tags: ["calendar", "date", "day", "anniversary", "milestone", "when"],
  emoji: "📅",
  variants: [{ id: "classic", label: "Classic" }],
  defaultVariant: "classic",
  dataSchema: calendarDataSchema,
  defaultData: () => ({ date: "", title: "", caption: "" }),
  previewData: () => ({ date: "2023-06-14", title: "The day we met", caption: "Never forgetting this one" }),
  getDurationMs: () => 3800,
};
