import type { FavoriteEntityType } from "./enums";
import type { Property } from "./property";
import type { RentRequest } from "./rent-request";
import type { Project } from "./project";

export type FavoriteState = {
  entityType: FavoriteEntityType;
  entityId: number;
  isFavorited: boolean;
  favoriteCount: number;
  favoritedAt?: Date | string | null;
  unfavoritedAt?: Date | string | null;
};

export type FavoriteToggleResponse = FavoriteState;

export type FavoriteListItem = {
  id: number;
  entityType: FavoriteEntityType;
  entityId: number;
  isActive: boolean;
  favoritedAt: Date | string;
  unfavoritedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  property?: Property | null;
  rentRequest?: RentRequest | null;
  project?: Project | null;
};
