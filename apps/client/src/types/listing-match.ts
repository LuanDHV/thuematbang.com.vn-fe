import type { ListingMatchStatus } from "./enums";

export type ListingMatchApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ListingMatchOrigin = "USER_SUBMISSION" | "ADMIN_CREATED";

export interface ListingMatchSummary {
  id: number;
  status: ListingMatchStatus;
  approvalStatus: ListingMatchApprovalStatus;
  origin: ListingMatchOrigin;
  approvalReviewedAt?: string | null;
  approvalNote?: string | null;
  property?: {
    id: number;
    title: string;
    slug: string;
    displayCode?: string;
    contactName: string;
    contactPhone: string;
    isMatched: boolean;
  } | null;
  rentRequest?: {
    id: number;
    title: string;
    slug: string;
    displayCode?: string;
    contactName: string;
    contactPhone: string;
    isMatched: boolean;
  } | null;
  matchedAt?: string | null;
  createdAt: string;
}
