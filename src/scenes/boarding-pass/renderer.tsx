"use client";

import { PrintBoardingPass } from "./variants/print";
import type { BoardingPassData } from "./config";
import type { SceneRendererProps } from "../types";

export function BoardingPassRenderer({ data }: SceneRendererProps<BoardingPassData>) {
  return <PrintBoardingPass data={data} />;
}
