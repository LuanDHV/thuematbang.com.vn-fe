import type {
  OrderStatus,
  PaymentStatus,
  ExpressDuration,
  PropertyPriority,
  PropertyListingDuration,
  PurchaseType,
} from "../enums/index.js";

export interface PropertyPackageOrder {
  id: number;
  userId: number;
  priorityStatus: PropertyPriority;
  duration: PropertyListingDuration;
  totalPosts: number;
  remainingPosts: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PropertyBoostOrder {
  id: number;
  userId: number;
  propertyId?: number | null;
  boostDurationDays: number;
  totalBoost: number;
  remainingBoost: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RentRequestExpressOrder {
  id: number;
  userId: number;
  duration: ExpressDuration;
  totalPosts: number;
  remainingPosts: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PaymentTransaction {
  id: number;
  userId: number;
  purchaseType: PurchaseType;
  propertyPackageOrderId?: number | null;
  propertyBoostOrderId?: number | null;
  rentRequestExpressOrderId?: number | null;
  provider: string;
  providerTxnId?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt?: Date | string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
