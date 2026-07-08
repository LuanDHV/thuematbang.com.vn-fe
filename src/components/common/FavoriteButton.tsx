"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

import { useAuthMe } from "@/hooks/use-auth";
import { favoriteClient } from "@/lib/favorites/favorite-client";
import type { FavoriteEntityType } from "@/types/enums";
import {
  clearPendingFavoriteIntent,
  isPendingFavoriteIntent,
  readPendingFavoriteIntent,
  savePendingFavoriteIntent,
} from "@/lib/favorites/pending-favorite";

type FavoriteButtonProps = {
  entityType: FavoriteEntityType;
  entityId: number;
  initialFavoriteCount: number;
  className?: string;
  onToggleResult?: (nextFavorited: boolean, nextFavoriteCount: number) => void;
};

const FAVORITE_QUERY_KEY = "favorite-state";

export default function FavoriteButton({
  entityType,
  entityId,
  initialFavoriteCount,
  className,
  onToggleResult,
}: FavoriteButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: authUser } = useAuthMe();
  const [optimisticState, setOptimisticState] = useState<{
    isFavorited: boolean;
    favoriteCount: number;
  } | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  const isTogglingRef = useRef(false);
  const hasReplayedIntentRef = useRef(false);

  const stateQuery = useQuery({
    queryKey: [FAVORITE_QUERY_KEY, entityType, entityId],
    queryFn: () => favoriteClient.getState(entityType, entityId),
    enabled: Boolean(authUser),
    retry: false,
  });

  const pendingIntent = useMemo(() => readPendingFavoriteIntent(), []);

  const resolvedIsFavorited =
    optimisticState?.isFavorited ?? stateQuery.data?.isFavorited ?? false;
  const resolvedFavoriteCount =
    optimisticState?.favoriteCount ??
    stateQuery.data?.favoriteCount ??
    initialFavoriteCount;

  const handleToggle = useCallback(async () => {
    if (isTogglingRef.current) return;

    if (!authUser) {
      savePendingFavoriteIntent({
        entityType,
        entityId,
        returnTo:
          typeof window !== "undefined"
            ? `${window.location.pathname}${window.location.search}`
            : undefined,
      });
      router.push(
        `/dang-nhap?from=${encodeURIComponent(window.location.pathname + window.location.search)}`,
      );
      return;
    }

    const previousState = resolvedIsFavorited;
    const previousCount = resolvedFavoriteCount;
    const nextFavorited = !previousState;
    const nextCount = Math.max(0, previousCount + (previousState ? -1 : 1));

    isTogglingRef.current = true;
    setIsToggling(true);
    setOptimisticState({
      isFavorited: nextFavorited,
      favoriteCount: nextCount,
    });
    onToggleResult?.(nextFavorited, nextCount);

    try {
      const result = await favoriteClient.toggle({
        entityType,
        entityId,
      });
      setOptimisticState({
        isFavorited: result.isFavorited,
        favoriteCount: result.favoriteCount,
      });
      onToggleResult?.(result.isFavorited, result.favoriteCount);
      queryClient.setQueryData([FAVORITE_QUERY_KEY, entityType, entityId], {
        isFavorited: result.isFavorited,
        favoriteCount: result.favoriteCount,
      });
      void queryClient.invalidateQueries({
        queryKey: [FAVORITE_QUERY_KEY, entityType, entityId],
        refetchType: "none",
      });
    } catch {
      setOptimisticState({
        isFavorited: previousState,
        favoriteCount: previousCount,
      });
      onToggleResult?.(previousState, previousCount);
    } finally {
      isTogglingRef.current = false;
      setIsToggling(false);
    }
  }, [
    authUser,
    entityId,
    entityType,
    onToggleResult,
    queryClient,
    resolvedFavoriteCount,
    resolvedIsFavorited,
    router,
  ]);

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isTogglingRef.current) return;
    void handleToggle();
  };

  useEffect(() => {
    if (!authUser || hasReplayedIntentRef.current) return;
    if (!isPendingFavoriteIntent(pendingIntent, entityType, entityId)) return;

    hasReplayedIntentRef.current = true;
    clearPendingFavoriteIntent();
    const replayTimer = window.setTimeout(() => {
      void handleToggle();
    }, 0);

    return () => window.clearTimeout(replayTimer);
  }, [authUser, entityType, entityId, pendingIntent, handleToggle]);

  return (
    <button
      type="button"
      onClick={handleButtonClick}
      aria-pressed={resolvedIsFavorited}
      disabled={isToggling}
      aria-label={resolvedIsFavorited ? "Bỏ quan tâm" : "Quan tâm"}
      className={`group bg-surface border-hairline hover:border-danger flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border transition-all disabled:cursor-not-allowed ${className ?? ""}`}
    >
      <Heart
        size={18}
        className={
          resolvedIsFavorited
            ? "text-danger fill-current"
            : "group-hover:text-danger text-black transition-[color,fill] group-hover:fill-current"
        }
      />
    </button>
  );
}
