"use client";

import { Copy, Timer, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSceneDefinition } from "@/scenes/registry";
import { getSceneDurationMs } from "@/scenes/schema";
import type { StoryCanvas } from "./use-story-canvas";

export function SceneEditorDialog({
  selectedScene,
  selectedSceneId,
  setSelectedSceneId,
  updateSceneData,
  duplicateScene,
  deleteScene,
}: StoryCanvas) {
  const definition = selectedScene ? getSceneDefinition(selectedScene.scene) : undefined;

  function handleDelete() {
    if (!selectedScene) return;
    deleteScene(selectedScene.id);
  }

  function handleDuplicate() {
    if (!selectedScene) return;
    duplicateScene(selectedScene.id);
    setSelectedSceneId(null);
  }

  return (
    <Dialog open={Boolean(selectedSceneId)} onOpenChange={(open) => !open && setSelectedSceneId(null)}>
      <DialogContent className="sm:max-w-md">
        {selectedScene && definition ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-2 pr-6">
                <DialogTitle className="font-display flex items-center gap-1.5 text-xl">
                  {definition.config.emoji} {definition.config.label}
                </DialogTitle>
                <Badge variant="secondary" className="shrink-0 gap-1">
                  <Timer className="size-3" />
                  {Math.round(getSceneDurationMs(selectedScene) / 1000)} sec
                </Badge>
              </div>
            </DialogHeader>

            <div className="max-h-[55vh] overflow-y-auto pr-1">
              <definition.Builder
                data={selectedScene.data}
                onChange={(data) => updateSceneData(selectedScene.id, data)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setSelectedSceneId(null)} className="flex-1 rounded-full">
                Done
              </Button>
              <Button type="button" variant="outline" size="icon" aria-label="Duplicate scene" onClick={handleDuplicate} className="rounded-full">
                <Copy className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Delete scene"
                onClick={handleDelete}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
