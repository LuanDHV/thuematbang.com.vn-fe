import type {
  AuthProvider,
  CategoryType,
  ContentStatus,
  DealCaseStatus,
  OrderStatus,
  ListingStatus,
  ExpressDuration,
  PropertyDirection,
  PropertyPriority,
  PropertyListingDuration,
  PublishSource,
  PriceUnit,
  PurchaseType,
  ProposalReviewStatus,
  ProposalSourceType,
  ProposalStatus,
  UserRole,
} from "../enums/index.js";

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
  "THOUSAND_PER_M2",
  "MILLION_PER_M2",
] as const satisfies readonly PriceUnit[];

export const LISTING_STATUS_VALUES = [
  "DRAFT",
  "PENDING",
  "PUBLISHED",
  "REJECTED",
  "ARCHIVED",
] as const satisfies readonly ListingStatus[];

export const CONTENT_STATUS_VALUES = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
] as const satisfies readonly ContentStatus[];

export const PUBLISH_STATUS_VALUES = LISTING_STATUS_VALUES;

export const RENT_REQUEST_STATUS_VALUES = LISTING_STATUS_VALUES;

export const CATEGORY_TYPE_VALUES = [
  "PROPERTY",
  "RENT_REQUEST",
  "PROJECT",
  "NEWS",
] as const satisfies readonly CategoryType[];

export const DEAL_CASE_STATUS_VALUES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "REJECTED",
] as const satisfies readonly DealCaseStatus[];

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
  "RENT_REQUEST_EXPRESS",
] as const satisfies readonly PurchaseType[];

export const PROPERTY_LISTING_DURATION_VALUES = [
  "D30",
  "D60",
  "D90",
] as const satisfies readonly PropertyListingDuration[];

export const EXPRESS_DURATION_VALUES = [
  "D1",
  "D3",
  "D5",
  "D7",
  "D14",
  "D30",
] as const satisfies readonly ExpressDuration[];

export const ORDER_STATUS_VALUES = [
  "PENDING",
  "ACTIVE",
  "EXPIRED",
  "CANCELED",
] as const satisfies readonly OrderStatus[];

export const PROPOSAL_STATUS_VALUES = [
  "SUGGESTED",
  "QUALIFIED",
  "NEGOTIATING",
  "DEAL_WON",
  "DEAL_LOST",
  "CANCELLED_AUTO",
] as const satisfies readonly ProposalStatus[];

export const PROPOSAL_REVIEW_STATUS_VALUES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const satisfies readonly ProposalReviewStatus[];

export const PROPOSAL_SOURCE_TYPE_VALUES = [
  "USER_SUBMISSION",
  "ADMIN_CREATED",
] as const satisfies readonly ProposalSourceType[];

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
