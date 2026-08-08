"use client";

import { AssembleHeart } from "./variants/assemble";
import type { HeartCollageData } from "./config";
import type { SceneRendererProps } from "../types";

export function HeartCollageRenderer({ data }: SceneRendererProps<HeartCollageData>) {
  return <AssembleHeart data={data} />;
}
