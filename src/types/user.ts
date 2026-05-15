import {
  PaymentTransaction,
  PropertyBoostOrder,
  PropertyPackageOrder,
  UserPostingQuota,
} from "./commerce";
import { UserRole } from "./enums";
import { Lead } from "./lead";
import { Property } from "./property";
import { RentRequest } from "./rent-request";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  passwordHash?: string | null;
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
