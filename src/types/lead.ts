import { LeadStatus } from "./enums";
import { Property } from "./property";
import { RentRequest } from "./rent-request";
import { User } from "./user";

export interface Lead {
  id: number;
  userId?: number | null;
  propertyId?: number | null;
  rentRequestId?: number | null;
  fullName: string;
  phone: string;
  status: LeadStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User | null;
  property?: Property | null;
  rentRequest?: RentRequest | null;
}
