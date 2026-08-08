"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TemplatePlayer } from "@/components/shared/template-player";
import type { TemplateProjectData } from "@/types/template";

type PlayPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: TemplateProjectData;
};

/** Reuses the exact player the public link renders — "Play" in the editor
 *  should show precisely what a recipient will see, transitions and all,
 *  not a second, slightly-different preview implementation. */
export function PlayPreviewDialog({ open, onOpenChange, project }: PlayPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center border-none bg-transparent p-0 shadow-none sm:max-w-xs" showCloseButton>
        <DialogTitle className="sr-only">Story preview</DialogTitle>
        {open ? <TemplatePlayer project={project} className="max-w-full" /> : null}
      </DialogContent>
    </Dialog>
  );
}
