import { Category } from "./category";
import { PropertyDirection, RentRequestStatus } from "./enums";
import { Province, Ward } from "./location";
import { User } from "./user";

export interface RentRequest {
  id: number;
  userId?: number | null;
  title: string;
  slug: string;
  categoryId: number;
  desiredProvinceId: number;
  desiredWardId: number;
  minBudget: number;
  maxBudget: number;
  minArea: number;
  maxArea: number;
  desiredDirection: PropertyDirection;
  requirementText?: string | null;
  contactName: string;
  contactPhone: string;
  status: RentRequestStatus;
  viewCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User | null;
  category?: Category | null;
  desiredProvince?: Province | null;
  desiredWard?: Ward | null;
}
