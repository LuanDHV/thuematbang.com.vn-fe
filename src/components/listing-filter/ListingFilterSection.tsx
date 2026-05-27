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

type Props = {
  title: string;
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
  title,
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

  return (
    <div className="relative">
      <div className="sticky top-16 z-40 mx-auto max-w-7xl">
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
        title={title}
        properties={serverDriven ? properties : filteredProperties}
        listingMode={listingMode}
        breadcrumbItems={breadcrumbItems}
        paginationMeta={paginationMeta}
        paginationBasePath={paginationBasePath ?? basePath}
      />
    </div>
  );
}
