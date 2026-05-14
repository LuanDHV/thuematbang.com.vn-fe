"use client";

import { useState } from "react";
import { Property } from "@/types/property";
import FilterBar from "./FilterBar";
import PropertyListingClient from "@/components/client/PropertyListingClient";
import {
  type AdvancedFilterValue,
  INITIAL_ADVANCED_FILTER_VALUE,
} from "@/types/filter";

type Props = {
  title: string;
  properties: Property[];
  stickyFilter?: boolean;
  basePath: string;
  initialFilters?: AdvancedFilterValue;
};

export default function PropertyFilterSection({
  title,
  properties,
  stickyFilter = false,
  basePath,
  initialFilters = INITIAL_ADVANCED_FILTER_VALUE,
}: Props) {
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(properties);

  const wrapperClass = stickyFilter
    ? "sticky top-16 z-40 mx-auto max-w-7xl"
    : "mx-auto max-w-7xl";

  return (
    <div className="relative">
      <div className={wrapperClass}>
        <FilterBar
          basePath={basePath}
          initialFilters={initialFilters}
          sourceProperties={properties}
          onFilteredChange={setFilteredProperties}
        />
      </div>

      <div className="relative">
        <PropertyListingClient title={title} properties={filteredProperties} />
      </div>
    </div>
  );
}
