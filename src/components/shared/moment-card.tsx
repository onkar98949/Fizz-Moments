import Image from "next/image";
import { cn } from "@/lib/utils";

type MomentCardProps = {
  photoUrl: string;
  title: string;
  caption?: string | null;
  className?: string;
  priority?: boolean;
};

export function MomentCard({ photoUrl, title, caption, className, priority }: MomentCardProps) {
  return (
    <figure
      className={cn(
        "shadow-soft-lg relative flex aspect-[3/4] w-full max-w-sm flex-col overflow-hidden rounded-[2rem]",
        className,
      )}
    >
      <Image
        src={photoUrl}
        alt={title}
        fill
        priority={priority}
        sizes="(max-width: 640px) 90vw, 384px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <figcaption className="relative mt-auto flex flex-col gap-1 p-6 text-white">
        <span className="font-display text-2xl">{title}</span>
        {caption ? <span className="text-sm text-white/85">{caption}</span> : null}
      </figcaption>
    </figure>
  );
}
