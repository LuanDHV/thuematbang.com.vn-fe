import type { DealCaseStatus } from "./enums";
import type { ProposalSummary } from "./proposal";
import { Property } from "./property";
import { RentRequest } from "./rent-request";
import { User } from "./user";

export type DealCaseSourceFilter = "PROPERTY" | "RENT_REQUEST";

export interface DealCase {
  id: number;
  userId?: number | null;
  propertyId?: number | null;
  rentRequestId?: number | null;
  fullName: string;
  phone: string;
  status: DealCaseStatus;
  source: DealCaseSourceFilter;
  note?: string | null;
  completedAt?: Date | string | null;
  winningProposalId?: number | null;
  closureReason?: string | null;
  closureReasonDetail?: string | null;
  closureNote?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User | null;
  property?: Property | null;
  rentRequest?: RentRequest | null;
  proposals?: ProposalSummary[];
  _count?: {
    proposals: number;
  };
}

export interface DealCaseSummary extends DealCase {}
