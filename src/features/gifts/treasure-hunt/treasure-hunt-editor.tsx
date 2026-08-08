"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, KeyRound, Loader2, Plus, Share2, Sparkles, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { TREASURE_HUNT_LIMITS } from "@/types/gifts";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useTreasureHuntEditor } from "./use-treasure-hunt-editor";
import type { TreasureHuntData } from "@/types/gifts";

function requestPhoto(onFile: (file: File) => void) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) onFile(file);
  };
  input.click();
}

function PhotoSlot({
  photoUrl,
  isUploading,
  onPick,
  onRemove,
}: {
  photoUrl: string | null;
  isUploading: boolean;
  onPick: () => void;
  onRemove: () => void;
}) {
  if (photoUrl) {
    return (
      <div className="group relative size-16 shrink-0 overflow-hidden rounded-lg">
        <Image src={photoUrl} alt="" fill unoptimized className="object-cover" />
        <button
          type="button"
          aria-label="Remove photo"
          onClick={onRemove}
          className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={isUploading}
      aria-label="Add photo"
      className="bg-secondary hover:bg-secondary/70 flex size-16 shrink-0 items-center justify-center rounded-lg transition-colors"
    >
      {isUploading ? (
        <Loader2 className="text-muted-foreground size-4 animate-spin" />
      ) : (
        <ImagePlus className="text-muted-foreground size-4" />
      )}
    </button>
  );
}

export function TreasureHuntEditor({ hunt, isSignedIn }: { hunt: TreasureHuntData; isSignedIn: boolean }) {
  const editor = useTreasureHuntEditor(hunt);
  const share = useGatedShare(isSignedIn);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-6 sm:py-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Back to gifts" nativeButton={false} render={<Link href="/gifts" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <Input
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          maxLength={TREASURE_HUNT_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="Untitled Hunt"
          className="ml-1 h-9 max-w-[220px] border-none bg-transparent px-2 font-medium shadow-none focus-visible:ring-0"
        />
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={share.requestShare}>
            <Share2 className="size-3.5" />
            Share
          </Button>
          <Button size="sm" onClick={editor.save} disabled={editor.isSaving}>
            {editor.isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-center">
        <span className="text-3xl">🗺️</span>
        <p className="text-muted-foreground text-caption">
          {editor.clues.length}/{TREASURE_HUNT_LIMITS.MAX_CLUES} clues · at least {TREASURE_HUNT_LIMITS.MIN_CLUES} needed
        </p>
      </div>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-4">
        {editor.clues.map((clue, index) => (
          <motion.div key={clue.id} layout variants={staggerItem} className="bg-card shadow-soft flex flex-col gap-3 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="bg-secondary text-muted-foreground flex size-6 items-center justify-center rounded-full text-xs font-medium">
                {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Move up" disabled={index === 0} onClick={() => editor.moveClue(clue.id, -1)}>
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move down"
                  disabled={index === editor.clues.length - 1}
                  onClick={() => editor.moveClue(clue.id, 1)}
                >
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove clue"
                  onClick={() => editor.removeClue(clue.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <PhotoSlot
                photoUrl={clue.photoUrl}
                isUploading={editor.uploadingId === clue.id}
                onPick={() => requestPhoto((file) => editor.uploadCluePhoto(clue.id, file))}
                onRemove={() => editor.updateClue(clue.id, { photoUrl: null })}
              />
              <Textarea
                value={clue.text}
                onChange={(e) => editor.updateClue(clue.id, { text: e.target.value })}
                placeholder="Write the clue (e.g. Look where we always keep the coffee.)"
                maxLength={TREASURE_HUNT_LIMITS.TEXT_MAX_LENGTH}
                className="min-h-16 flex-1 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground text-xs">Optional hint</Label>
                <Input
                  value={clue.hint ?? ""}
                  onChange={(e) => editor.updateClue(clue.id, { hint: e.target.value || null })}
                  placeholder="A nudge if they're stuck"
                  maxLength={TREASURE_HUNT_LIMITS.HINT_MAX_LENGTH}
                  className="h-9"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground flex items-center gap-1 text-xs">
                  <KeyRound className="size-3" />
                  Code to unlock next
                </Label>
                <Input
                  value={clue.code}
                  onChange={(e) => editor.updateClue(clue.id, { code: e.target.value })}
                  placeholder="e.g. coffee"
                  maxLength={TREASURE_HUNT_LIMITS.CODE_MAX_LENGTH}
                  className="h-9"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Button type="button" variant="outline" onClick={editor.addClue} disabled={editor.clues.length >= TREASURE_HUNT_LIMITS.MAX_CLUES} className="w-full">
        <Plus className="size-4" />
        Add Clue
      </Button>

      <div className="bg-card shadow-soft flex flex-col gap-3 rounded-xl p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary size-4" />
          <h2 className="font-medium">Final Reveal</h2>
        </div>
        <div className="flex gap-3">
          <PhotoSlot
            photoUrl={editor.finalPhotoUrl}
            isUploading={editor.uploadingId === "__final__"}
            onPick={() => requestPhoto((file) => editor.uploadFinalPhoto(file))}
            onRemove={() => editor.setFinalPhotoUrl(null)}
          />
          <Textarea
            value={editor.finalMessage}
            onChange={(e) => editor.setFinalMessage(e.target.value)}
            placeholder="What do they find at the end? (e.g. You found it. I love you.)"
            maxLength={TREASURE_HUNT_LIMITS.FINAL_MESSAGE_MAX_LENGTH}
            className="min-h-16 flex-1 text-sm"
          />
        </div>
      </div>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this hunt</DialogTitle>
            <DialogDescription>Anyone with the link can play it. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks publicPath={`/gifts/treasure-hunt/${editor.hunt.id}`} editPath={`/gifts/treasure-hunt/edit/${editor.hunt.editToken}`} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
