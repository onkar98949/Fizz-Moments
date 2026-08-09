"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Clapperboard, Image as ImageIcon, Music, Palette, Play, Redo2, Timer, Type, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { SCENE_LIMITS } from "@/constants/template";
import { cn } from "@/lib/utils";
import type { TemplateProjectData } from "@/types/template";
import { useTemplateEditor } from "./use-template-editor";
import { Canvas } from "./canvas";
import { SceneStrip } from "./panels/scene-strip";
import { ContentPanel } from "./panels/content-panel";
import { PhotosPanel } from "./panels/photos-panel";
import { ThemePanel } from "./panels/theme-panel";
import { MusicPanel } from "./panels/music-panel";
import { PlayPreviewDialog } from "./play-preview-dialog";

const TABS = [
  { id: "content", label: "Content", icon: Type },
  { id: "photos", label: "Photos", icon: ImageIcon },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "music", label: "Music", icon: Music },
] as const;

type Tab = (typeof TABS)[number]["id"];

export function TemplateEditor({ project, isSignedIn }: { project: TemplateProjectData; isSignedIn: boolean }) {
  const editor = useTemplateEditor(project);
  const [tab, setTab] = useState<Tab>("content");
  const share = useGatedShare(isSignedIn, editor.save);
  const [showPlay, setShowPlay] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;
      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        editor.undo();
      } else if (e.key.toLowerCase() === "z" && e.shiftKey) {
        e.preventDefault();
        editor.redo();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

  // The panel should always be relevant to whatever was just clicked.
  useEffect(() => {
    const type = editor.selectedElement?.type;
    if (type === "image") setTab("photos");
    else if (type === "text" || type === "sticker") setTab("content");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.selectedElementId]);

  const photoCount = editor.scenes.reduce((sum, s) => sum + s.elements.filter((el) => el.type === "image").length, 0);
  const totalSeconds = Math.round(editor.scenes.reduce((sum, s) => sum + s.durationMs, 0) / 1000);
  const liveProject: TemplateProjectData = { ...editor.project, title: editor.title, music: editor.music, scenes: editor.scenes };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Back to templates" nativeButton={false} className="rounded-full" render={<Link href="/templates" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <Input
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          maxLength={SCENE_LIMITS.PROJECT_TITLE_MAX_LENGTH}
          className="ml-1 h-9 max-w-[200px] border-none bg-transparent px-2 font-medium shadow-none focus-visible:ring-0"
          placeholder="Untitled"
        />
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="icon-sm" variant="outline" onClick={editor.undo} disabled={!editor.canUndo} aria-label="Undo" className="rounded-full">
            <Undo2 className="size-4" />
          </Button>
          <Button size="icon-sm" variant="outline" onClick={editor.redo} disabled={!editor.canRedo} aria-label="Redo" className="rounded-full">
            <Redo2 className="size-4" />
          </Button>
          <Button size="icon-sm" variant="outline" onClick={() => setShowPlay(true)} aria-label="Play preview" className="rounded-full">
            <Play className="size-4" />
          </Button>
          <Button size="sm" variant="outline" className="rounded-full" onClick={share.requestShare} disabled={share.isPreparing}>
            Share
          </Button>
          <Button size="sm" onClick={editor.save} disabled={editor.isSaving} className="rounded-full">
            {editor.isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="bg-secondary text-muted-foreground flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
          <Clapperboard className="size-3" />
          {editor.scenes.length} Scene{editor.scenes.length === 1 ? "" : "s"}
        </span>
        <span className="bg-secondary text-muted-foreground flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
          <Timer className="size-3" />
          {totalSeconds} sec
        </span>
        <span className="bg-secondary text-muted-foreground flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
          <Camera className="size-3" />
          {photoCount} Photo{photoCount === 1 ? "" : "s"}
        </span>
        {editor.music ? (
          <span className="bg-secondary text-muted-foreground flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
            <Music className="size-3" />1 Music Track
          </span>
        ) : null}
      </div>

      <SceneStrip {...editor} />

      <div className="flex flex-col items-center gap-4">
        {editor.activeScene ? (
          <Canvas
            scene={editor.activeScene}
            selectedElementId={editor.selectedElementId}
            onSelectElement={editor.setSelectedElementId}
            onCommitElement={editor.commitElementBox}
            onRequestReplaceImage={(id) => {
              const inputEl = document.createElement("input");
              inputEl.type = "file";
              inputEl.accept = "image/*";
              inputEl.onchange = () => {
                const file = inputEl.files?.[0];
                if (file) editor.replaceImage(id, file);
              };
              inputEl.click();
            }}
          />
        ) : null}
      </div>

      <motion.div layout className="border-border bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-soft">
        <div className="flex gap-1.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs transition-colors",
                tab === id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary/60",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "content" && <ContentPanel {...editor} />}
        {tab === "photos" && <PhotosPanel {...editor} />}
        {tab === "theme" && <ThemePanel {...editor} />}
        {tab === "music" && <MusicPanel {...editor} />}
      </motion.div>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Share this project</DialogTitle>
            <DialogDescription>Anyone with the link can view it. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks publicPath={`/templates/story/${editor.project.id}`} editPath={`/templates/edit/${editor.project.editToken}`} />
        </DialogContent>
      </Dialog>

      <PlayPreviewDialog open={showPlay} onOpenChange={setShowPlay} project={liveProject} />
    </div>
  );
}
