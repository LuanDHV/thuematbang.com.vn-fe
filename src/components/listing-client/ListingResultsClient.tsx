"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Pagination } from "@/components/common/Pagination";
import { PropertyCard } from "@/components/common/PropertyCard";
import { RentRequestCard } from "@/components/common/RentRequestCard";
import { buildPagedPath, type BreadcrumbItem } from "@/lib/flat-url";
import { resolvePaginationClientMeta } from "@/lib/client-side";
import { Property } from "@/types/property";
import { RentRequest } from "@/types/rent-request";
import { PaginationMeta } from "@/types/api";

const TIER_ORDER = ["GOLD", "SILVER", "NORMAL"] as const;

type TierKey = (typeof TIER_ORDER)[number];

function getTierRank(value?: string | null) {
  return TIER_ORDER.indexOf((value as TierKey) ?? "NORMAL");
}

const TIER_CONFIG: Record<TierKey, { gridClass: string }> = {
  GOLD: {
    gridClass: "grid grid-cols-1 gap-5 lg:grid-cols-2",
  },
  SILVER: {
    gridClass: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
  },
  NORMAL: {
    gridClass: "grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4",
  },
};

export default function ListingResultsClient({
  properties,
  listingMode = "property",
  breadcrumbItems,
  paginationMeta,
  paginationBasePath,
}: {
  properties: Property[] | RentRequest[];
  listingMode?: "property" | "rentRequest";
  breadcrumbItems?: BreadcrumbItem[];
  paginationMeta: PaginationMeta;
  paginationBasePath?: string;
}) {
  const router = useRouter();
  const resolvedPaginationMeta = resolvePaginationClientMeta(paginationMeta);

  const orderedProperties = useMemo(() => {
    if (listingMode === "rentRequest") {
      return [...properties].sort((left, right) => {
        const leftItem = left as RentRequest;
        const rightItem = right as RentRequest;
        if (leftItem.isFeatured !== rightItem.isFeatured) {
          return leftItem.isFeatured ? -1 : 1;
        }
        return (
          new Date(rightItem.createdAt ?? 0).getTime() -
          new Date(leftItem.createdAt ?? 0).getTime()
        );
      }) as RentRequest[];
    }

    return [...properties].sort((left, right) => {
      const leftItem = left as Property;
      const rightItem = right as Property;
      const tierDiff =
        getTierRank(leftItem.priorityStatus) -
        getTierRank(rightItem.priorityStatus);

      if (tierDiff !== 0) return tierDiff;
      if (leftItem.isFeatured !== rightItem.isFeatured) {
        return leftItem.isFeatured ? -1 : 1;
      }

      return (
        new Date(rightItem.createdAt ?? 0).getTime() -
        new Date(leftItem.createdAt ?? 0).getTime()
      );
    }) as Property[];
  }, [listingMode, properties]);

  const totalPages = Math.max(1, resolvedPaginationMeta.totalPage ?? 1);
  const currentPage = Math.min(
    totalPages,
    Math.max(1, resolvedPaginationMeta.currentPage ?? 1),
  );
  const pageItems = orderedProperties;
  const hasItems = pageItems.length > 0;

  const groupedPageItems =
    listingMode === "property"
      ? TIER_ORDER.reduce(
          (accumulator, tier) => {
            accumulator[tier] = (pageItems as Property[]).filter(
              (property) => (property.priorityStatus ?? "NORMAL") === tier,
            );
            return accumulator;
          },
          {} as Record<TierKey, Property[]>,
        )
      : null;

  const handlePageChange = (nextPage: number) => {
    const targetPath = buildPagedPath(paginationBasePath ?? "", nextPage);
    router.replace(targetPath, { scroll: false });
  };

  return (
    <section className="layout-container layout-section-sm">
      {breadcrumbItems?.length ? (
        <DynamicBreadcrumb items={breadcrumbItems} />
      ) : null}

      <div className="flex flex-col gap-10">
        {!hasItems ? (
          <section className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Không có bất động sản phù hợp
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Hãy điều chỉnh bộ lọc khác.
            </p>
          </section>
        ) : null}

        {listingMode === "property" && groupedPageItems
          ? TIER_ORDER.map((tier) => {
              const tierItems = groupedPageItems[tier];

              if (tierItems.length === 0) return null;

              return (
                <section key={tier} className="flex flex-col gap-4">
                  <div className={TIER_CONFIG[tier].gridClass}>
                    {tierItems.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        variant="tier"
                      />
                    ))}
                  </div>
                </section>
              );
            })
          : null}

        {listingMode === "rentRequest" ? (
          <section className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(pageItems as RentRequest[]).map((request) => (
                <RentRequestCard key={request.id} request={request} />
              ))}
            </div>
          </section>
        ) : null}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      </div>
    </section>
  );
}
