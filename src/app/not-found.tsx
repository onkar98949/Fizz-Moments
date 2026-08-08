import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-5">
      <EmptyState
        icon={<Sparkles className="size-8" />}
        title="We couldn't find that page"
        description="It might have been moved, or the link may be mistyped."
        action={
          <Button className="mt-2 rounded-full" nativeButton={false} render={<Link href="/">Go home</Link>} />
        }
      />
    </div>
  );
}
