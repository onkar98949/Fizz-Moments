"use client";

import { SwipeReel } from "./variants/swipe";
import type { MemoryReelData } from "./config";
import type { SceneRendererProps } from "../types";

export function MemoryReelRenderer({ data }: SceneRendererProps<MemoryReelData>) {
  return <SwipeReel data={data} />;
}
