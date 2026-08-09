"use client";

import { motion } from "framer-motion";
import { StoryPlayer } from "@/components/shared/story-player";
import { useGatedShare } from "@/features/auth/use-gated-share";
import type { StoryData } from "@/types/story";
import { useStoryCanvas } from "./use-story-canvas";
import { SceneList } from "./scene-list";
import { SceneEditorDialog } from "./scene-editor-dialog";
import { SceneLibrary } from "@/features/scene-library/scene-library";
import { EditorHeader } from "./editor-header";
import { StorySettings } from "./story-settings";
import { ShareDialog } from "./share-dialog";

export function StoryCanvas({ story: initialStory, isSignedIn }: { story: StoryData; isSignedIn: boolean }) {
  const canvas = useStoryCanvas(initialStory);
  const share = useGatedShare(isSignedIn, canvas.save);

  return (
    <div className="flex min-h-screen flex-col">
      <EditorHeader canvas={canvas} onShare={share.requestShare} shareDisabled={share.isPreparing} />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7 px-5 py-8 sm:gap-9 sm:py-10">
        {canvas.isPreviewOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="flex justify-center"
          >
            <StoryPlayer story={canvas.liveStory} />
          </motion.div>
        ) : null}

        <StorySettings canvas={canvas} />

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Scenes</h2>
            <span className="text-muted-foreground text-xs">{canvas.scenes.length} total</span>
          </div>
          <SceneList {...canvas} />
        </div>
      </div>

      <SceneLibrary open={canvas.isLibraryOpen} onOpenChange={canvas.setIsLibraryOpen} onAddScene={canvas.addScene} />
      <SceneEditorDialog {...canvas} />
      <ShareDialog
        open={share.open}
        onOpenChange={share.setOpen}
        publicPath={`/story/${canvas.story.id}`}
        editPath={`/edit/${canvas.story.editToken}`}
      />
    </div>
  );
}
