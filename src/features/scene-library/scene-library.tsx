"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SCENE_REGISTRY } from "@/scenes/registry";
import type { SceneCategory } from "@/scenes/types";
import { ScenePreviewCard } from "./scene-preview-card";

const CATEGORY_LABELS: Record<SceneCategory, string> = {
  structure: "Structure",
  memories: "Memories",
  emotional: "Emotional",
  travel: "Travel",
  moments: "Moments",
  music: "Music",
  modern: "Modern",
  "love-story": "Love Story",
};

type SceneLibraryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddScene: (sceneId: string) => void;
};

export function SceneLibrary({ open, onOpenChange, onAddScene }: SceneLibraryProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SceneCategory | null>(null);

  const categories = useMemo(() => {
    const set = new Set(SCENE_REGISTRY.map((s) => s.config.category));
    return Array.from(set);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SCENE_REGISTRY.filter((s) => {
      if (category && s.config.category !== category) return false;
      if (!q) return true;
      const haystack = [s.config.label, s.config.category, s.config.description, ...s.config.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category]);

  function handleAdd(sceneId: string) {
    onAddScene(sceneId);
    onOpenChange(false);
    setQuery("");
    setCategory(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Scene Library</DialogTitle>
          <DialogDescription>Choose an animated scene, then fill in your own content.</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scenes — try “travel” or “letter”"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Button
            type="button"
            size="sm"
            variant={category === null ? "default" : "secondary"}
            onClick={() => setCategory(null)}
            className="rounded-full"
          >
            All
          </Button>
          {categories.map((c) => (
            <Button
              key={c}
              type="button"
              size="sm"
              variant={category === c ? "default" : "secondary"}
              onClick={() => setCategory(c)}
              className="rounded-full"
            >
              {CATEGORY_LABELS[c]}
            </Button>
          ))}
        </div>

        {/* Scroll/max-height live on this wrapper, not the grid itself — a
            grid with `overflow-y-auto` + `max-height` directly on it forces
            its own auto rows to shrink and fit inside that height instead of
            sizing to content and scrolling (confirmed via computed-style
            inspection: grid-template-rows was being clamped to divide the
            max-height evenly, cropping every card). */}
        <div className="max-h-[55vh] overflow-y-auto pt-1 pb-1">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {results.map((s) => (
              <ScenePreviewCard key={s.config.id} scene={s} onClick={() => handleAdd(s.config.id)} />
            ))}
            {results.length === 0 ? (
              <p className="text-muted-foreground col-span-full py-8 text-center text-sm">
                No scenes match “{query}” yet.
              </p>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
