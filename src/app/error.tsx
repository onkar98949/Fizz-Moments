"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen w-full items-center justify-center bg-white px-5">
        <EmptyState
          icon={<HeartCrack className="size-8" />}
          title="Something didn't load quite right"
          description="Give it another try, or head back home — your story is safe."
          action={
            <div className="mt-2 flex gap-3">
              <Button variant="outline" className="rounded-full" onClick={reset}>
                Try again
              </Button>
              <Button className="rounded-full" nativeButton={false} render={<Link href="/">Go home</Link>} />
            </div>
          }
        />
      </body>
    </html>
  );
}
