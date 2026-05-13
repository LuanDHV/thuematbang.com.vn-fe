"use client";

import { useState } from "react";
import { Property } from "@/types/property";
import FilterBar from "./FilterBar";
import ByFilter from "../cho-thue/ByFilter";

type Props = {
  title: string;
  properties: Property[];
  stickyFilter?: boolean;
};

export default function PropertyFilterSection({
  title,
  properties,
  stickyFilter = false,
}: Props) {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(
    properties,
  );

  const wrapperClass = stickyFilter
    ? "sticky top-16 z-40 mx-auto max-w-7xl"
    : "mx-auto max-w-7xl";

  return (
    <div className="relative">
      <div className={wrapperClass}>
        <FilterBar
          sourceProperties={properties}
          onFilteredChange={setFilteredProperties}
        />
      </div>

      <div className="relative">
        <ByFilter title={title} properties={filteredProperties} />
      </div>
    </div>
  );
}
