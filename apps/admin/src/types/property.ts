import type {
  PropertyPriority,
  ListingStatus,
  PublishSource,
  PropertyDirection,
  PriceUnit,
} from "@thuematbang/contracts";

export interface Property {
  id: number;
  displayCode: string;
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
  favoriteCount: number;
  status: ListingStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: { id: number; name: string; slug: string } | null;
  province?: { id: number; name: string } | null;
  ward?: { id: number; name: string } | null;
  images?: Array<{ id: number; imageUrl: string; sortOrder: number; imagePublicId?: string | null }> | null;
  user?: { id: number; fullName: string; email: string } | null;
}
