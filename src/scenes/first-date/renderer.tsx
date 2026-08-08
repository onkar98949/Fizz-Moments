"use client";

import { CafeFirstDate } from "./variants/cafe";
import type { FirstDateData } from "./config";
import type { SceneRendererProps } from "../types";

export function FirstDateRenderer({ data }: SceneRendererProps<FirstDateData>) {
  return <CafeFirstDate data={data} />;
}
