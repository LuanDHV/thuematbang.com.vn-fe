"use client";

import { useMemo, useState } from "react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Pagination } from "@/components/common/Pagination";
import { PropertyCard } from "@/components/common/PropertyCard";
import { RentRequestCard } from "@/components/common/RentRequestCard";
import type { BreadcrumbItem } from "@/lib/flat-url";
import { mockProperties } from "@/mocks/properties";
import { Property } from "@/types/property";
import { RentRequest } from "@/types/rent-request";

const PAGE_SIZE = 12;
const TIER_ORDER = ["gold", "silver", "normal"] as const;

type TierKey = (typeof TIER_ORDER)[number];

function getTierRank(value?: string | null) {
  return TIER_ORDER.indexOf((value as TierKey) ?? "normal");
}

const TIER_CONFIG: Record<TierKey, { title: string; gridClass: string }> = {
  gold: {
    title: "Gold",
    gridClass: "grid grid-cols-1 gap-5 lg:grid-cols-2",
  },
  silver: {
    title: "Silver",
    gridClass: "grid grid-cols-1 gap-4 lg:grid-cols-3",
  },
  normal: {
    title: "Tin thường",
    gridClass: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
  },
};

export default function PropertyListingClient({
  properties = mockProperties,
  listingMode = "property",
  breadcrumbItems,
}: {
  properties?: Property[] | RentRequest[];
  listingMode?: "property" | "rentRequest";
  title?: string;
  breadcrumbItems?: BreadcrumbItem[];
}) {
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

  const [page, setPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(orderedProperties.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const pageItems = orderedProperties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const groupedPageItems =
    listingMode === "property"
      ? TIER_ORDER.reduce(
          (accumulator, tier) => {
            accumulator[tier] = (pageItems as Property[]).filter(
              (property) => (property.priorityStatus ?? "normal") === tier,
            );
            return accumulator;
          },
          {} as Record<TierKey, Property[]>,
        )
      : null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8">
      {breadcrumbItems?.length ? (
        <DynamicBreadcrumb items={breadcrumbItems} />
      ) : null}

      <div className="space-y-10">
        {listingMode === "property" && groupedPageItems
          ? TIER_ORDER.map((tier) => {
              const tierItems = groupedPageItems[tier];

              if (tierItems.length === 0) return null;

              return (
                <section key={tier} className="space-y-4">
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
          <section className="space-y-4">
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
          onChange={setPage}
        />
      </div>
    </section>
  );
}
