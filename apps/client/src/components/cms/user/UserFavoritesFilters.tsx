"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildFavoriteRoute,
  type FavoriteRouteState,
} from "@/lib/favorites/favorite-navigation";
import type { FavoriteMineParams } from "@/services/favorite.service";
import type { FavoriteEntityType } from "@/types/enums";

type FavoriteStatusFilter = Exclude<
  NonNullable<FavoriteMineParams["status"]>,
  "all"
>;

type UserFavoritesFiltersProps = {
  entityType: FavoriteEntityType;
  status: FavoriteStatusFilter;
};

const ENTITY_OPTIONS: Array<{
  label: string;
  value: FavoriteEntityType;
}> = [
  { label: "Tin cho thuê", value: "PROPERTY" },
  { label: "Tin cần thuê", value: "RENT_REQUEST" },
  { label: "Dự án", value: "PROJECT" },
];

const STATUS_OPTIONS: Array<{
  label: string;
  value: FavoriteStatusFilter;
}> = [
  { label: "Đang quan tâm", value: "active" },
  { label: "Đã bỏ quan tâm", value: "inactive" },
];

export default function UserFavoritesFilters({
  entityType,
  status,
}: UserFavoritesFiltersProps) {
  const router = useRouter();

  const pushRoute = (nextState: FavoriteRouteState) => {
    router.push(buildFavoriteRoute(nextState));
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-secondary text-[11px] font-semibold tracking-[0.18em] uppercase">
            Bộ lọc
          </p>
          <h2 className="text-heading text-base font-semibold tracking-[-0.02em]">
            Tin đã quan tâm
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {ENTITY_OPTIONS.map((option) => {
          const active = option.value === entityType;
          return (
            <Button
              key={option.value}
              type="button"
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => pushRoute({ entityType: option.value, status })}
            >
              {option.label}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 md:max-w-[220px]">
        <p className="text-secondary text-sm font-medium">Trạng thái</p>
        <Select
          value={status}
          onValueChange={(value) =>
            pushRoute({
              entityType,
              status: value as FavoriteStatusFilter,
            })
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
