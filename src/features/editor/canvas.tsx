"use client";

import { useRef, useState } from "react";
import type { Scene } from "@/types/template";
import { CanvasElement } from "./canvas-element";
import type { ElementBox } from "./canvas-math";
import { cn } from "@/lib/utils";

type CanvasProps = {
  scene: Scene;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onCommitElement: (id: string, patch: Partial<ElementBox>) => void;
  onRequestReplaceImage: (id: string) => void;
};

export function Canvas({ scene, selectedElementId, onSelectElement, onCommitElement, onRequestReplaceImage }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [snap, setSnap] = useState({ x: false, y: false });

  const backgroundStyle =
    scene.background.type === "image"
      ? { backgroundImage: `url(${scene.background.value})`, backgroundSize: "cover", backgroundPosition: "center" }
      : scene.background.type === "gradient"
        ? { backgroundImage: scene.background.value }
        : { backgroundColor: scene.background.value };

  return (
    <div
      ref={canvasRef}
      onPointerDown={() => onSelectElement(null)}
      className="shadow-soft-lg @container relative aspect-[9/16] w-full max-w-xs overflow-hidden rounded-[2rem]"
      style={backgroundStyle}
    >
      {scene.elements.map((element) => (
        <CanvasElement
          key={element.id}
          element={element}
          isSelected={selectedElementId === element.id}
          onSelect={() => onSelectElement(element.id)}
          onCommit={(patch) => onCommitElement(element.id, patch)}
          canvasRef={canvasRef}
          onSnapChange={setSnap}
          onRequestReplace={() => onRequestReplaceImage(element.id)}
        />
      ))}

      <div
        className={cn(
          "bg-primary pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 opacity-0 transition-opacity",
          snap.x && "opacity-70",
        )}
      />
      <div
        className={cn(
          "bg-primary pointer-events-none absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 opacity-0 transition-opacity",
          snap.y && "opacity-70",
        )}
      />
    </div>
  );
}
