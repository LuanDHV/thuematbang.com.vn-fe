import {
  PaymentTransaction,
  PropertyBoostOrder,
  PropertyPackageOrder,
  RentRequestExpressOrder,
} from "./commerce";
import { AuthProvider, UserRole } from "./enums";
import { DealCase } from "./lead";
import { Property } from "./property";
import { RentRequest } from "./rent-request";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  phoneNormalized?: string | null;
  googleId?: string | null;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  passwordHash?: string | null;
  hasPassword?: boolean;
  authProvider?: AuthProvider;
  role: UserRole;
  createdAt: Date | string;
  updatedAt: Date | string;
  properties?: Property[];
  rentRequests?: RentRequest[];
  dealCases?: DealCase[];
  packageOrders?: PropertyPackageOrder[];
  boostOrders?: PropertyBoostOrder[];
  expressOrders?: RentRequestExpressOrder[];
  payments?: PaymentTransaction[];
}
