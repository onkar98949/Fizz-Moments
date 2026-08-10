"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Loader2, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { cn } from "@/lib/utils";
import { ENVELOPE_STYLES, SECRET_ENVELOPE_LIMITS } from "@/types/gifts";
import { EnvelopeReveal } from "./envelope-reveal";
import { useSecretEnvelopeEditor } from "./use-secret-envelope-editor";
import type { SecretEnvelopeData } from "@/types/gifts";

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

export function SecretEnvelopeEditor({ envelope, isSignedIn }: { envelope: SecretEnvelopeData; isSignedIn: boolean }) {
  const editor = useSecretEnvelopeEditor(envelope);
  const share = useGatedShare(isSignedIn, editor.save);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-6 sm:py-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Back to gifts" nativeButton={false} render={<Link href="/gifts" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <Input
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          maxLength={SECRET_ENVELOPE_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="Untitled Letter"
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
        <span className="text-3xl">💌</span>
        <p className="text-muted-foreground text-caption">A sealed letter, waiting to be opened.</p>
      </div>

      <div className="bg-card shadow-soft flex flex-col gap-5 rounded-xl p-6">
        <div className="flex flex-col gap-2.5">
          <Label>Envelope style</Label>
          <div className="flex flex-wrap gap-2">
            {ENVELOPE_STYLES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => editor.setStyle(s.value)}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                  editor.style === s.value
                    ? "border-primary/40 bg-accent text-primary-active"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="recipient-name">Recipient name</Label>
          <Input
            id="recipient-name"
            value={editor.recipientName}
            onChange={(e) => editor.setRecipientName(e.target.value)}
            maxLength={SECRET_ENVELOPE_LIMITS.RECIPIENT_NAME_MAX_LENGTH}
            placeholder="Emma"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="letter-title">Letter title</Label>
          <Input
            id="letter-title"
            value={editor.letterTitle}
            onChange={(e) => editor.setLetterTitle(e.target.value)}
            maxLength={SECRET_ENVELOPE_LIMITS.LETTER_TITLE_MAX_LENGTH}
            placeholder="A Letter For You"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="message">Your letter</Label>
          <Textarea
            id="message"
            value={editor.message}
            onChange={(e) => editor.setMessage(e.target.value)}
            maxLength={SECRET_ENVELOPE_LIMITS.MESSAGE_MAX_LENGTH}
            placeholder="Every moment with you feels like a page from my favorite story..."
            className="min-h-40"
          />
          <p className="text-muted-foreground text-meta">Start a new line for a new paragraph — each one reveals separately.</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sender-name">Sign it</Label>
          <Input
            id="sender-name"
            value={editor.senderName}
            onChange={(e) => editor.setSenderName(e.target.value)}
            maxLength={SECRET_ENVELOPE_LIMITS.SENDER_NAME_MAX_LENGTH}
            placeholder="Alex"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Photo (optional)</Label>
          {editor.photoUrl ? (
            <div className="group relative aspect-[4/3] w-full max-w-[200px] overflow-hidden rounded-lg">
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
              className="bg-secondary hover:bg-secondary/70 flex aspect-[4/3] w-full max-w-[200px] items-center justify-center rounded-lg transition-colors"
            >
              {editor.isUploading ? (
                <Loader2 className="text-muted-foreground size-5 animate-spin" />
              ) : (
                <ImagePlus className="text-muted-foreground size-5" />
              )}
            </button>
          )}
        </div>
      </div>

      <Button variant="outline" onClick={() => setShowPreview(true)} className="w-full">
        Preview the sealed envelope
      </Button>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="flex flex-col items-center sm:max-w-md">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <EnvelopeReveal
            style={editor.style}
            recipientName={editor.recipientName}
            letterTitle={editor.letterTitle}
            message={editor.message}
            senderName={editor.senderName}
            photoUrl={editor.photoUrl}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this letter</DialogTitle>
            <DialogDescription>Anyone with the link can open it. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks
            publicPath={`/gifts/secret-envelope/${editor.envelope.id}`}
            editPath={`/gifts/secret-envelope/edit/${editor.envelope.editToken}`}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
