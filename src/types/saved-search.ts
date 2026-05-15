import { User } from "./user";

export type SavedSearchTargetType = "PROPERTY" | "RENT_REQUEST";

export interface SavedSearch {
  id: number;
  userId: number;
  name: string;
  targetType: SavedSearchTargetType | string;
  criteria: Record<string, unknown>;
  isDefault: boolean;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  user?: User;
}
