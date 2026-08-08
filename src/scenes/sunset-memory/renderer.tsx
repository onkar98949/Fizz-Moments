"use client";

import { HorizonSunset } from "./variants/horizon";
import type { SunsetMemoryData } from "./config";
import type { SceneRendererProps } from "../types";

export function SunsetMemoryRenderer({ data }: SceneRendererProps<SunsetMemoryData>) {
  return <HorizonSunset data={data} />;
}
