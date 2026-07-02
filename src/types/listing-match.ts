import type { ListingMatchStatus } from "./enums";

export interface ListingMatchSummary {
  id: number;
  status: ListingMatchStatus;
  property?: {
    id: number;
    title: string;
    slug: string;
    contactName: string;
    contactPhone: string;
    isMatched: boolean;
  } | null;
  rentRequest?: {
    id: number;
    title: string;
    slug: string;
    contactName: string;
    contactPhone: string;
    isMatched: boolean;
  } | null;
  matchedAt?: string | null;
  createdAt: string;
}
