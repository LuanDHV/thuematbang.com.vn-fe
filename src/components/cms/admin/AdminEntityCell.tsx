"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminEntityCellProps = {
  imageUrl?: string | null;
  title: string;
  slug?: string;
  imageAlt?: string;
  className?: string;
};

export default function AdminEntityCell({
  imageUrl,
  title,
  slug,
  imageAlt,
  className,
}: AdminEntityCellProps) {
  return (
    <div className={cn("flex min-w-[18rem] items-center gap-3", className)}>
      <div className="border-hairline bg-subtle relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            sizes="48px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <ImageIcon className="text-muted size-4" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0">
        <p className="text-heading truncate text-sm font-semibold">{title}</p>
        {slug ? <p className="text-muted text-xs">{slug}</p> : null}
      </div>
    </div>
  );
}
