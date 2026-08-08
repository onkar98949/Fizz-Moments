import { z } from "zod";
import type { SceneConfig } from "../types";

export const boardingPassDataSchema = z.object({
  departure: z.string().trim().min(1, "Where from?").max(40),
  destination: z.string().trim().min(1, "Where to?").max(40),
  date: z.string().trim().max(40).optional().default(""),
  flightNumber: z.string().trim().max(20).optional().default(""),
});

export type BoardingPassData = z.infer<typeof boardingPassDataSchema>;

export const boardingPassInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("boarding-pass"),
  variant: z.string().min(1),
  data: boardingPassDataSchema,
});

export const boardingPassConfig: SceneConfig<BoardingPassData> = {
  id: "boarding-pass",
  label: "Boarding Pass",
  description: "A realistic boarding pass prints in, then the whole scene zooms into the sky.",
  category: "travel",
  tags: ["boarding pass", "flight", "airport", "travel", "trip", "departure"],
  emoji: "🛂",
  variants: [{ id: "print", label: "Print" }],
  defaultVariant: "print",
  dataSchema: boardingPassDataSchema,
  defaultData: () => ({ departure: "", destination: "", date: "", flightNumber: "" }),
  previewData: () => ({ departure: "NYC", destination: "LIS", date: "Mar 14, 2023", flightNumber: "TP 205" }),
  getDurationMs: () => 4200,
};
