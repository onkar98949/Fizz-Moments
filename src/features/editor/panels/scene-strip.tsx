"use client";

import { ArrowLeft, ArrowRight, Copy, Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SCENE_LIMITS } from "@/constants/template";
import { cn } from "@/lib/utils";
import { ElementView } from "../elements/element-view";
import type { Scene } from "@/types/template";
import type { TemplateEditor } from "../use-template-editor";

function sceneBackgroundStyle(scene: Scene) {
  if (scene.background.type === "gradient") return { backgroundImage: scene.background.value };
  if (scene.background.type === "image")
    return { backgroundImage: `url(${scene.background.value})`, backgroundSize: "cover", backgroundPosition: "center" };
  return { backgroundColor: scene.background.value };
}

function inferSceneName(scene: Scene, index: number): string {
  const text = scene.elements.find((el) => el.type === "text" && el.content.trim());
  if (text && text.type === "text") {
    const trimmed = text.content.trim();
    return trimmed.length > 16 ? `${trimmed.slice(0, 16)}…` : trimmed;
  }
  return `Scene ${index + 1}`;
}

function MiniScene({ scene }: { scene: Scene }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={sceneBackgroundStyle(scene)}>
      {scene.elements.map((element) => (
        <div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.width}%`,
            height: `${element.height}%`,
            transform: `rotate(${element.rotation}deg)`,
          }}
        >
          <ElementView element={element} />
        </div>
      ))}
    </div>
  );
}

export function SceneStrip({
  scenes,
  activeSceneIndex,
  activeScene,
  setActiveSceneIndex,
  setSelectedElementId,
  addScene,
  duplicateScene,
  deleteScene,
  reorderScene,
  setSceneDuration,
}: TemplateEditor) {
  function adjustDuration(deltaMs: number) {
    if (!activeScene) return;
    const next = Math.max(SCENE_LIMITS.MIN_DURATION_MS, Math.min(SCENE_LIMITS.MAX_DURATION_MS, activeScene.durationMs + deltaMs));
    setSceneDuration(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-2.5 overflow-x-auto pb-1">
        {scenes.map((scene, index) => (
          <motion.button
            key={scene.id}
            type="button"
            layout
            onClick={() => {
              setActiveSceneIndex(index);
              setSelectedElementId(null);
            }}
            whileHover={{ y: -2 }}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <div
              className={cn(
                "relative aspect-[9/16] w-14 overflow-hidden rounded-xl border-2 shadow-soft transition-colors sm:w-16",
                index === activeSceneIndex ? "border-primary" : "border-border",
              )}
            >
              <MiniScene scene={scene} />
              <span className="absolute top-1 left-1 flex size-4 items-center justify-center rounded-full bg-black/55 text-[9px] text-white">
                {index + 1}
              </span>
              <span className="absolute right-1 bottom-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] text-white">
                {(scene.durationMs / 1000).toFixed(1)}s
              </span>
            </div>
            <span className={cn("max-w-16 truncate text-[11px]", index === activeSceneIndex ? "text-foreground font-medium" : "text-muted-foreground")}>
              {inferSceneName(scene, index)}
            </span>
          </motion.button>
        ))}
        <button
          type="button"
          onClick={addScene}
          disabled={scenes.length >= SCENE_LIMITS.MAX_SCENES}
          aria-label="Add scene"
          className="border-border hover:border-primary/40 mb-4 flex aspect-[9/16] w-14 shrink-0 items-center justify-center rounded-xl border-2 border-dashed disabled:opacity-40 sm:w-16"
        >
          <Plus className="size-5" />
        </button>
      </div>

      {activeScene ? (
        <div className="bg-secondary/40 flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5">
          <div className="flex items-center gap-1">
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Move scene earlier"
              disabled={activeSceneIndex === 0}
              onClick={() => reorderScene(activeScene.id, -1)}
              className="rounded-full bg-white"
            >
              <ArrowLeft className="size-3.5" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Move scene later"
              disabled={activeSceneIndex === scenes.length - 1}
              onClick={() => reorderScene(activeScene.id, 1)}
              className="rounded-full bg-white"
            >
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Decrease duration"
              disabled={activeScene.durationMs <= SCENE_LIMITS.MIN_DURATION_MS}
              onClick={() => adjustDuration(-500)}
              className="rounded-full bg-white"
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="text-foreground w-10 text-center text-sm font-medium tabular-nums">
              {(activeScene.durationMs / 1000).toFixed(1)}s
            </span>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Increase duration"
              disabled={activeScene.durationMs >= SCENE_LIMITS.MAX_DURATION_MS}
              onClick={() => adjustDuration(500)}
              className="rounded-full bg-white"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button size="icon-sm" variant="ghost" onClick={() => duplicateScene(activeScene.id)} aria-label="Duplicate scene" className="rounded-full bg-white">
              <Copy className="size-3.5" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => deleteScene(activeScene.id)}
              disabled={scenes.length <= SCENE_LIMITS.MIN_SCENES}
              aria-label="Delete scene"
              className="text-destructive rounded-full bg-white"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
