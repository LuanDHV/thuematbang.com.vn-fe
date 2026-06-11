import { Category } from "./category";
import { PropertyDirection, RentRequestStatus } from "./enums";
import { Province, Street, Ward } from "./location";
import { User } from "./user";

export interface RentRequest {
  id: number;
  userId?: number | null;
  title: string;
  slug: string;
  categoryId?: number | null;
  desiredProvinceId?: number | null;
  desiredWardId?: number | null;
  desiredStreetId?: number | null;
  minBudget?: number | null;
  maxBudget?: number | null;
  minArea?: number | null;
  maxArea?: number | null;
  preferredDirection?: PropertyDirection | null;
  requirementText?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  status: RentRequestStatus;
  viewCount: number;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User | null;
  category?: Category | null;
  desiredProvince?: Province | null;
  desiredWard?: Ward | null;
  desiredStreet?: Street | null;
}
