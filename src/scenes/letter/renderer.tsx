import type { LetterData } from "./config";
import type { SceneRendererProps } from "../types";
import { ClassicLetter } from "./variants/classic";

export function LetterRenderer({ data, story }: SceneRendererProps<LetterData>) {
  return <ClassicLetter data={data} story={story} />;
}
