"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export default function EmptyStateCard({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateCardProps) {
  return (
    <div
      className={cn(
        "surface-editorial border-hairline mt-6 flex min-h-36 items-center justify-center border border-dashed px-6 py-8 text-center",
        className,
      )}
    >
      <div className="flex max-w-2xl flex-col items-center gap-3">
        {icon ? (
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
            {icon}
          </div>
        ) : null}

        <div className="space-y-1">
          <p className="text-body text-base font-semibold">{title}</p>
          <p className="text-secondary text-sm">{description}</p>
        </div>

        {action ? <div className="pt-1">{action}</div> : null}
      </div>
    </div>
  );
}
