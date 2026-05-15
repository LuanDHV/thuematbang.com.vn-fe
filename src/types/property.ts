import { Category } from "./category";
import { PropertyBoostOrder, PropertyPackageOrder } from "./commerce";
import {
  PropertyDirection,
  PropertyPriority,
  PublishSource,
  PublishStatus,
} from "./enums";
import { Lead } from "./lead";
import { City, District, Street, Ward } from "./location";
import { PropertyImage } from "./media";
import { User } from "./user";

export interface Property {
  id: number;
  userId?: number | null;
  title: string;
  slug: string;
  categoryId: number;

  price?: number | null;
  isNegotiable: boolean;
  area?: number | null;

  direction?: PropertyDirection | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floors?: number | null;
  frontage?: number | null;
  roadWidth?: number | null;

  priorityStatus: PropertyPriority;
  publishSource: PublishSource;

  isBoosted: boolean;
  boostedAt?: Date | string | null;
  boostStartAt?: Date | string | null;
  boostEndAt?: Date | string | null;
  boostCount: number;
  lastBoostAt?: Date | string | null;

  cityId?: number | null;
  districtId?: number | null;
  wardId?: number | null;
  streetId?: number | null;
  addressDetail?: string | null;
  longitude?: number | null;
  latitude?: number | null;

  contactName?: string | null;
  contactPhone?: string | null;

  content?: string | null;
  viewCount: number;
  status: PublishStatus;
  isFeatured: boolean;

  publishedAt?: Date | string | null;
  expiredAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;

  propertyPackageOrderId?: number | null;

  user?: User | null;
  category?: Category;
  city?: City | null;
  district?: District | null;
  ward?: Ward | null;
  street?: Street | null;
  leads?: Lead[];
  images?: PropertyImage[];
  boostOrders?: PropertyBoostOrder[];
  propertyPackageOrder?: PropertyPackageOrder | null;
}
