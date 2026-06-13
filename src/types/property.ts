import { Category } from "./category";
import { PropertyBoostOrder, PropertyPackageOrder } from "./commerce";
import {
  PropertyDirection,
  PropertyPriority,
  PublishSource,
  PublishStatus,
} from "./enums";
import { Lead } from "./lead";
import { Province, Ward } from "./location";
import { PropertyImage } from "./media";
import { User } from "./user";

export interface Property {
  id: number;
  userId?: number | null;
  title: string;
  slug: string;
  categoryId: number;
  price: number;
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
  provinceId: number;
  wardId: number;
  addressDetail?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  contactName: string;
  contactPhone: string;
  content?: string | null;
  viewCount: number;
  status: PublishStatus;
  isFeatured: boolean;
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
