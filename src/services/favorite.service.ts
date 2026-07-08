import "server-only";

import { requestServerApi } from "./shared/server-api-client";
import { buildListPath, buildListTags } from "./shared/list-service";
import type { FavoriteEntityType } from "@/types/enums";
import type {
  FavoriteListItem,
  FavoriteState,
  FavoriteToggleResponse,
} from "@/types/favorite";

export type FavoriteMineParams = {
  page?: number;
  limit?: number;
  entityType?: FavoriteEntityType;
  status?: "active" | "inactive";
};

export const favoriteService = {
  getMine: async (params: FavoriteMineParams = {}) =>
    requestServerApi<FavoriteListItem[]>(
      buildListPath("/me/favorites", {
        filters: {
          entityType: params.entityType,
          status: params.status,
        },
        page: params.page,
        limit: params.limit,
      }),
      {
        auth: "required",
        cache: "no-store",
        tags: buildListTags("my-favorites", {
          page: params.page,
          limit: params.limit,
        }),
      },
    ),

  getState: async (entityType: FavoriteEntityType, entityId: number) =>
    requestServerApi<FavoriteState>(
      `/me/favorites/state/${entityType}/${entityId}`,
      {
        auth: "required",
        cache: "no-store",
        tags: ["favorite-state", `${entityType}-${entityId}`],
      },
    ),

  toggle: async (payload: {
    entityType: FavoriteEntityType;
    entityId: number;
  }) => {
    const response = await requestServerApi<FavoriteToggleResponse>(
      "/me/favorites/toggle",
      {
        method: "POST",
        auth: "required",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    return response.data;
  },
};
