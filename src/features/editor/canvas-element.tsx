"use client";

import { useRef, useState, type RefObject } from "react";
import { RefreshCw, RotateCw } from "lucide-react";
import type { SceneElement } from "@/types/template";
import { ElementView } from "./elements/element-view";
import { angleFromCenter, boxCenter, clamp, normalizeAngle, resizeFromCorner, type ElementBox } from "./canvas-math";
import { cn } from "@/lib/utils";

const MIN_SIZE_PERCENT = 4;
const SNAP_THRESHOLD_PERCENT = 1.5;

type Handle = "nw" | "ne" | "sw" | "se";

type CanvasElementProps = {
  element: SceneElement;
  isSelected: boolean;
  onSelect: () => void;
  onCommit: (patch: Partial<ElementBox>) => void;
  canvasRef: RefObject<HTMLDivElement | null>;
  onSnapChange: (snap: { x: boolean; y: boolean }) => void;
  onRequestReplace: () => void;
};

export function CanvasElement({ element, isSelected, onSelect, onCommit, canvasRef, onSnapChange, onRequestReplace }: CanvasElementProps) {
  const [live, setLive] = useState<ElementBox | null>(null);
  const dragState = useRef<{
    kind: "move" | "resize" | "rotate";
    startClientX: number;
    startClientY: number;
    startBox: ElementBox;
    handle?: Handle;
    startAngle?: number;
  } | null>(null);

  const box = live ?? element;

  function toPercent(px: number, dimension: "width" | "height") {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return px;
    return (px / (dimension === "width" ? rect.width : rect.height)) * 100;
  }

  function toPx(percent: number, dimension: "width" | "height") {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return percent;
    return (percent / 100) * (dimension === "width" ? rect.width : rect.height);
  }

  function boxToPx(b: ElementBox): ElementBox {
    return {
      x: toPx(b.x, "width"),
      y: toPx(b.y, "height"),
      width: toPx(b.width, "width"),
      height: toPx(b.height, "height"),
      rotation: b.rotation,
    };
  }

  function boxToPercent(b: ElementBox): ElementBox {
    return {
      x: toPercent(b.x, "width"),
      y: toPercent(b.y, "height"),
      width: toPercent(b.width, "width"),
      height: toPercent(b.height, "height"),
      rotation: b.rotation,
    };
  }

  function startMove(e: React.PointerEvent) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.stopPropagation();
    onSelect();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { kind: "move", startClientX: e.clientX, startClientY: e.clientY, startBox: box };
  }

  function startResize(handle: Handle) {
    return (e: React.PointerEvent) => {
      e.stopPropagation();
      onSelect();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragState.current = { kind: "resize", startClientX: e.clientX, startClientY: e.clientY, startBox: box, handle };
    };
  }

  function startRotate(e: React.PointerEvent) {
    e.stopPropagation();
    onSelect();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const rect = canvasRef.current?.getBoundingClientRect();
    const centerPercent = boxCenter(box);
    const centerPx = rect
      ? { x: rect.left + toPx(centerPercent.x, "width"), y: rect.top + toPx(centerPercent.y, "height") }
      : { x: e.clientX, y: e.clientY };
    const startAngle = angleFromCenter(centerPx, { x: e.clientX, y: e.clientY }) - box.rotation;
    dragState.current = { kind: "rotate", startClientX: e.clientX, startClientY: e.clientY, startBox: box, startAngle };
  }

  function handlePointerMove(e: React.PointerEvent) {
    const drag = dragState.current;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!drag || !rect) return;

    if (drag.kind === "move") {
      const deltaXPercent = ((e.clientX - drag.startClientX) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - drag.startClientY) / rect.height) * 100;
      let nextX = clamp(drag.startBox.x + deltaXPercent, -30, 130 - drag.startBox.width);
      let nextY = clamp(drag.startBox.y + deltaYPercent, -30, 130 - drag.startBox.height);

      const center = boxCenter({ ...drag.startBox, x: nextX, y: nextY });
      const snapX = Math.abs(center.x - 50) < SNAP_THRESHOLD_PERCENT;
      const snapY = Math.abs(center.y - 50) < SNAP_THRESHOLD_PERCENT;
      if (snapX) nextX = 50 - drag.startBox.width / 2;
      if (snapY) nextY = 50 - drag.startBox.height / 2;
      onSnapChange({ x: snapX, y: snapY });

      setLive({ ...drag.startBox, x: nextX, y: nextY });
      return;
    }

    if (drag.kind === "resize" && drag.handle) {
      const startBoxPx = boxToPx(drag.startBox);
      const mousePx = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const resizedPx = resizeFromCorner(drag.handle, startBoxPx, mousePx, toPx(MIN_SIZE_PERCENT, "width"));
      setLive(boxToPercent(resizedPx));
      return;
    }

    if (drag.kind === "rotate" && drag.startAngle !== undefined) {
      const centerPercent = boxCenter(drag.startBox);
      const centerPx = { x: rect.left + toPx(centerPercent.x, "width"), y: rect.top + toPx(centerPercent.y, "height") };
      const currentAngle = angleFromCenter(centerPx, { x: e.clientX, y: e.clientY });
      const rotation = normalizeAngle(currentAngle - drag.startAngle);
      setLive({ ...drag.startBox, rotation });
    }
  }

  function handlePointerUp() {
    if (dragState.current && live) {
      onCommit(live);
    }
    dragState.current = null;
    setLive(null);
    onSnapChange({ x: false, y: false });
  }

  return (
    <div
      onPointerDown={startMove}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn("absolute touch-none select-none", isSelected && "z-20")}
      style={{
        left: `${box.x}%`,
        top: `${box.y}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
        transform: `rotate(${box.rotation}deg)`,
      }}
    >
      <div
        className={cn(
          "h-full w-full",
          isSelected && "outline-primary outline-2 outline-offset-4",
        )}
      >
        <ElementView element={{ ...element, ...box } as SceneElement} />
      </div>

      {isSelected ? (
        <>
          {(["nw", "ne", "sw", "se"] as const).map((handle) => (
            <div
              key={handle}
              onPointerDown={startResize(handle)}
              className={cn(
                "bg-card border-primary absolute size-5 touch-none rounded-full border-2 shadow-sm",
                handle === "nw" && "top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
                handle === "ne" && "top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize",
                handle === "sw" && "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
                handle === "se" && "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
              )}
            />
          ))}
          <div
            onPointerDown={startRotate}
            className="bg-card border-primary absolute top-0 left-1/2 flex size-6 -translate-x-1/2 -translate-y-10 touch-none items-center justify-center rounded-full border-2 shadow-sm"
          >
            <RotateCw className="text-primary size-3" />
          </div>
          {element.type === "image" ? (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onRequestReplace();
              }}
              className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
            >
              <RefreshCw className="size-3" />
              Replace
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
