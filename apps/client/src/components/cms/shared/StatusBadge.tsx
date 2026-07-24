"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type {
  DealCaseStatus,
  ListingStatus,
  PaymentStatus,
  ProposalReviewStatus,
  ProposalStatus,
} from "@/types/enums";

const statusBadgeVariants = cva(
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

export type BadgeTone = NonNullable<
  VariantProps<typeof statusBadgeVariants>["tone"]
>;

export const listingStatusBadgeToneMap: Record<ListingStatus, BadgeTone> = {
  DRAFT: "muted",
  PENDING: "warning",
  PUBLISHED: "success",
  REJECTED: "danger",
  ARCHIVED: "neutral",
};

export const dealCaseStatusBadgeToneMap: Record<DealCaseStatus, BadgeTone> = {
  NEW: "info",
  CONTACTED: "warning",
  QUALIFIED: "success",
  REJECTED: "danger",
};

export const paymentStatusBadgeToneMap: Record<PaymentStatus, BadgeTone> = {
  PENDING: "warning",
  SUCCESS: "success",
  FAILED: "danger",
  CANCELED: "danger",
};

export const proposalStatusBadgeToneMap: Record<ProposalStatus, BadgeTone> = {
  SUGGESTED: "warning",
  QUALIFIED: "info",
  NEGOTIATING: "purple",
  DEAL_WON: "success",
  DEAL_LOST: "danger",
  CANCELLED_AUTO: "muted",
};

export const proposalReviewStatusBadgeToneMap: Record<
  ProposalReviewStatus,
  BadgeTone
> = {
  PENDING: "warning",
  APPROVED: "info",
  REJECTED: "danger",
};

export default function StatusBadge({
  tone,
  children,
  className,
}: {
  tone: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(statusBadgeVariants({ tone }), className)}>
      {children}
    </span>
  );
}
