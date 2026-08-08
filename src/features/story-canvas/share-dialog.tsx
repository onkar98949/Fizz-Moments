"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";

type ShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publicPath: string;
  editPath: string;
};

export function ShareDialog({ open, onOpenChange, publicPath, editPath }: ShareDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Share this story</DialogTitle>
          <DialogDescription>Anyone with the link can view it. Only you have the edit link.</DialogDescription>
        </DialogHeader>
        <ShareLinks publicPath={publicPath} editPath={editPath} />
      </DialogContent>
    </Dialog>
  );
}
