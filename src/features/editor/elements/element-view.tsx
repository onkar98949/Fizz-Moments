import type { SceneElement } from "@/types/template";
import { TextElementView } from "./text-element-view";
import { ImageElementView } from "./image-element-view";
import { StickerElementView } from "./sticker-element-view";

export function ElementView({ element }: { element: SceneElement }) {
  switch (element.type) {
    case "text":
      return <TextElementView element={element} />;
    case "image":
      return <ImageElementView element={element} />;
    case "sticker":
      return <StickerElementView element={element} />;
  }
}
