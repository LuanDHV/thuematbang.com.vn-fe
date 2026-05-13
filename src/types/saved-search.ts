import { ListingType } from "./enums";
import { User } from "./user";

export interface SavedSearch {
  id: number;
  userId: number;
  name: string;
  listingType: ListingType | string;
  criteria: Record<string, unknown>;
  isDefault: boolean;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  user?: User;
}
