"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Loader2, Play, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { GIFT_BOX_LIMITS } from "@/types/gifts";
import { useGiftBoxEditor } from "./use-gift-box-editor";
import { GiftBoxReveal } from "./gift-box-reveal";
import type { GiftBoxData } from "@/types/gifts";

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

export function GiftBoxEditor({ box, isSignedIn }: { box: GiftBoxData; isSignedIn: boolean }) {
  const editor = useGiftBoxEditor(box);
  const share = useGatedShare(isSignedIn);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-6 sm:py-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Back to gifts" nativeButton={false} render={<Link href="/gifts" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <Input
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          maxLength={GIFT_BOX_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="Untitled Gift"
          className="ml-1 h-9 max-w-[220px] border-none bg-transparent px-2 font-medium shadow-none focus-visible:ring-0"
        />
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={() => setShowPreview(true)}>
            <Play className="size-3.5" />
            Preview
          </Button>
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
        <span className="text-3xl">🎁</span>
        <p className="text-muted-foreground text-caption">What&apos;s hidden inside the box?</p>
      </div>

      <div className="bg-card shadow-soft flex flex-col gap-4 rounded-xl p-6">
        <div className="flex flex-col items-center gap-2">
          <Label className="text-muted-foreground self-start text-xs">Photo (optional)</Label>
          {editor.photoUrl ? (
            <div className="group relative aspect-square w-full overflow-hidden rounded-lg">
              <Image src={editor.photoUrl} alt="" fill unoptimized className="object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => editor.setPhotoUrl(null)}
                className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100"
              >
                <X className="size-5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => requestPhoto(editor.uploadPhoto)}
              disabled={editor.isUploading}
              className="bg-secondary hover:bg-secondary/70 flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg transition-colors"
            >
              {editor.isUploading ? (
                <Loader2 className="text-muted-foreground size-5 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="text-muted-foreground size-6" />
                  <span className="text-muted-foreground text-caption">Add a photo</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-muted-foreground text-xs">Message</Label>
          <Textarea
            value={editor.message}
            onChange={(e) => editor.setMessage(e.target.value)}
            placeholder="What do you want them to find inside?"
            maxLength={GIFT_BOX_LIMITS.MESSAGE_MAX_LENGTH}
            className="min-h-24"
          />
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="flex flex-col items-center border-none bg-transparent p-0 shadow-none sm:max-w-xs" showCloseButton>
          <DialogTitle className="sr-only">Gift box preview</DialogTitle>
          {showPreview ? (
            <GiftBoxReveal title={editor.title} message={editor.message} photoUrl={editor.photoUrl} />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this gift</DialogTitle>
            <DialogDescription>Anyone with the link can open it. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks publicPath={`/gifts/gift-box/${editor.box.id}`} editPath={`/gifts/gift-box/edit/${editor.box.editToken}`} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
