"use client";

import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { StoryCanvas } from "./use-story-canvas";
import { SceneRow } from "./scene-row";

export function SceneList({
  scenes,
  setSelectedSceneId,
  setIsPreviewOpen,
  duplicateScene,
  deleteScene,
  reorderScene,
  moveSceneToIndex,
  setIsLibraryOpen,
}: StoryCanvas) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  function handleDragPointerDown(id: string) {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDraggingId(id);
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingId) return;
    const orderedIds = scenes.map((s) => s.id);
    let targetIndex = orderedIds.indexOf(draggingId);

    orderedIds.forEach((id, index) => {
      const el = rowRefs.current.get(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      if (e.clientY > midpoint) targetIndex = index;
    });

    moveSceneToIndex(draggingId, targetIndex);
  }

  function handlePointerUp() {
    setDraggingId(null);
  }

  return (
    <div className="flex flex-col gap-3" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      {scenes.map((scene, index) => (
        <div key={scene.id} ref={(el) => void (el ? rowRefs.current.set(scene.id, el) : rowRefs.current.delete(scene.id))}>
          <SceneRow
            scene={scene}
            index={index}
            total={scenes.length}
            isDragging={draggingId === scene.id}
            onSelect={() => setSelectedSceneId(scene.id)}
            onPreview={() => setIsPreviewOpen(true)}
            onDuplicate={() => duplicateScene(scene.id)}
            onDelete={() => deleteScene(scene.id)}
            onMoveUp={() => reorderScene(scene.id, -1)}
            onMoveDown={() => reorderScene(scene.id, 1)}
            onDragPointerDown={handleDragPointerDown(scene.id)}
          />
        </div>
      ))}

      <motion.button
        type="button"
        onClick={() => setIsLibraryOpen(true)}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        className="border-primary/30 from-accent/50 to-secondary/40 hover:border-primary/60 group flex flex-col items-center gap-1.5 rounded-2xl border-2 border-dashed bg-gradient-to-b py-7 text-center shadow-soft transition-colors"
      >
        <span className="bg-moment-gradient flex size-11 items-center justify-center rounded-full text-white shadow-soft transition-transform group-hover:scale-110">
          <Sparkles className="size-5" />
        </span>
        <span className="font-display text-lg">Add Scene</span>
        <span className="text-muted-foreground text-xs">Browse 30 animated scenes</span>
      </motion.button>
    </div>
  );
}
