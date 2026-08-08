import type { EndingData } from "./config";
import type { SceneRendererProps } from "../types";
import { ClassicEnding } from "./variants/classic";

export function EndingRenderer({ data }: SceneRendererProps<EndingData>) {
  return <ClassicEnding data={data} />;
}
