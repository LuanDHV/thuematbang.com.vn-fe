"use client";

import { useMemo, useState } from "react";
import { Pagination } from "../common/Pagination";
import Title from "../common/Title";
import { PropertyCard } from "../common/PropertyCard";
import { Property } from "@/types/property";
import { mockProperties } from "../../mocks/properties";

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

export default function ByFilter({
  properties = mockProperties,
  title = "Cho thuê bất động sản",
}: {
  properties?: Property[];
  title?: string;
}) {
  const orderedProperties = useMemo(() => {
    return [...properties].sort((left, right) => {
      const tierDiff =
        getTierRank(left.priorityStatus) - getTierRank(right.priorityStatus);

      if (tierDiff !== 0) return tierDiff;
      if (left.isFeatured !== right.isFeatured) {
        return left.isFeatured ? -1 : 1;
      }

      return (
        new Date(right.createdAt ?? 0).getTime() -
        new Date(left.createdAt ?? 0).getTime()
      );
    });
  }, [properties]);

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

  const groupedPageItems = TIER_ORDER.reduce(
    (accumulator, tier) => {
      accumulator[tier] = pageItems.filter(
        (property) => (property.priorityStatus ?? "normal") === tier,
      );
      return accumulator;
    },
    {} as Record<TierKey, Property[]>,
  );

  return (
    <section className="w-full bg-gray-50/50 py-12 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        <Title title={title} />

        <div className="space-y-10">
          {TIER_ORDER.map((tier) => {
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
          })}

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </div>
    </section>
  );
}
