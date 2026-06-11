"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type {
  LeadStatus,
  PaymentStatus,
  PublishStatus,
} from "@/types/enums";

const adminStatusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
  {
    variants: {
      tone: {
        muted: "border-hairline bg-subtle text-secondary",
        info: "border-blue-200 bg-blue-50 text-blue-700",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        danger: "border-red-200 bg-red-50 text-red-700",
        neutral: "border-zinc-200 bg-zinc-50 text-zinc-600",
        purple: "border-purple-200 bg-purple-50 text-purple-700",
      },
    },
    defaultVariants: {
      tone: "muted",
    },
  },
);

export type AdminBadgeTone = NonNullable<
  VariantProps<typeof adminStatusBadgeVariants>["tone"]
>;

export const publishStatusBadgeToneMap: Record<PublishStatus, AdminBadgeTone> =
  {
    DRAFT: "muted",
    PUBLISHED: "success",
    ARCHIVED: "neutral",
  };

export const leadStatusBadgeToneMap: Record<LeadStatus, AdminBadgeTone> = {
  NEW: "info",
  CONTACTED: "warning",
  QUALIFIED: "success",
  REJECTED: "danger",
};

export const paymentStatusBadgeToneMap: Record<
  PaymentStatus,
  AdminBadgeTone
> = {
  PENDING: "warning",
  SUCCESS: "success",
  FAILED: "danger",
  CANCELED: "danger",
};

export default function AdminStatusBadge({
  tone,
  children,
  className,
}: {
  tone: AdminBadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(adminStatusBadgeVariants({ tone }), className)}>
      {children}
    </span>
  );
}
