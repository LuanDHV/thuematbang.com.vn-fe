import type { LeadStatus } from "../enums/index.js";

export type LeadSourceFilter = "PROPERTY" | "RENT_REQUEST";

export interface Lead {
  id: number;
  userId?: number | null;
  fullName: string;
  phone: string;
  status: LeadStatus;
  source: LeadSourceFilter;
  propertyId?: number | null;
  rentRequestId?: number | null;
  note?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
