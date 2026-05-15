import { Category } from "./category";
import { City, District, Street, Ward } from "./location";
import { User } from "./user";
import {
  PropertyDirection,
  PropertyPriority,
  PropertyPriorityLegacy,
  PublishSource,
  PublishStatus,
} from "./enums";

export interface Property {
  id: number;
  userId?: number;
  title: string;
  slug: string;
  categoryId: number;
  price?: number | null;
  isNegotiable?: boolean;
  area?: number | null;
  thumbnailUrl?: string | null;
  direction?: PropertyDirection | string | null;
  floors?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  frontage?: number | null;
  roadWidth?: number | null;
  viewCount?: number | null;
  priorityStatus?:
    | PropertyPriority
    | PropertyPriorityLegacy
    | string
    | null;
  publishSource?: PublishSource | string | null;
  propertyPackageOrderId?: number | null;
  isBoosted?: boolean;
  boostedAt?: Date | string | null;
  boostStartAt?: Date | string | null;
  boostEndAt?: Date | string | null;
  boostCount?: number | null;
  lastBoostAt?: Date | string | null;

  cityId?: number | null;
  districtId?: number | null;
  wardId?: number | null;
  streetId?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  addressDetail?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  content?: string | null;
  description?: string | null;
  status?: PublishStatus | string | null;
  isFeatured?: boolean | null;
  publishedAt?: Date | string | null;
  expiredAt?: Date | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  user?: User;
  category?: Category | null;
  city?: City | null;
  district?: District | null;
  ward?: Ward | null;
  street?: Street | null;
}
