import { z } from "zod";
import type { SceneConfig } from "../types";

export const hotelCheckInDataSchema = z.object({
  hotelName: z.string().trim().min(1, "Name the hotel.").max(60),
  city: z.string().trim().max(40).optional().default(""),
  photoUrl: z.string().url({ message: "Add a photo for this scene." }),
});

export type HotelCheckInData = z.infer<typeof hotelCheckInDataSchema>;

export const hotelCheckInInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("hotel-check-in"),
  variant: z.string().min(1),
  data: hotelCheckInDataSchema,
});

export const hotelCheckInConfig: SceneConfig<HotelCheckInData> = {
  id: "hotel-check-in",
  label: "Hotel Check-in",
  description: "A key card flips over to reveal the first memory of the stay.",
  category: "travel",
  tags: ["hotel", "check-in", "key card", "travel", "vacation", "stay"],
  emoji: "🗝️",
  variants: [{ id: "key-card", label: "Key Card" }],
  defaultVariant: "key-card",
  dataSchema: hotelCheckInDataSchema,
  defaultData: () => ({ hotelName: "", city: "", photoUrl: "" }),
  previewData: () => ({
    hotelName: "The Grand Meridian",
    city: "Lisbon",
    photoUrl: "https://picsum.photos/seed/moment-preview-hotel/900/1400",
  }),
  getDurationMs: () => 4200,
};
