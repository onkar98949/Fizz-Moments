"use client";

import { useState } from "react";
import { Check, Copy, Link2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

type ShareLinksProps = {
  publicPath: string;
  editPath: string;
};

function CopyRow({ label, icon, path }: { label: string; icon: React.ReactNode; path: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="bg-secondary/40 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-primary">{icon}</span>
        <div className="flex flex-col">
          <span className="font-medium">{label}</span>
          <span className="text-muted-foreground max-w-[220px] truncate text-xs">{path}</span>
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={copy} className="shrink-0 rounded-full">
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

/** Reusable copy-to-clipboard pair for the public share link and the
 *  private edit link — used by both Story Experience and Templates. */
export function ShareLinks({ publicPath, editPath }: ShareLinksProps) {
  return (
    <div className="flex flex-col gap-2">
      <CopyRow label="Share with them" icon={<Link2 className="size-4" />} path={publicPath} />
      <CopyRow label="Your private edit link" icon={<Lock className="size-4" />} path={editPath} />
    </div>
  );
}
