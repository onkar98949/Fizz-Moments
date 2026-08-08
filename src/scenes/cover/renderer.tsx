import type { CoverData } from "./config";
import type { SceneRendererProps } from "../types";
import { ClassicCover } from "./variants/classic";

export function CoverRenderer({ data, story }: SceneRendererProps<CoverData>) {
  return <ClassicCover data={data} story={story} />;
}
