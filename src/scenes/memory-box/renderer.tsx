"use client";

import { UnboxBox } from "./variants/unbox";
import type { MemoryBoxData } from "./config";
import type { SceneRendererProps } from "../types";

export function MemoryBoxRenderer({ data }: SceneRendererProps<MemoryBoxData>) {
  return <UnboxBox data={data} />;
}
