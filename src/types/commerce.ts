import {
  OrderStatus,
  PaymentStatus,
  PropertyPriority,
  PurchaseType,
} from "./enums";
import { Property } from "./property";
import { User } from "./user";

export interface UserPostingQuota {
  id: number;
  userId: number;
  freePropertyPostsTotal: number;
  freePropertyPostsRemaining: number;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  user?: User;
}

export interface PropertyPackageOrder {
  id: number;
  userId: number;
  priorityStatus: PropertyPriority | string;
  totalPosts: number;
  remainingPosts: number;
  amount: number;
  currency: string;
  status: OrderStatus | string;
  note?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  user?: User;
  properties?: Property[];
}

export interface PropertyBoostOrder {
  id: number;
  userId: number;
  propertyId?: number | null;
  priorityStatus: PropertyPriority | string;
  totalBoost: number;
  remainingBoost: number;
  amount: number;
  currency: string;
  startAt?: Date | string | null;
  endAt?: Date | string | null;
  status: OrderStatus | string;
  note?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  user?: User;
  property?: Property | null;
}

export interface PaymentTransaction {
  id: number;
  userId: number;
  purchaseType: PurchaseType | string;
  propertyPackageOrderId?: number | null;
  propertyBoostOrderId?: number | null;
  provider: string;
  providerTxnId?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus | string;
  paidAt?: Date | string | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}
