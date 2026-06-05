import {
  PaymentTransaction,
  PropertyBoostOrder,
  PropertyPackageOrder,
  UserPostingQuota,
} from "./commerce";
import { AuthProvider, UserRole } from "./enums";
import { Lead } from "./lead";
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
  leads?: Lead[];
  postingQuota?: UserPostingQuota | null;
  packageOrders?: PropertyPackageOrder[];
  boostOrders?: PropertyBoostOrder[];
  payments?: PaymentTransaction[];
}
