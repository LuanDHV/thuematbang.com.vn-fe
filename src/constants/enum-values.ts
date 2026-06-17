import type {
  AuthProvider,
  CategoryType,
  LeadStatus,
  OrderStatus,
  PropertyDirection,
  PropertyPriority,
  PublishSource,
  PublishStatus,
  PriceUnit,
  PurchaseType,
  UserRole,
} from "@/types/enums";

export const PROPERTY_DIRECTION_VALUES = [
  "BAC",
  "DONG_BAC",
  "DONG",
  "DONG_NAM",
  "NAM",
  "TAY_NAM",
  "TAY",
  "TAY_BAC",
] as const satisfies readonly PropertyDirection[];

export const PROPERTY_PRIORITY_VALUES = [
  "FREE",
  "STANDARD",
  "PREMIUM",
] as const satisfies readonly PropertyPriority[];

export const PUBLISH_SOURCE_VALUES = [
  "FREE_QUOTA",
  "PAID_PACKAGE",
] as const satisfies readonly PublishSource[];

export const PRICE_UNIT_VALUES = [
  "MILLION",
  "BILLION",
  "HUNDRED_THOUSAND_PER_M2",
  "MILLION_PER_M2",
] as const satisfies readonly PriceUnit[];

export const PUBLISH_STATUS_VALUES = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
] as const satisfies readonly PublishStatus[];

export const RENT_REQUEST_STATUS_VALUES = PUBLISH_STATUS_VALUES;

export const CATEGORY_TYPE_VALUES = [
  "PROPERTY",
  "RENT_REQUEST",
  "PROJECT",
  "NEWS",
] as const satisfies readonly CategoryType[];

export const LEAD_STATUS_VALUES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "REJECTED",
] as const satisfies readonly LeadStatus[];

export const USER_ROLE_VALUES = [
  "CUSTOMER",
  "AGENT",
  "ADMIN",
] as const satisfies readonly UserRole[];

export const AUTH_PROVIDER_VALUES = [
  "LOCAL",
  "GOOGLE",
] as const satisfies readonly AuthProvider[];

export const PURCHASE_TYPE_VALUES = [
  "PROPERTY_POST_PACKAGE",
  "PROPERTY_BOOST",
] as const satisfies readonly PurchaseType[];

export const ORDER_STATUS_VALUES = [
  "PENDING",
  "ACTIVE",
  "EXPIRED",
  "CANCELED",
] as const satisfies readonly OrderStatus[];

export const PAGE_VALUES = [
  "home",
  "cho-thue",
  "can-thue",
  "du-an",
  "tin-tuc",
] as const;

export type PageValue = (typeof PAGE_VALUES)[number];

export const BANNER_POSITION_VALUES = [
  "top",
  "middle",
  "bottom",
] as const;
