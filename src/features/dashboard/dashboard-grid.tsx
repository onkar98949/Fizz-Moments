import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DashboardItem } from "@/types/dashboard";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}

export function DashboardGrid({ items }: { items: DashboardItem[] }) {
  if (items.length === 0) {
    return (
      <div className="border-border bg-card flex flex-col items-center gap-4 rounded-2xl border p-12 text-center">
        <span className="border-border bg-background flex size-12 items-center justify-center rounded-full border">
          <Sparkles className="text-primary-active size-5" strokeWidth={1.5} />
        </span>
        <p className="font-display text-card-title">Nothing here yet.</p>
        <p className="text-muted-foreground text-body-lg max-w-sm">
          Everything you create — stories, templates, and gifts — will show up here once you&apos;re signed in while
          you make it.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button nativeButton={false} render={<Link href="/create">Start a Story</Link>} />
          <Button variant="outline" nativeButton={false} render={<Link href="/gifts">Explore Gifts</Link>} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={`${item.kind}-${item.id}`}
          className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-6"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="bg-secondary text-muted-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
              <span>{item.emoji}</span>
              {item.label}
            </span>
            <span className="text-muted-foreground shrink-0 text-xs">{formatDate(item.updatedAt)}</span>
          </div>

          <p className="font-display text-card-title truncate">{item.title || "Untitled"}</p>

          <div className="mt-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              nativeButton={false}
              render={<Link href={item.editHref}>Edit</Link>}
            />
            <Button
              size="sm"
              className="flex-1"
              nativeButton={false}
              render={
                <Link href={item.viewHref}>
                  View
                  <ArrowRight className="size-3.5" />
                </Link>
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
