"use client";

import { useState } from "react";
import { Property } from "@/types/property";
import { RentRequest } from "@/types/rent-request";
import ListingFilterToolbar from "./ListingFilterToolbar";
import ListingResultsClient from "@/components/listing-client/ListingResultsClient";
import {
  type AdvancedFilterValue,
  INITIAL_ADVANCED_FILTER_VALUE,
} from "@/types/filter";
import type { BreadcrumbItem } from "@/lib/flat-url";
import { PaginationMeta } from "@/types/api";
import { resolvePaginationClientMeta } from "@/lib/client-side";

type Props = {
  properties: Property[] | RentRequest[];
  listingMode?: "property" | "rentRequest";
  serverDriven?: boolean;
  basePath: string;
  initialFilters?: AdvancedFilterValue;
  breadcrumbItems?: BreadcrumbItem[];
  paginationMeta?: PaginationMeta;
  paginationBasePath?: string;
};

export default function ListingFilterSection({
  properties,
  listingMode = "property",
  serverDriven = false,
  basePath,
  initialFilters = INITIAL_ADVANCED_FILTER_VALUE,
  breadcrumbItems,
  paginationMeta,
  paginationBasePath,
}: Props) {
  const [filteredProperties, setFilteredProperties] = useState<
    Property[] | RentRequest[]
  >(properties);
  const resolvedPaginationMeta = resolvePaginationClientMeta(paginationMeta);

  return (
    <div className="relative">
      <div className="layout-container sticky top-20 z-40">
        <ListingFilterToolbar
          basePath={basePath}
          listingMode={listingMode}
          serverDriven={serverDriven}
          initialFilters={initialFilters}
          sourceProperties={properties}
          onFilteredChange={setFilteredProperties}
        />
      </div>
      <ListingResultsClient
        properties={serverDriven ? properties : filteredProperties}
        listingMode={listingMode}
        breadcrumbItems={breadcrumbItems}
        paginationMeta={resolvedPaginationMeta}
        paginationBasePath={paginationBasePath ?? basePath}
      />
    </div>
  );
}
