"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { PropertyFilterDrawer } from "./PropertyFilterDrawer";
import {
  AreaDetailTab,
  PriceDetailTab,
  PropertyTypeDetailTab,
} from "./PropertyFilterPanels";
import { PropertyFilterChipPopover } from "./PropertyFilterChipPopover";
import {
  mockFilterAreaOptions,
  mockFilterPriceOptions,
  mockFilterPropertyTypes,
} from "@/mocks/filter";
import { mockCities, mockStreets, mockWards } from "@/mocks/locations";
import {
  parseNumericInput,
  resolveAreaSummary,
  resolvePriceSummary,
  toAreaRange,
  toPriceRange,
} from "@/helpers/filterHelpers";
import {
  INITIAL_ADVANCED_FILTER_VALUE,
  type AdvancedFilterValue,
} from "@/types/filter";
import { buildPropertyFilterPath } from "@/lib/flat-url";

type Props = {
  basePath: string;
  initialFilters?: AdvancedFilterValue;
  sourceProperties: Property[];
  onFilteredChange: (items: Property[]) => void;
};

const cityMap = mockCities.reduce<Record<string, Record<string, string[]>>>(
  (accumulator, city) => {
    const cityWards = mockWards.filter((ward) => ward.cityId === city.id);
    accumulator[city.name] = cityWards.reduce<Record<string, string[]>>(
      (wardAccumulator, ward) => {
        wardAccumulator[ward.name] = mockStreets
          .filter((street) => street.wardId === ward.id)
          .map((street) => street.name);
        return wardAccumulator;
      },
      {},
    );
    return accumulator;
  },
  {},
);

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export default function PropertyFilterToolbar({
  basePath,
  initialFilters = INITIAL_ADVANCED_FILTER_VALUE,
  sourceProperties,
  onFilteredChange,
}: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [advancedFilters, setAdvancedFilters] =
    useState<AdvancedFilterValue>(initialFilters);

  const displayTypeLabel =
    advancedFilters.propertyTypes.length > 0
      ? advancedFilters.propertyTypes.length === 1
        ? advancedFilters.propertyTypes[0]
        : `${advancedFilters.propertyTypes.length} loại`
      : "Loại BĐS";

  const displayPriceLabel = useMemo(() => {
    const summary = resolvePriceSummary(
      advancedFilters,
      mockFilterPriceOptions,
    );
    return summary === "Tất cả" ? "Mức giá" : summary;
  }, [advancedFilters]);

  const displayAreaLabel = useMemo(() => {
    const summary = resolveAreaSummary(advancedFilters, mockFilterAreaOptions);
    return summary === "Tất cả" ? "Diện tích" : summary;
  }, [advancedFilters]);

  const updateAdvanced = (
    updater: (prev: AdvancedFilterValue) => AdvancedFilterValue,
  ) => {
    setAdvancedFilters((prev) => updater(prev));
  };

  const getFilteredProperties = (activeFilters: AdvancedFilterValue) => {
    const keywordText = normalize(keyword);
    const minPrice = parseNumericInput(activeFilters.priceMin || "");
    const maxPrice = parseNumericInput(activeFilters.priceMax || "");
    const minArea = Number(activeFilters.areaMin || 0);
    const maxArea = Number(activeFilters.areaMax || 0);

    const filtered = sourceProperties.filter((property) => {
      const categoryName = property.category?.name ?? "";
      const cityName = property.city?.name ?? "";
      const wardName = property.ward?.name ?? "";
      const streetName = property.street?.name ?? "";
      const haystack = normalize(
        `${property.title} ${property.addressDetail ?? ""} ${categoryName} ${cityName} ${wardName} ${streetName}`,
      );

      if (keywordText && !haystack.includes(keywordText)) return false;

      if (activeFilters.propertyTypes.length > 0) {
        const normalizedCategory = normalize(categoryName);
        const matched = activeFilters.propertyTypes.some(
          (type) => normalizedCategory === normalize(type),
        );
        if (!matched) return false;
      }

      const priceValue = Number(property.price || 0);
      if (minPrice > 0 && priceValue < minPrice) return false;
      if (maxPrice > 0 && priceValue > maxPrice) return false;

      const areaValue = property.area ?? 0;
      if (minArea > 0 && areaValue < minArea) return false;
      if (maxArea > 0 && areaValue > maxArea) return false;

      if (activeFilters.city && property.city?.name !== activeFilters.city)
        return false;
      if (activeFilters.ward && property.ward?.name !== activeFilters.ward)
        return false;
      if (
        activeFilters.street &&
        property.street?.name !== activeFilters.street
      )
        return false;

      if (activeFilters.bedrooms.length > 0) {
        const bedMatched = activeFilters.bedrooms.some((item) => {
          if (item === "5+") return (property.bedrooms ?? 0) >= 5;
          return String(property.bedrooms ?? 0) === item;
        });
        if (!bedMatched) return false;
      }

      if (activeFilters.bathrooms.length > 0) {
        const bathMatched = activeFilters.bathrooms.some((item) => {
          if (item === "5+") return (property.bathrooms ?? 0) >= 5;
          return String(property.bathrooms ?? 0) === item;
        });
        if (!bathMatched) return false;
      }

      if (activeFilters.directions.length > 0) {
        const direction = (property.direction ?? "").toString().toUpperCase();
        if (!activeFilters.directions.includes(direction)) return false;
      }

      if (activeFilters.negotiable && !property.isNegotiable) return false;
      return true;
    });

    return filtered;
  };

  const runFilter = (
    nextFilters?: AdvancedFilterValue,
    options?: { syncUrl?: boolean },
  ) => {
    const activeFilters = nextFilters ?? advancedFilters;
    onFilteredChange(getFilteredProperties(activeFilters));

    if (options?.syncUrl !== false) {
      router.replace(buildPropertyFilterPath(basePath, activeFilters), {
        scroll: false,
      });
    }
  };

  const resetAll = () => {
    setKeyword("");
    setAdvancedFilters(INITIAL_ADVANCED_FILTER_VALUE);
    onFilteredChange(sourceProperties);
    router.replace(basePath, { scroll: false });
  };

  useEffect(() => {
    onFilteredChange(getFilteredProperties(initialFilters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters, sourceProperties]);

  return (
    <div className="mx-auto max-w-7xl rounded-lg bg-white shadow backdrop-blur-md transition-all duration-300">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          runFilter();
        }}
        className="flex flex-col gap-3 p-2 lg:flex-row lg:items-center lg:gap-2"
      >
        <div className="flex w-full items-center gap-2 lg:w-auto lg:flex-1">
          <div className="relative flex min-w-0 flex-1 items-center rounded-xl px-2">
            <Search className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Bạn muốn thuê ở đâu?"
              className="h-10 w-full border-none bg-transparent pr-4 pl-3 text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 focus:ring-0"
            />
          </div>

          <Button
            type="submit"
            className="bg-primary flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-xl px-4 font-bold text-white shadow-md transition-all hover:brightness-105 lg:hidden"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex w-full items-center gap-2 lg:w-auto">
          <div className="shrink-0">
            <PropertyFilterDrawer
              filterCount={
                advancedFilters.propertyTypes.length +
                (advancedFilters.priceMin ||
                advancedFilters.priceMax ||
                advancedFilters.negotiable
                  ? 1
                  : 0) +
                (advancedFilters.areaMin || advancedFilters.areaMax ? 1 : 0) +
                (advancedFilters.city ||
                advancedFilters.ward ||
                advancedFilters.street
                  ? 1
                  : 0)
              }
              propertyTypeOptions={mockFilterPropertyTypes}
              cityMap={cityMap}
              value={advancedFilters}
              onApply={(value) => {
                setAdvancedFilters(value);
                runFilter(value);
              }}
              onReset={resetAll}
            />
          </div>

          <div className="mx-1 h-6 w-px shrink-0 bg-gray-200" />

          <div className="[&::-webkit-scrollbar-thumb]:bg-primary/35 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 lg:w-auto lg:flex-none lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            <PropertyFilterChipPopover
              title="Loại bất động sản"
              label={displayTypeLabel}
              isActive={advancedFilters.propertyTypes.length > 0}
              onReset={() => {
                const next = { ...advancedFilters, propertyTypes: [] };
                setAdvancedFilters(next);
                runFilter(next);
              }}
              onApply={runFilter}
            >
              <PropertyTypeDetailTab
                current={advancedFilters}
                updateCurrent={updateAdvanced}
                propertyTypeOptions={mockFilterPropertyTypes}
              />
            </PropertyFilterChipPopover>

            <PropertyFilterChipPopover
              title="Khoảng giá"
              label={displayPriceLabel}
              isActive={
                !!advancedFilters.priceMin ||
                !!advancedFilters.priceMax ||
                advancedFilters.negotiable
              }
              onReset={() => {
                const next = {
                  ...advancedFilters,
                  priceMin: "",
                  priceMax: "",
                  negotiable: false,
                };
                setAdvancedFilters(next);
                runFilter(next);
              }}
              onApply={runFilter}
            >
              <PriceDetailTab
                current={advancedFilters}
                updateCurrent={updateAdvanced}
                priceRange={toPriceRange(
                  advancedFilters.priceMin,
                  advancedFilters.priceMax,
                )}
              />
            </PropertyFilterChipPopover>

            <PropertyFilterChipPopover
              title="Diện tích"
              label={displayAreaLabel}
              isActive={!!advancedFilters.areaMin || !!advancedFilters.areaMax}
              onReset={() => {
                const next = { ...advancedFilters, areaMin: "", areaMax: "" };
                setAdvancedFilters(next);
                runFilter(next);
              }}
              onApply={runFilter}
            >
              <AreaDetailTab
                current={advancedFilters}
                updateCurrent={updateAdvanced}
                areaRange={toAreaRange(
                  advancedFilters.areaMin,
                  advancedFilters.areaMax,
                )}
              />
            </PropertyFilterChipPopover>

            <Button
              type="button"
              onClick={resetAll}
              className="border-primary text-primary hover:bg-primary/10 hidden h-10 cursor-pointer rounded-xl border bg-transparent px-4 lg:flex"
            >
              Đặt lại
            </Button>

            <Button
              type="submit"
              className="bg-primary ml-auto hidden h-10 shrink-0 cursor-pointer items-center rounded-xl px-6 font-bold text-white shadow-md transition-all hover:brightness-105 lg:flex"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Tìm kiếm</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
