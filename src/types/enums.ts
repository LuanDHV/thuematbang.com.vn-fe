export type AuthProvider = "LOCAL" | "GOOGLE";

export type UserRole = "CUSTOMER" | "AGENT" | "ADMIN";

export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "REJECTED";

export type PropertyPriority = "FREE" | "STANDARD" | "PREMIUM";

export type PropertyDirection =
  | "BAC"
  | "DONG_BAC"
  | "DONG"
  | "DONG_NAM"
  | "NAM"
  | "TAY_NAM"
  | "TAY"
  | "TAY_BAC";

export type CategoryType = "PROPERTY" | "RENT_REQUEST" | "PROJECT" | "NEWS";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELED";

export type PurchaseType =
  | "PROPERTY_POST_PACKAGE"
  | "PROPERTY_BOOST"
  | "RENT_REQUEST_EXPRESS";

export type OrderStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELED";

export type PublishSource = "FREE_QUOTA" | "PAID_PACKAGE";

export type ExpressDuration =
  | "D1"
  | "D3"
  | "D5"
  | "D7"
  | "D14"
  | "D30";

export type PropertyListingDuration = "D30" | "D60" | "D90";

export type PriceUnit =
  | "MILLION"
  | "BILLION"
  | "THOUSAND_PER_M2"
  | "MILLION_PER_M2";
