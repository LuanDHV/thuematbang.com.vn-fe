import { Category } from "./category";
import { RentRequestStatus, PropertyDirection } from "./enums";
import { City, District, Street, Ward } from "./location";
import { User } from "./user";

export interface RentRequest {
  id: number;
  userId?: number | null;
  title: string;
  slug: string;
  categoryId?: number | null;
  thumbnailUrl?: string | null;
  thumbnailPublicId?: string | null;
  desiredCityId?: number | null;
  desiredDistrictId?: number | null;
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
  isFeatured: boolean;
  viewCount: number;
  publishedAt?: Date | string | null;
  expiredAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User | null;
  category?: Category | null;
  desiredCity?: City | null;
  desiredDistrict?: District | null;
  desiredWard?: Ward | null;
  desiredStreet?: Street | null;
}

