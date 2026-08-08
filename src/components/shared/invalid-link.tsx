import Link from "next/link";
import { HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

type InvalidLinkProps = {
  title: string;
  description: string;
};

export function InvalidLink({ title, description }: InvalidLinkProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-5">
      <EmptyState
        icon={<HeartCrack className="size-8" />}
        title={title}
        description={description}
        action={
          <Button className="mt-2 rounded-full" nativeButton={false} render={<Link href="/">Go home</Link>} />
        }
      />
    </div>
  );
}
