import { Category } from "./category";
import {
  ExpressDuration,
  PriceUnit,
  PropertyDirection,
  PublishStatus,
} from "./enums";
import { Province, Ward } from "./location";
import { User } from "./user";

export interface RentRequest {
  id: number;
  userId?: number | null;
  title: string;
  slug: string;
  categoryId: number;
  desiredProvinceId: number;
  desiredWardId: number | null;
  budget: number;
  budgetAmount?: number | null;
  budgetUnit?: PriceUnit | null;
  desiredArea: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floors?: number | null;
  desiredDirection?: PropertyDirection | null;
  requirementText?: string | null;
  contactName: string;
  contactPhone: string;
  status: PublishStatus;
  isMatched: boolean;
  isExpress: boolean;
  duration?: ExpressDuration | null;
  expressExpiresAt?: Date | string | null;
  rentRequestExpressOrderId?: number | null;
  viewCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User | null;
  category?: Category | null;
  desiredProvince?: Province | null;
  desiredWard?: Ward | null;
}
