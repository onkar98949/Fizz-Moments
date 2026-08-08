import { REFERENCE_CANVAS_WIDTH } from "@/constants/template";
import type { TextElement } from "@/types/template";
import { cn } from "@/lib/utils";

const FONT_CLASS: Record<TextElement["fontFamily"], string> = {
  display: "font-display",
  body: "font-sans",
  script: "font-script",
};

export function TextElementView({ element }: { element: TextElement }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center overflow-hidden leading-tight whitespace-pre-wrap",
        FONT_CLASS[element.fontFamily],
        element.align === "center" && "justify-center text-center",
        element.align === "left" && "justify-start text-left",
        element.align === "right" && "justify-end text-right",
      )}
      style={{
        fontSize: `${(element.fontSize / REFERENCE_CANVAS_WIDTH) * 100}cqw`,
        color: element.color,
      }}
    >
      <span>{element.content}</span>
    </div>
  );
}
