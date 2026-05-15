import { LeadStatus } from "./enums";
import { Property } from "./property";
import { User } from "./user";

export interface Lead {
  id: number;
  userId?: number | null;
  propertyId?: number | null;
  fullName: string;
  phone: string;
  email?: string | null;
  source: string;
  message?: string | null;
  status: LeadStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User | null;
  property?: Property | null;
}

