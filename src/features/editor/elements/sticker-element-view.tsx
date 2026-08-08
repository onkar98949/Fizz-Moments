import type { StickerElement } from "@/types/template";

export function StickerElementView({ element }: { element: StickerElement }) {
  // The element's own width (a % of the canvas) doubles as the emoji's
  // font-size in container-query width units — a close-enough approximation
  // since emoji glyphs render roughly square.
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ fontSize: `${element.width * 0.9}cqw` }}>
      <span className="leading-none">{element.emoji}</span>
    </div>
  );
}
