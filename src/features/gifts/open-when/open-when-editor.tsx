"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ImagePlus, Loader2, Plus, Share2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { OPEN_WHEN_LIMITS } from "@/types/gifts";
import { useOpenWhenEditor } from "./use-open-when-editor";
import type { OpenWhenCollectionData } from "@/types/gifts";

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

export function OpenWhenEditor({ collection, isSignedIn }: { collection: OpenWhenCollectionData; isSignedIn: boolean }) {
  const editor = useOpenWhenEditor(collection);
  const share = useGatedShare(isSignedIn, editor.save);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-6 sm:py-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Back to gifts" nativeButton={false} render={<Link href="/gifts" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <Input
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          maxLength={OPEN_WHEN_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="Untitled Collection"
          className="ml-1 h-9 max-w-[220px] border-none bg-transparent px-2 font-medium shadow-none focus-visible:ring-0"
        />
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={share.requestShare} disabled={share.isPreparing}>
            <Share2 className="size-3.5" />
            Share
          </Button>
          <Button size="sm" onClick={editor.save} disabled={editor.isSaving}>
            {editor.isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-center">
        <span className="text-3xl">✉️</span>
        <p className="text-muted-foreground text-caption">
          {editor.letters.length}/{OPEN_WHEN_LIMITS.MAX_LETTERS} letters · at least {OPEN_WHEN_LIMITS.MIN_LETTERS} needed
        </p>
      </div>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-4">
        {editor.letters.map((letter, index) => (
          <motion.div key={letter.id} layout variants={staggerItem} className="bg-card shadow-soft flex flex-col gap-3 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="bg-secondary text-muted-foreground flex size-6 items-center justify-center rounded-full text-xs font-medium">
                {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove letter"
                onClick={() => editor.removeLetter(letter.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                value={letter.emoji}
                onChange={(e) => editor.updateLetter(letter.id, { emoji: e.target.value })}
                maxLength={8}
                placeholder="💌"
                className="h-10 w-16 text-center text-lg"
              />
              <div className="flex flex-1 items-center gap-1.5">
                <span className="text-muted-foreground shrink-0 text-sm font-medium">Open when...</span>
                <Input
                  value={letter.label}
                  onChange={(e) => editor.updateLetter(letter.id, { label: e.target.value })}
                  maxLength={OPEN_WHEN_LIMITS.LABEL_MAX_LENGTH}
                  placeholder="you miss me"
                  className="h-10 flex-1"
                />
              </div>
            </div>

            <Textarea
              value={letter.message}
              onChange={(e) => editor.updateLetter(letter.id, { message: e.target.value })}
              placeholder="I know I'm not there right now, but..."
              maxLength={OPEN_WHEN_LIMITS.MESSAGE_MAX_LENGTH}
              className="min-h-24 text-sm"
            />

            <div className="flex items-center gap-3">
              {letter.photoUrl ? (
                <div className="group relative size-16 shrink-0 overflow-hidden rounded-lg">
                  <Image src={letter.photoUrl} alt="" fill unoptimized className="object-cover" />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => editor.updateLetter(letter.id, { photoUrl: null })}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => requestPhoto((file) => editor.uploadLetterPhoto(letter.id, file))}
                  disabled={editor.uploadingId === letter.id}
                  aria-label="Add photo"
                  className="bg-secondary hover:bg-secondary/70 flex size-16 shrink-0 items-center justify-center rounded-lg transition-colors"
                >
                  {editor.uploadingId === letter.id ? (
                    <Loader2 className="text-muted-foreground size-4 animate-spin" />
                  ) : (
                    <ImagePlus className="text-muted-foreground size-4" />
                  )}
                </button>
              )}
              <p className="text-muted-foreground text-meta">Optional photo</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Button
        type="button"
        variant="outline"
        onClick={editor.addLetter}
        disabled={editor.letters.length >= OPEN_WHEN_LIMITS.MAX_LETTERS}
        className="w-full"
      >
        <Plus className="size-4" />
        Add Letter
      </Button>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this collection</DialogTitle>
            <DialogDescription>Anyone with the link can open these letters. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks
            publicPath={`/gifts/open-when/${editor.collection.id}`}
            editPath={`/gifts/open-when/edit/${editor.collection.editToken}`}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
