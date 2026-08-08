import Image from "next/image";
import type { ImageElement } from "@/types/template";

export function ImageElementView({ element }: { element: ImageElement }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-sm">
      <Image src={element.src} alt="" fill sizes="400px" className="object-cover" unoptimized />
    </div>
  );
}
