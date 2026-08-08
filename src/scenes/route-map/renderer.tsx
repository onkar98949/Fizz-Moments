"use client";

import { RouteMap } from "../memory-map/variants/route";
import type { RouteMapData } from "./config";
import type { SceneRendererProps } from "../types";

export function RouteMapRenderer({ data }: SceneRendererProps<RouteMapData>) {
  return <RouteMap data={data} />;
}
