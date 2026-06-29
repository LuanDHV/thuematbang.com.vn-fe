"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type {
  LeadStatus,
  PaymentStatus,
  ListingStatus,
} from "@/types/enums";

const adminStatusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
  {
    variants: {
      tone: {
        muted: "border-hairline bg-subtle text-secondary",
        info: "border-transparent bg-info-soft text-info",
        success: "border-transparent bg-success-soft text-success",
        warning: "border-transparent bg-warning-soft text-warning",
        danger: "border-transparent bg-danger-soft text-danger",
        neutral: "border-hairline-strong bg-surface-alt text-body",
        purple: "border-transparent bg-accent-soft text-admin-accent",
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

export const publishStatusBadgeToneMap: Record<ListingStatus, AdminBadgeTone> =
  {
    DRAFT: "muted",
    PENDING: "warning",
    PUBLISHED: "success",
    REJECTED: "danger",
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
