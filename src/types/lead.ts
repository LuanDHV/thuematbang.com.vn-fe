import { LeadStatus } from "./enums";

export interface Lead {
  id: number;
  fullName: string;
  phone: string;
  propertyId?: number | null;
  source: string;
  message?: string | null;
  status?: LeadStatus | string | null;
  createdAt?: Date | string | null;
  property?: {
    id: number;
    title: string;
  } | null;
}
