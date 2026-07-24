import type { ProposalStatus } from "../enums/index.js";

export interface ProposalSummary {
  id: number;
  leadId: number;
  propertyId?: number | null;
  rentRequestId?: number | null;
  status: ProposalStatus;
  matchedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
