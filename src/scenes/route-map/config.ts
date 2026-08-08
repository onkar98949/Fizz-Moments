import { z } from "zod";
import { mapStopSchema } from "../memory-map/config";
import type { SceneConfig } from "../types";

/** Same shape as Memory Map's stops (structurally — reuses its Builder and
 *  Renderer directly), framed here as start / destination / optional stops. */
export const routeMapDataSchema = z.object({
  stops: z.array(mapStopSchema).min(2, "Add a starting point and a destination.").max(4, "Add at most 4 stops."),
});

export type RouteMapData = z.infer<typeof routeMapDataSchema>;

export const routeMapInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("route-map"),
  variant: z.string().min(1),
  data: routeMapDataSchema,
});

const MS_PER_STOP = 3400;

export const routeMapConfig: SceneConfig<RouteMapData> = {
  id: "route-map",
  label: "Route Map",
  description: "An animated map where your route draws itself between every place you went.",
  category: "travel",
  tags: ["route", "map", "travel", "trip", "pin", "world map", "flight path"],
  emoji: "🧭",
  variants: [{ id: "route", label: "Route" }],
  defaultVariant: "route",
  dataSchema: routeMapDataSchema,
  defaultData: () => ({ stops: [] }),
  previewData: () => ({
    stops: [
      {
        id: "r1",
        name: "Home",
        date: "",
        photoUrl: "https://picsum.photos/seed/moment-preview-route1/900/1400",
        caption: "Where the trip began",
      },
      {
        id: "r2",
        name: "Kyoto",
        date: "Oct 2023",
        photoUrl: "https://picsum.photos/seed/moment-preview-route2/900/1400",
        caption: "First stop, first surprise",
      },
      {
        id: "r3",
        name: "Tokyo",
        date: "Oct 2023",
        photoUrl: "https://picsum.photos/seed/moment-preview-route3/900/1400",
        caption: "The trip we still talk about",
      },
    ],
  }),
  getDurationMs: (data) => Math.min(Math.max(data.stops.length * MS_PER_STOP, 5000), 14000),
};
