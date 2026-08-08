"use client";

import { NightSkyConstellation } from "./variants/night-sky";
import type { ConstellationData } from "./config";
import type { SceneRendererProps } from "../types";

export function ConstellationRenderer({ data }: SceneRendererProps<ConstellationData>) {
  return <NightSkyConstellation data={data} />;
}
