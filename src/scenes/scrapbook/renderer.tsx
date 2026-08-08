"use client";

import { HandmadeScrapbook } from "./variants/handmade";
import type { ScrapbookData } from "./config";
import type { SceneRendererProps } from "../types";

export function ScrapbookRenderer({ data }: SceneRendererProps<ScrapbookData>) {
  return <HandmadeScrapbook data={data} />;
}
