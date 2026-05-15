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
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
}

export interface PropertyPackageOrder {
  id: number;
  userId: number;
  priorityStatus: PropertyPriority;
  totalPosts: number;
  remainingPosts: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
  properties?: Property[];
  payments?: PaymentTransaction[];
}

export interface PropertyBoostOrder {
  id: number;
  userId: number;
  propertyId?: number | null;
  priorityStatus: PropertyPriority;
  totalBoost: number;
  remainingBoost: number;
  amount: number;
  currency: string;
  startAt?: Date | string | null;
  endAt?: Date | string | null;
  status: OrderStatus;
  note?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
  property?: Property | null;
  payments?: PaymentTransaction[];
}

export interface PaymentTransaction {
  id: number;
  userId: number;
  purchaseType: PurchaseType;
  propertyPackageOrderId?: number | null;
  propertyBoostOrderId?: number | null;
  provider: string;
  providerTxnId?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt?: Date | string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
  propertyPackageOrder?: PropertyPackageOrder | null;
  propertyBoostOrder?: PropertyBoostOrder | null;
}

