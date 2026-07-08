import type { FavoriteEntityType } from "@/types/enums";

const PENDING_FAVORITE_KEY = "favorite:pending";

export type PendingFavoriteIntent = {
  entityType: FavoriteEntityType;
  entityId: number;
  returnTo?: string;
};

export function savePendingFavoriteIntent(intent: PendingFavoriteIntent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_FAVORITE_KEY, JSON.stringify(intent));
}

export function readPendingFavoriteIntent() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PENDING_FAVORITE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PendingFavoriteIntent;
  } catch {
    return null;
  }
}

export function clearPendingFavoriteIntent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_FAVORITE_KEY);
}

export function isPendingFavoriteIntent(
  intent: PendingFavoriteIntent | null,
  entityType: FavoriteEntityType,
  entityId: number,
) {
  if (!intent) return false;

  return intent.entityType === entityType && intent.entityId === entityId;
}
