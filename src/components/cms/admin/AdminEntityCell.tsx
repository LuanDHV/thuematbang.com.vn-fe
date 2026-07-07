"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminEntityCellProps = {
  imageUrl?: string | null;
  title: string;
  slug?: string;
  displayCode?: string;
  imageAlt?: string;
  className?: string;
};

export default function AdminEntityCell({
  imageUrl,
  title,
  slug,
  displayCode,
  imageAlt,
  className,
}: AdminEntityCellProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-[18rem] min-w-0 items-center gap-3 overflow-hidden sm:max-w-[20rem] lg:max-w-[24rem]",
        className,
      )}
    >
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

      <div className="min-w-0 flex-1 overflow-hidden">
        <p
          className="text-heading truncate overflow-hidden text-sm font-semibold"
          title={title}
        >
          {title}
        </p>
        {slug ? (
          <p
            className="text-muted truncate overflow-hidden text-xs"
            title={slug}
          >
            {slug}
          </p>
        ) : null}
        {displayCode ? (
          <p
            className="text-primary truncate overflow-hidden text-xs font-medium"
            title={displayCode}
          >
            {displayCode}
          </p>
        ) : null}
      </div>
    </div>
  );
}
