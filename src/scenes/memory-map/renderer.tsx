"use client";

import { RouteMap } from "./variants/route";
import type { MemoryMapData } from "./config";
import type { SceneRendererProps } from "../types";

export function MemoryMapRenderer({ data }: SceneRendererProps<MemoryMapData>) {
  return <RouteMap data={data} />;
}
