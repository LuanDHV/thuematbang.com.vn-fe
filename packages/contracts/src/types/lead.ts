import type { DealCaseStatus } from "../enums/index.js";

export type DealCaseSourceFilter = "PROPERTY" | "RENT_REQUEST";

export interface DealCase {
  id: number;
  userId?: number | null;
  fullName: string;
  phone: string;
  status: DealCaseStatus;
  source: DealCaseSourceFilter;
  propertyId?: number | null;
  rentRequestId?: number | null;
  note?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
