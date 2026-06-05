"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const adminPriorityBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
  {
    variants: {
      tone: {
        free: "border-hairline bg-subtle text-secondary",
        standard: "border-blue-200 bg-blue-50 text-blue-700",
        premium: "border-purple-200 bg-purple-50 text-purple-700",
      },
    },
    defaultVariants: {
      tone: "free",
    },
  },
);

export type AdminPriorityTone = NonNullable<
  VariantProps<typeof adminPriorityBadgeVariants>["tone"]
>;

export default function AdminPriorityBadge({
  tone,
  children,
  className,
}: {
  tone: AdminPriorityTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(adminPriorityBadgeVariants({ tone }), className)}>
      {children}
    </span>
  );
}
