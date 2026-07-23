import { LeadStatus } from "./enums";
import { ListingMatchSummary } from "./listing-match";
import { Property } from "./property";
import { RentRequest } from "./rent-request";
import { User } from "./user";

export type LeadSourceFilter = "PROPERTY" | "RENT_REQUEST";

export interface Lead {
  id: number;
  userId?: number | null;
  propertyId?: number | null;
  rentRequestId?: number | null;
  fullName: string;
  phone: string;
  status: LeadStatus;
  note?: string | null;
  completedAt?: Date | string | null;
  winningMatchId?: number | null;
  closureReason?: string | null;
  closureReasonDetail?: string | null;
  closureNote?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User | null;
  property?: Property | null;
  rentRequest?: RentRequest | null;
  listingMatches?: ListingMatchSummary[];
  _count?: {
    listingMatches: number;
  };
}
