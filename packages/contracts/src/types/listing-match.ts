import type { ListingMatchStatus } from "../enums/index.js";

export interface ListingMatchSummary {
  id: number;
  leadId: number;
  propertyId?: number | null;
  rentRequestId?: number | null;
  status: ListingMatchStatus;
  matchedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
