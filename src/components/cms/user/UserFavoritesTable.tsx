"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, HeartOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  TablePaginationFooter,
} from "@/components/common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { favoriteClient } from "@/lib/favorites/favorite-client";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { sanitizeAnalyticsText, trackEvent } from "@/lib/analytics/track-event";
import {
  buildFavoriteRoute,
  type FavoriteRouteState,
} from "@/lib/favorites/favorite-navigation";
import {
  formatAreaValue,
  formatDateDisplay,
  formatListingPrice,
  formatLocationParts,
  formatNegotiablePrice,
} from "@/lib/format";
import type { FavoriteListItem } from "@/types/favorite";

type UserFavoritesTableProps = {
  items: FavoriteListItem[];
  currentPage: number;
  totalPages: number;
  filters: FavoriteRouteState;
};

type RowVisibility = "published" | "hidden" | "deleted";

type ResolvedFavoriteRow = {
  title: string;
  href?: string;
  typeLabel: string;
  summary: string;
  favoritedAt: Date | string;
  favoriteCount: number;
  entityId: number;
  visibilityLabel?: string;
  visibilityTone?: "warning" | "muted";
  visibilityState: RowVisibility;
};

function visibilityBadgeClass(visibilityTone?: "warning" | "muted") {
  if (visibilityTone === "muted") {
    return "surface-utility text-secondary inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium";
  }

  return "border-warning/20 bg-warning/10 text-warning inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium";
}

function resolveRow(item: FavoriteListItem): ResolvedFavoriteRow {
  if (item.property) {
    const isPublished = item.property.status === "PUBLISHED";
    return {
      title: item.property.title,
      href: isPublished ? `/cho-thue/${item.property.slug}` : undefined,
      typeLabel: "Tin cho thuê",
      summary: [
        formatLocationParts([item.property.ward?.name, item.property.province?.name]),
        formatNegotiablePrice(item.property.price, item.property.isNegotiable, {
          fallback: "Liên hệ",
          amount: item.property.priceAmount,
          unit: item.property.priceUnit,
        }),
      ].join(" · "),
      favoritedAt: item.favoritedAt,
      favoriteCount: item.property.favoriteCount ?? 0,
      entityId: item.entityId,
      visibilityLabel: isPublished ? undefined : "Đã ẩn",
      visibilityTone: "warning",
      visibilityState: isPublished ? "published" : "hidden",
    };
  }

  if (item.rentRequest) {
    const isPublished = item.rentRequest.status === "PUBLISHED";
    return {
      title: item.rentRequest.title,
      href: isPublished ? `/can-thue/${item.rentRequest.slug}` : undefined,
      typeLabel: "Tin cần thuê",
      summary: [
        formatLocationParts([
          item.rentRequest.desiredWard?.name,
          item.rentRequest.desiredProvince?.name,
        ]),
        formatListingPrice(item.rentRequest.budget, {
          fallback: "Đang cập nhật",
          amount: item.rentRequest.budgetAmount,
          unit: item.rentRequest.budgetUnit,
          negotiable: item.rentRequest.isNegotiable,
          negotiableLabel: "Thỏa thuận",
        }),
      ].join(" · "),
      favoritedAt: item.favoritedAt,
      favoriteCount: item.rentRequest.favoriteCount ?? 0,
      entityId: item.entityId,
      visibilityLabel: isPublished ? undefined : "Đã ẩn",
      visibilityTone: "warning",
      visibilityState: isPublished ? "published" : "hidden",
    };
  }

  if (item.project) {
    const isPublished = item.project.status === "PUBLISHED";
    return {
      title: item.project.name,
      href: isPublished ? `/du-an/${item.project.slug}` : undefined,
      typeLabel: "Dự án",
      summary: [
        formatLocationParts([item.project.ward?.name, item.project.province?.name]),
        formatAreaValue(item.project.area),
      ].join(" · "),
      favoritedAt: item.favoritedAt,
      favoriteCount: item.project.favoriteCount ?? 0,
      entityId: item.entityId,
      visibilityLabel: isPublished ? undefined : "Đã ẩn",
      visibilityTone: "warning",
      visibilityState: isPublished ? "published" : "hidden",
    };
  }

  return {
    title: "Nội dung đã bị xóa",
    href: undefined,
    typeLabel: "Đã xóa",
    summary: "Bản ghi gốc không còn tồn tại trên hệ thống.",
    favoritedAt: item.favoritedAt,
    favoriteCount: 0,
    entityId: item.entityId,
    visibilityLabel: "Đã xóa",
    visibilityTone: "muted",
    visibilityState: "deleted",
  };
}

function getFavoriteTrackingParams(item: FavoriteListItem) {
  if (item.property) {
    return {
      source: "user_favorites_table",
      listing_type: "property",
      listing_id: item.property.id,
      listing_title: sanitizeAnalyticsText(item.property.title),
      display_code: item.property.displayCode,
      category_id: item.property.categoryId,
      category_name: sanitizeAnalyticsText(item.property.category?.name),
      province_id: item.property.provinceId,
      province_name: sanitizeAnalyticsText(item.property.province?.name),
      ward_id: item.property.wardId,
      ward_name: sanitizeAnalyticsText(item.property.ward?.name),
      price_amount: item.property.priceAmount,
      price_unit: item.property.priceUnit,
      priority_status: item.property.priorityStatus,
      is_authenticated: true,
    };
  }

  if (item.rentRequest) {
    return {
      source: "user_favorites_table",
      listing_type: "rent_request",
      listing_id: item.rentRequest.id,
      listing_title: sanitizeAnalyticsText(item.rentRequest.title),
      display_code: item.rentRequest.displayCode,
      category_id: item.rentRequest.categoryId,
      category_name: sanitizeAnalyticsText(item.rentRequest.category?.name),
      province_id: item.rentRequest.desiredProvinceId,
      province_name: sanitizeAnalyticsText(item.rentRequest.desiredProvince?.name),
      ward_id: item.rentRequest.desiredWardId,
      ward_name: sanitizeAnalyticsText(item.rentRequest.desiredWard?.name),
      budget_amount: item.rentRequest.budgetAmount,
      price_unit: item.rentRequest.budgetUnit,
      is_express: item.rentRequest.isExpress,
      is_authenticated: true,
    };
  }

  if (item.project) {
    return {
      source: "user_favorites_table",
      listing_type: "project",
      listing_id: item.project.id,
      listing_title: sanitizeAnalyticsText(item.project.name),
      display_code: item.project.displayCode,
      category_id: item.project.categoryId,
      category_name: sanitizeAnalyticsText(item.project.category?.name),
      province_id: item.project.provinceId,
      province_name: sanitizeAnalyticsText(item.project.province?.name),
      ward_id: item.project.wardId,
      ward_name: sanitizeAnalyticsText(item.project.ward?.name),
      price_amount: item.project.priceAmount,
      price_unit: item.project.priceUnit,
      is_authenticated: true,
    };
  }

  return {
    source: "user_favorites_table",
    listing_type: item.entityType.toLowerCase(),
    listing_id: item.entityId,
    is_authenticated: true,
  };
}

function FavoriteStatusBadge({
  label,
  tone,
}: {
  label: string;
  tone?: "warning" | "muted";
}) {
  return <span className={visibilityBadgeClass(tone)}>{label}</span>;
}

function FavoriteTitle({
  title,
  href,
  visibilityLabel,
  visibilityTone,
}: {
  title: string;
  href?: string;
  visibilityLabel?: string;
  visibilityTone?: "warning" | "muted";
}) {
  return (
    <div className="space-y-1">
      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-heading hover:text-primary line-clamp-2 font-semibold transition-colors"
        >
          {title}
        </Link>
      ) : (
        <span className="text-secondary line-clamp-2 font-semibold">{title}</span>
      )}

      {visibilityLabel ? (
        <FavoriteStatusBadge label={visibilityLabel} tone={visibilityTone} />
      ) : null}
    </div>
  );
}

function FavoriteMobileCard({
  item,
  onToggle,
  isUpdating,
}: {
  item: FavoriteListItem;
  onToggle: (item: FavoriteListItem) => Promise<void>;
  isUpdating: boolean;
}) {
  const row = resolveRow(item);
  const actionLabel = item.isActive ? "Bỏ quan tâm" : "Quan tâm lại";

  return (
    <article className="surface-card space-y-4 rounded-2xl p-4">
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <FavoriteTitle
            title={row.title}
            href={row.href}
            visibilityLabel={row.visibilityLabel}
            visibilityTone={row.visibilityTone}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-danger hover:bg-danger/10 hover:text-danger"
            onClick={() => void onToggle(item)}
            disabled={isUpdating}
            aria-label={`${actionLabel} ${row.title}`}
          >
            {item.isActive ? (
              <HeartOff className="size-4" />
            ) : (
              <Heart className="size-4" />
            )}
          </Button>
        </div>
        <p className="text-secondary truncate text-xs">{row.typeLabel}</p>
      </div>

      <div className="space-y-1">
        <p className="text-secondary text-xs font-medium">Mô tả</p>
        <p className="text-body text-sm">{row.summary}</p>
      </div>

      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-secondary text-xs font-medium">Ngày quan tâm</p>
          <p className="text-body">{formatDateDisplay(row.favoritedAt)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-secondary text-xs font-medium">Lượt tim</p>
          <p className="text-body">{row.favoriteCount}</p>
        </div>
      </div>
    </article>
  );
}

export default function UserFavoritesTable({
  items,
  currentPage,
  totalPages,
  filters,
}: UserFavoritesTableProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleToggle = async (item: FavoriteListItem) => {
    setUpdatingId(item.id);
    try {
      const result = await favoriteClient.toggle({
        entityType: item.entityType,
        entityId: item.entityId,
      });
      trackEvent(
        result.isFavorited
          ? ANALYTICS_EVENTS.favoriteListing
          : ANALYTICS_EVENTS.unfavoriteListing,
        {
          ...getFavoriteTrackingParams(item),
          favorite_count: result.favoriteCount,
        },
      );
      router.refresh();
    } finally {
      setUpdatingId((current) => (current === item.id ? null : current));
    }
  };

  const goToPage = (page: number) => {
    router.push(buildFavoriteRoute({ ...filters, page }));
  };

  return (
    <section className="surface-panel overflow-hidden">
      <div className="border-hairline border-b px-4 py-4 md:px-5">
        <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
          Tin đã quan tâm
        </h2>
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Tin quan tâm</TableHead>
              <TableHead className="w-1/6">Loại</TableHead>
              <TableHead className="w-1/3">Mô tả</TableHead>
              <TableHead className="w-24">Ngày quan tâm</TableHead>
              <TableHead className="w-24">Lượt tim</TableHead>
              <TableHead className="text-right">Tác vụ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => {
                const row = resolveRow(item);
                const isUpdating = updatingId === item.id;
                const actionLabel = item.isActive ? "Bỏ quan tâm" : "Quan tâm lại";

                return (
                  <TableRow key={item.id}>
                    <TableCell className="align-top">
                      <FavoriteTitle
                        title={row.title}
                        href={row.href}
                        visibilityLabel={row.visibilityLabel}
                        visibilityTone={row.visibilityTone}
                      />
                    </TableCell>
                    <TableCell className="text-body align-top text-sm">
                      {row.typeLabel}
                    </TableCell>
                    <TableCell className="text-body align-top text-sm">
                      {row.summary}
                    </TableCell>
                    <TableCell className="text-body align-top text-sm">
                      {formatDateDisplay(row.favoritedAt)}
                    </TableCell>
                    <TableCell className="text-body align-top text-sm">
                      {row.favoriteCount}
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-danger hover:bg-danger/10 hover:text-danger"
                        onClick={() => void handleToggle(item)}
                        disabled={isUpdating}
                        aria-label={`${actionLabel} ${row.title}`}
                      >
                        {item.isActive ? (
                          <HeartOff className="mr-2 size-4" />
                        ) : (
                          <Heart className="mr-2 size-4" />
                        )}
                        {actionLabel}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-14 text-center">
                  <div className="space-y-2">
                    <p className="text-heading text-base font-semibold">
                      Chưa có tin đã quan tâm
                    </p>
                    <p className="text-secondary text-sm">
                      Khi bạn bấm tim ở trang công khai, tin sẽ xuất hiện tại đây.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TablePaginationFooter
            page={currentPage}
            totalPages={totalPages}
            onChange={goToPage}
            colSpan={6}
          />
        </Table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {items.length > 0 ? (
          items.map((item) => (
            <FavoriteMobileCard
              key={item.id}
              item={item}
              onToggle={handleToggle}
              isUpdating={updatingId === item.id}
            />
          ))
        ) : (
          <div className="surface-card px-4">
            <div className="space-y-2 py-14 text-center">
              <p className="text-heading text-base font-semibold">
                Chưa có tin đã quan tâm
              </p>
              <p className="text-secondary text-sm">
                Khi bạn bấm tim ở trang công khai, tin sẽ xuất hiện tại đây.
              </p>
            </div>
          </div>
        )}

        {totalPages > 1 ? (
          <div className="pt-2">
            <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
