import { Category } from "./category";
import { PropertyBoostOrder, PropertyPackageOrder } from "./commerce";
import {
  PropertyDirection,
  PropertyPriority,
  ListingStatus,
  PublishSource,
} from "./enums";
import { Lead } from "./lead";
import { Province, Ward } from "./location";
import { PropertyImage } from "./media";
import { User } from "./user";
import { PriceUnit } from "./enums";

export interface Property {
  id: number;
  displayCode?: string | null;
  userId?: number | null;
  title: string;
  slug: string;
  categoryId: number;
  price?: number | null;
  priceAmount?: number | null;
  priceUnit?: PriceUnit | null;
  isNegotiable: boolean;
  area: number;
  direction?: PropertyDirection | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floors?: number | null;
  priorityStatus: PropertyPriority;
  publishSource: PublishSource;
  isBoosted: boolean;
  boostCount: number;
  lastBoostedAt?: Date | string | null;
  boostExpiresAt?: Date | string | null;
  rejectReason?: string | null;
  provinceId: number;
  wardId: number | null;
  addressDetail?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  contactName: string;
  contactPhone: string;
  content?: string | null;
  isMatched?: boolean | null;
  viewCount: number;
  status: ListingStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  propertyPackageOrderId?: number | null;
  user?: User | null;
  category?: Category;
  province?: Province | null;
  ward?: Ward | null;
  leads?: Lead[];
  images?: PropertyImage[];
  boostOrders?: PropertyBoostOrder[];
  propertyPackageOrder?: PropertyPackageOrder | null;
}
