"use client";

import { Property } from "@/types/property";
import { RentRequest } from "@/types/rent-request";
import ListingFilterToolbar from "./ListingFilterToolbar";
import ListingResultsClient from "@/components/listing-client/ListingResultsClient";
import {
  type AdvancedFilterValue,
  INITIAL_ADVANCED_FILTER_VALUE,
} from "@/types/filter";
import type { BreadcrumbItem, FlatUrlContext } from "@/lib/listing/flat-url";
import { PaginationMeta } from "@/types/api";
import { resolvePaginationClientMeta } from "@/lib/client-side";

type Props = {
  properties: Property[] | RentRequest[];
  listingMode?: "property" | "rentRequest";
  basePath: string;
  initialFilters?: AdvancedFilterValue;
  initialLocationContext?: FlatUrlContext;
  breadcrumbItems?: BreadcrumbItem[];
  paginationMeta?: PaginationMeta;
  paginationBasePath?: string;
};

export default function ListingFilterSection({
  properties,
  listingMode = "property",
  basePath,
  initialFilters = INITIAL_ADVANCED_FILTER_VALUE,
  initialLocationContext,
  breadcrumbItems,
  paginationMeta,
  paginationBasePath,
}: Props) {
  const resolvedPaginationMeta = resolvePaginationClientMeta(paginationMeta);

  return (
    <section className="relative">
      <div className="layout-container sticky top-20 z-40">
        <ListingFilterToolbar
          basePath={basePath}
          listingMode={listingMode}
          initialFilters={initialFilters}
          initialLocationContext={initialLocationContext}
        />
      </div>

      <ListingResultsClient
        properties={properties}
        listingMode={listingMode}
        breadcrumbItems={breadcrumbItems}
        paginationMeta={resolvedPaginationMeta}
        paginationBasePath={paginationBasePath ?? basePath}
      />
    </section>
  );
}
