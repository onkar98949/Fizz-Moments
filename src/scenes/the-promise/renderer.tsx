"use client";

import { RingBoxPromise } from "./variants/ring-box";
import type { ThePromiseData } from "./config";
import type { SceneRendererProps } from "../types";

export function ThePromiseRenderer({ data }: SceneRendererProps<ThePromiseData>) {
  return <RingBoxPromise data={data} />;
}
