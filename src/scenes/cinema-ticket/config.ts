import { z } from "zod";
import type { SceneConfig } from "../types";

export const cinemaTicketDataSchema = z.object({
  movieTitle: z.string().trim().min(1, "Give this moment a title.").max(60),
  date: z.string().trim().max(40).optional().default(""),
  location: z.string().trim().max(60).optional().default(""),
  posterUrl: z.string().url({ message: "Add a poster image." }),
  subtitle: z.string().trim().max(120).optional().default(""),
});

export type CinemaTicketData = z.infer<typeof cinemaTicketDataSchema>;

export const cinemaTicketInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("cinema-ticket"),
  variant: z.string().min(1),
  data: cinemaTicketDataSchema,
});

export const cinemaTicketConfig: SceneConfig<CinemaTicketData> = {
  id: "cinema-ticket",
  label: "Cinema Ticket",
  description: "A premium movie-ticket reveal — curtains open, spotlight rises, your story begins.",
  category: "memories",
  tags: ["cinema", "movie", "ticket", "premiere", "theater", "curtain", "spotlight"],
  emoji: "🎥",
  variants: [{ id: "curtains", label: "Curtains" }],
  defaultVariant: "curtains",
  dataSchema: cinemaTicketDataSchema,
  defaultData: () => ({ movieTitle: "", date: "", location: "", posterUrl: "", subtitle: "" }),
  previewData: () => ({
    movieTitle: "Our Story",
    date: "Now Showing",
    location: "Row 2, Seat 14",
    posterUrl: "https://picsum.photos/seed/moment-preview-cinema/900/1400",
    subtitle: "Feature Presentation",
  }),
  getDurationMs: () => 5600,
};
