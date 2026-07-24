import type { ProposalReviewStatus, ProposalStatus } from "./enums";

export type ProposalSourceType = "USER_SUBMISSION" | "ADMIN_CREATED";

export interface ProposalSummary {
  id: number;
  dealCaseId: number;
  propertyId?: number | null;
  rentRequestId?: number | null;
  status: ProposalStatus;
  reviewStatus: ProposalReviewStatus;
  sourceType: ProposalSourceType;
  reviewedAt?: string | null;
  reviewNote?: string | null;
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
