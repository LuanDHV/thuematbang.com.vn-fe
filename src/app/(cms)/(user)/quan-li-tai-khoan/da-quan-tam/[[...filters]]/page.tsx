import type { Metadata } from "next";

import UserFavoritesFilters from "@/components/cms/user/UserFavoritesFilters";
import UserFavoritesTable from "@/components/cms/user/UserFavoritesTable";
import { resolvePaginationClientMeta } from "@/lib/client-side";
import {
  buildFavoriteRoute,
  resolveFavoriteRouteState,
} from "@/lib/favorites/favorite-navigation";
import { createPageMetadata } from "@/lib/metadata";
import { favoriteService } from "@/services/favorite.service";
import { redirect } from "next/navigation";

export const metadata: Metadata = createPageMetadata({
  title: "Tin đã quan tâm",
  description: "Danh sách tin bạn đã thả tim hoặc quan tâm trên hệ thống.",
  pathname: "/quan-li-tai-khoan/da-quan-tam",
  noIndex: true,
});

export default async function UserFavoritesPage({
  params,
  searchParams,
}: {
  params?: Promise<{ filters?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = (await params) ?? {};
  const resolvedSearchParams = (await searchParams) ?? {};
  const routeState = resolveFavoriteRouteState(resolvedParams.filters);
  const canonicalRoute = buildFavoriteRoute({
    entityType: routeState.entityType,
    status: routeState.status,
    page:
      typeof resolvedSearchParams.page === "string"
        ? Math.max(1, Number(resolvedSearchParams.page) || 1)
        : undefined,
  });

  if (!resolvedParams.filters?.length) {
    redirect(canonicalRoute);
  }

  const page =
    typeof resolvedSearchParams.page === "string"
      ? Math.max(1, Number(resolvedSearchParams.page) || 1)
      : 1;

  const response = await favoriteService.getMine({
    entityType: routeState.entityType,
    status: routeState.status,
    page,
    limit: 12,
  });

  const paginationMeta = resolvePaginationClientMeta(response.meta);
  const currentPage = Math.max(1, paginationMeta.currentPage ?? 1);
  const totalPages = Math.max(1, paginationMeta.totalPage ?? 1);

  return (
    <section className="flex flex-col gap-5">
      <div className="surface-panel border-hairline flex flex-col gap-4 border p-4 md:p-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading text-2xl font-semibold tracking-[-0.03em]">
            Tin đã quan tâm
          </h1>
          <p className="text-secondary text-sm">
            Xem lại các tin bạn đã thả tim và quản lý trạng thái quan tâm của mình.
          </p>
        </div>

        <UserFavoritesFilters
          entityType={routeState.entityType}
          status={routeState.status}
        />
      </div>

      <UserFavoritesTable
        items={response.data ?? []}
        currentPage={currentPage}
        totalPages={totalPages}
        filters={{
          entityType: routeState.entityType,
          status: routeState.status,
          page: currentPage,
        }}
      />
    </section>
  );
}
