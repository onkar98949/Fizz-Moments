"use client";

import { MergeGlance } from "./variants/merge";
import type { FirstGlanceData } from "./config";
import type { SceneRendererProps } from "../types";

export function FirstGlanceRenderer({ data }: SceneRendererProps<FirstGlanceData>) {
  return <MergeGlance data={data} />;
}
