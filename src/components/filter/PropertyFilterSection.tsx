"use client";

import { useState } from "react";
import { Property } from "@/types/property";
import PropertyFilterToolbar from "./PropertyFilterToolbar";
import PropertyListingClient from "@/components/client/PropertyListingClient";
import {
  type AdvancedFilterValue,
  INITIAL_ADVANCED_FILTER_VALUE,
} from "@/types/filter";
import type { BreadcrumbItem } from "@/lib/flat-url";

type Props = {
  title: string;
  properties: Property[];
  basePath: string;
  initialFilters?: AdvancedFilterValue;
  breadcrumbItems?: BreadcrumbItem[];
};

export default function PropertyFilterSection({
  title,
  properties,
  basePath,
  initialFilters = INITIAL_ADVANCED_FILTER_VALUE,
  breadcrumbItems,
}: Props) {
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(properties);

  return (
    <div className="relative">
      <div className="sticky top-16 z-40 mx-auto max-w-7xl">
        <PropertyFilterToolbar
          basePath={basePath}
          initialFilters={initialFilters}
          sourceProperties={properties}
          onFilteredChange={setFilteredProperties}
        />
      </div>
      <PropertyListingClient
        title={title}
        properties={filteredProperties}
        breadcrumbItems={breadcrumbItems}
      />
    </div>
  );
}
