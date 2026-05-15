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

type Props = {
  title: string;
  properties: Property[] | RentRequest[];
  listingMode?: "property" | "rentRequest";
  basePath: string;
  initialFilters?: AdvancedFilterValue;
  breadcrumbItems?: BreadcrumbItem[];
};

export default function ListingFilterSection({
  title,
  properties,
  listingMode = "property",
  basePath,
  initialFilters = INITIAL_ADVANCED_FILTER_VALUE,
  breadcrumbItems,
}: Props) {
  const [filteredProperties, setFilteredProperties] =
    useState<Property[] | RentRequest[]>(properties);

  return (
    <div className="relative">
      <div className="sticky top-16 z-40 mx-auto max-w-7xl">
        <ListingFilterToolbar
          basePath={basePath}
          listingMode={listingMode}
          initialFilters={initialFilters}
          sourceProperties={properties}
          onFilteredChange={setFilteredProperties}
        />
      </div>
      <ListingResultsClient
        title={title}
        properties={filteredProperties}
        listingMode={listingMode}
        breadcrumbItems={breadcrumbItems}
      />
    </div>
  );
}
