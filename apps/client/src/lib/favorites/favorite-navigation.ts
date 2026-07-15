import type { FavoriteMineParams } from "@/services/favorite.service";
import type { FavoriteEntityType } from "@/types/enums";

const BASE_PATH = "/quan-li-tai-khoan/da-quan-tam";
type FavoriteRouteStatus = Exclude<NonNullable<FavoriteMineParams["status"]>, "all">;

const ENTITY_SLUGS: Record<FavoriteEntityType, string> = {
  PROPERTY: "cho-thue",
  RENT_REQUEST: "can-thue",
  PROJECT: "du-an",
};

const STATUS_SLUGS: Record<FavoriteRouteStatus, string> = {
  active: "dang-quan-tam",
  inactive: "da-bo-quan-tam",
};

const ENTITY_SLUG_TO_VALUE: Record<string, FavoriteEntityType> = {
  "cho-thue": "PROPERTY",
  "can-thue": "RENT_REQUEST",
  "du-an": "PROJECT",
};

const STATUS_SLUG_TO_VALUE: Record<string, FavoriteRouteStatus> = {
  "dang-quan-tam": "active",
  "da-bo-quan-tam": "inactive",
};

export type FavoriteRouteState = {
  entityType: FavoriteEntityType;
  status: FavoriteRouteStatus;
  page?: number;
};

export function resolveFavoriteRouteState(rawSegments?: string[]): FavoriteRouteState {
  const normalizedSegments = (rawSegments ?? []).filter(Boolean).map(decodeURIComponent);

  let entityType: FavoriteEntityType = "PROPERTY";
  let status: FavoriteRouteStatus = "active";

  for (const segment of normalizedSegments) {
    if (segment in ENTITY_SLUG_TO_VALUE) {
      entityType = ENTITY_SLUG_TO_VALUE[segment];
      continue;
    }

    if (segment in STATUS_SLUG_TO_VALUE) {
      status = STATUS_SLUG_TO_VALUE[segment];
    }
  }

  return { entityType, status };
}

export function buildFavoriteRoute(state: FavoriteRouteState) {
  const segments: string[] = [];
  const entitySlug = ENTITY_SLUGS[state.entityType ?? "PROPERTY"];

  if (entitySlug) segments.push(entitySlug);
  if (state.status !== "active") segments.push(STATUS_SLUGS[state.status]);

  const path = segments.length > 0 ? `${BASE_PATH}/${segments.join("/")}` : BASE_PATH;

  if (typeof state.page === "number" && state.page > 1) {
    return `${path}?page=${state.page}`;
  }

  return path;
}

export function getFavoriteBasePath() {
  return BASE_PATH;
}
