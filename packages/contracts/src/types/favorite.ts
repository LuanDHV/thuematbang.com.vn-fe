import type { FavoriteEntityType } from "../enums/index.js";

export interface FavoriteState {
  isFavorited: boolean;
}

export interface FavoriteToggleResponse {
  isFavorited: boolean;
  message: string;
}

export interface FavoriteListItem {
  entityId: number;
  entityType: FavoriteEntityType;
  createdAt: Date | string;
}
