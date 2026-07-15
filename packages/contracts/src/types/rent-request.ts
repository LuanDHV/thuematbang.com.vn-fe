import type { ListingStatus } from "../enums/index.js";

export interface RentRequest {
  id: number;
  displayCode: string;
  userId?: number | null;
  title: string;
  slug: string;
  categoryId: number;
  budgetMin?: number | null;
  budgetMax?: number | null;
  areaMin?: number | null;
  areaMax?: number | null;
  provinceId: number;
  wardId: number | null;
  addressDetail?: string | null;
  contactName: string;
  contactPhone: string;
  requirementText?: string | null;
  isMatched?: boolean | null;
  rejectReason?: string | null;
  viewCount: number;
  favoriteCount: number;
  status: ListingStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  rentRequestExpressOrderId?: number | null;
}
