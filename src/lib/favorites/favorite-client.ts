import { getJson, postJson, unwrapApiData } from "@/lib/http";
import { getPublicApiBaseUrl } from "@/lib/env";
import type { FavoriteEntityType } from "@/types/enums";
import type { FavoriteState, FavoriteToggleResponse } from "@/types/favorite";

function createFavoriteUrl(path: string) {
  const base = getPublicApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export const favoriteClient = {
  getState: async (entityType: FavoriteEntityType, entityId: number) => {
    const payload = await getJson<unknown>(
      createFavoriteUrl(`/me/favorites/state/${entityType}/${entityId}`),
      { cache: "no-store" },
    );
    return unwrapApiData<FavoriteState>(payload);
  },

  toggle: async (payload: {
    entityType: FavoriteEntityType;
    entityId: number;
  }) => {
    const response = await postJson<unknown>(
      createFavoriteUrl("/me/favorites/toggle"),
      payload,
      { cache: "no-store" },
    );
    return unwrapApiData<FavoriteToggleResponse>(response);
  },
};
