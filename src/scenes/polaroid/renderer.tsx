import type { PolaroidData } from "./config";
import type { SceneRendererProps } from "../types";
import { TapePolaroid } from "./variants/tape";

export function PolaroidRenderer({ data }: SceneRendererProps<PolaroidData>) {
  return <TapePolaroid data={data} />;
}
