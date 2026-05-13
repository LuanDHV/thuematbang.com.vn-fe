export type UserRole = "CUSTOMER" | "AGENT" | "ADMIN";

export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "CLOSED"
  | "REJECTED";

export type ListingType = "RENT_OUT" | "RENT_WANTED";

export type PropertyPriority = "NORMAL" | "SILVER" | "GOLD";

export type PropertyPriorityLegacy = "normal" | "silver" | "gold";

export type PropertyDirection =
  | "BAC"
  | "DONG_BAC"
  | "DONG"
  | "DONG_NAM"
  | "NAM"
  | "TAY_NAM"
  | "TAY"
  | "TAY_BAC";

export type CategoryType = "PROPERTY" | "PROJECT" | "POST";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELED"
  | "REFUNDED";

export type PurchaseType = "PROPERTY_POST_PACKAGE" | "PROPERTY_BOOST";

export type OrderStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELED";

export type PublishSource = "FREE_QUOTA" | "PAID_PACKAGE";
