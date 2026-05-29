"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { RentRequest } from "@/types/rent-request";
import { ListingFilterDrawer } from "./ListingFilterDrawer";
import {
  AreaDetailTab,
  PriceDetailTab,
  PropertyTypeDetailTab,
} from "./ListingFilterPanels";
import { ListingFilterChipPopover } from "./ListingFilterChipPopover";
import {
  mockFilterAreaOptions,
  mockFilterPriceOptions,
  mockFilterPropertyTypes,
} from "@/constants/filter";
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
import { buildPagedPath, buildPropertyFilterPath } from "@/lib/flat-url";
import { locationService } from "@/services/location.service";
import { Province, Ward } from "@/types/location";

type Props = {
  basePath: string;
  listingMode?: "property" | "rentRequest";
  serverDriven?: boolean;
  initialFilters?: AdvancedFilterValue;
  sourceProperties: Property[] | RentRequest[];
  onFilteredChange: (items: Property[] | RentRequest[]) => void;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const reconcileLocationFilter = (
  value: AdvancedFilterValue,
  provinceWardMap: Record<string, Record<string, string[]>>,
): AdvancedFilterValue => {
  const provinceEntries = Object.keys(provinceWardMap);
  if (!provinceEntries.length) return value;

  const matchedProvince =
    provinceEntries.find(
      (province) => normalize(province) === normalize(value.province),
    ) ?? "";

  if (!matchedProvince) {
    return {
      ...value,
      province: "",
      ward: "",
      street: "",
    };
  }

  const wardEntries = Object.keys(provinceWardMap[matchedProvince] ?? {});
  const matchedWard =
    wardEntries.find((ward) => normalize(ward) === normalize(value.ward)) ?? "";

  return {
    ...value,
    province: matchedProvince,
    ward: matchedWard,
    street: matchedWard ? value.street : "",
  };
};

const isSameFilterValue = (
  left: AdvancedFilterValue,
  right: AdvancedFilterValue,
) =>
  left.province === right.province &&
  left.ward === right.ward &&
  left.street === right.street &&
  left.priceMin === right.priceMin &&
  left.priceMax === right.priceMax &&
  left.negotiable === right.negotiable &&
  left.areaMin === right.areaMin &&
  left.areaMax === right.areaMax &&
  left.propertyTypes.join("|") === right.propertyTypes.join("|") &&
  left.bedrooms.join("|") === right.bedrooms.join("|") &&
  left.bathrooms.join("|") === right.bathrooms.join("|") &&
  left.directions.join("|") === right.directions.join("|");

export default function ListingFilterToolbar({
  basePath,
  listingMode = "property",
  serverDriven = false,
  initialFilters = INITIAL_ADVANCED_FILTER_VALUE,
  sourceProperties,
  onFilteredChange,
}: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [advancedFilters, setAdvancedFilters] =
    useState<AdvancedFilterValue>(initialFilters);
  const lastSyncedInitialFiltersRef = useRef<AdvancedFilterValue | null>(null);

  const { data: provincesData = [] } = useQuery({
    queryKey: ["locations", "provinces"],
    queryFn: () => locationService.getProvinces(),
    staleTime: 5 * 60 * 1000,
  });
  const selectedProvinceId = useMemo(() => {
    if (!advancedFilters.province || !provincesData.length) return null;
    const selected = provincesData.find(
      (province) => province.name === advancedFilters.province,
    );
    return selected?.id ?? null;
  }, [advancedFilters.province, provincesData]);

  const { data: selectedProvinceWards = [] } = useQuery({
    queryKey: ["locations", "wards", selectedProvinceId],
    queryFn: () => locationService.getWards(selectedProvinceId ?? undefined),
    enabled: typeof selectedProvinceId === "number",
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const sourceLocationMap = useMemo(() => {
    const provinceMap = new Map<string, Province>();
    const wardMap = new Map<string, Ward[]>();

    for (const item of sourceProperties) {
      const province =
        listingMode === "rentRequest"
          ? (item as RentRequest).desiredProvince
          : (item as Property).province;
      const ward =
        listingMode === "rentRequest"
          ? (item as RentRequest).desiredWard
          : (item as Property).ward;

      if (province?.name && !provinceMap.has(province.name)) {
        provinceMap.set(province.name, {
          id: province.id,
          name: province.name,
          slug: province.slug,
        });
      }
      if (province?.name && ward?.name) {
        const existing = wardMap.get(province.name) ?? [];
        if (!existing.some((x) => x.name === ward.name)) {
          existing.push({
            id: ward.id,
            provinceId: ward.provinceId,
            name: ward.name,
            slug: ward.slug,
          });
          wardMap.set(province.name, existing);
        }
      }
    }

    return { provinceMap, wardMap };
  }, [listingMode, sourceProperties]);

  const provinceWardMap = useMemo<
    Record<string, Record<string, string[]>>
  >(() => {
    const provinces = provincesData.length
      ? provincesData
      : Array.from(sourceLocationMap.provinceMap.values());
    const sourceWardsByProvince = sourceLocationMap.wardMap;

    return provinces.reduce<Record<string, Record<string, string[]>>>(
      (acc, province) => {
        const sourceWards = sourceWardsByProvince.get(province.name) ?? [];
        const wardsForProvince =
          selectedProvinceId === province.id
            ? selectedProvinceWards
            : sourceWards;

        acc[province.name] = wardsForProvince.reduce<Record<string, string[]>>(
          (wardAcc, ward) => {
            wardAcc[ward.name] = [];
            return wardAcc;
          },
          {},
        );

        return acc;
      },
      {},
    );
  }, [
    provincesData,
    selectedProvinceId,
    selectedProvinceWards,
    sourceLocationMap.provinceMap,
    sourceLocationMap.wardMap,
  ]);

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

    const filtered =
      listingMode === "rentRequest"
        ? (sourceProperties as RentRequest[]).filter((request) => {
            const categoryName = request.category?.name ?? "";
            const cityName = request.desiredProvince?.name ?? "";
            const wardName = request.desiredWard?.name ?? "";
            const streetName = request.desiredStreet?.name ?? "";
            const haystack = normalize(
              `${request.title} ${request.requirementText ?? ""} ${categoryName} ${cityName} ${wardName} ${streetName}`,
            );

            if (keywordText && !haystack.includes(keywordText)) return false;

            if (activeFilters.propertyTypes.length > 0) {
              const normalizedCategory = normalize(categoryName);
              const matched = activeFilters.propertyTypes.some(
                (type) => normalizedCategory === normalize(type),
              );
              if (!matched) return false;
            }

            const requestMinBudget = Number(request.minBudget || 0);
            const requestMaxBudget = Number(request.maxBudget || 0);
            if (
              minPrice > 0 &&
              requestMaxBudget > 0 &&
              requestMaxBudget < minPrice
            )
              return false;
            if (maxPrice > 0 && requestMinBudget > maxPrice) return false;

            const requestMinArea = request.minArea ?? 0;
            const requestMaxArea = request.maxArea ?? 0;
            if (minArea > 0 && requestMaxArea > 0 && requestMaxArea < minArea)
              return false;
            if (maxArea > 0 && requestMinArea > maxArea) return false;

            if (
              activeFilters.province &&
              request.desiredProvince?.name !== activeFilters.province
            )
              return false;
            if (
              activeFilters.ward &&
              request.desiredWard?.name !== activeFilters.ward
            )
              return false;

            if (activeFilters.directions.length > 0) {
              const direction = (request.preferredDirection ?? "")
                .toString()
                .toUpperCase();
              if (!activeFilters.directions.includes(direction)) return false;
            }

            return true;
          })
        : (sourceProperties as Property[]).filter((property) => {
            const categoryName = property.category?.name ?? "";
            const cityName = property.province?.name ?? "";
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

            if (
              activeFilters.province &&
              property.province?.name !== activeFilters.province
            )
              return false;
            if (
              activeFilters.ward &&
              property.ward?.name !== activeFilters.ward
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
              const direction = (property.direction ?? "")
                .toString()
                .toUpperCase();
              if (!activeFilters.directions.includes(direction)) return false;
            }

            if (activeFilters.negotiable && !property.isNegotiable)
              return false;
            return true;
          });

    return filtered;
  };

  const runFilter = (
    nextFilters?: AdvancedFilterValue,
    options?: { syncUrl?: boolean; targetBasePath?: string },
  ) => {
    const activeFilters = nextFilters ?? advancedFilters;
    const nextBasePath = options?.targetBasePath ?? basePath;
    if (!serverDriven) {
      onFilteredChange(getFilteredProperties(activeFilters));
    }

    if (options?.syncUrl !== false) {
      router.replace(
        buildPagedPath(buildPropertyFilterPath(nextBasePath, activeFilters), 1),
        {
          scroll: false,
        },
      );
    }
  };

  const resetAll = () => {
    setKeyword("");
    setAdvancedFilters(INITIAL_ADVANCED_FILTER_VALUE);
    if (!serverDriven) {
      onFilteredChange(sourceProperties);
    }
    router.replace(buildPagedPath(basePath, 1), { scroll: false });
  };

  useEffect(() => {
    const nextFilters = reconcileLocationFilter(
      initialFilters,
      provinceWardMap,
    );
    const lastSynced = lastSyncedInitialFiltersRef.current;
    if (lastSynced && isSameFilterValue(lastSynced, nextFilters)) {
      return;
    }
    lastSyncedInitialFiltersRef.current = nextFilters;

    queueMicrotask(() => {
      setAdvancedFilters((prev) =>
        isSameFilterValue(prev, nextFilters) ? prev : nextFilters,
      );
    });

    if (serverDriven) return;
    onFilteredChange(getFilteredProperties(nextFilters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters, provinceWardMap, serverDriven, sourceProperties]);

  return (
    <div className="surface-float rounded-lg transition-all duration-300">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          runFilter();
        }}
        className="flex flex-col gap-3 p-2.5 lg:flex-row lg:items-center lg:gap-2"
      >
        <div className="flex w-full items-center gap-2 lg:w-auto lg:flex-1">
          <div className="relative flex min-w-0 flex-1 items-center rounded-lg bg-white/72 px-2">
            <Search className="ml-2 size-5 shrink-0 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Bạn muốn thuê ở đâu?"
              className="text-body placeholder:text-secondary h-10 w-full border-none bg-transparent pr-4 pl-3 text-sm font-medium outline-none focus:ring-0"
            />
          </div>

          <Button
            type="submit"
            className="flex h-10 shrink-0 items-center justify-center rounded-lg px-4 lg:hidden"
          >
            <Search className="size-5" />
          </Button>
        </div>

        <div className="flex w-full items-center gap-2 lg:w-auto">
          <div className="shrink-0">
            <ListingFilterDrawer
              filterCount={
                advancedFilters.propertyTypes.length +
                (advancedFilters.priceMin ||
                advancedFilters.priceMax ||
                advancedFilters.negotiable
                  ? 1
                  : 0) +
                (advancedFilters.areaMin || advancedFilters.areaMax ? 1 : 0) +
                (advancedFilters.province || advancedFilters.ward ? 1 : 0)
              }
              defaultDemandTab={
                listingMode === "rentRequest" ? "can-thue" : "cho-thue"
              }
              listingMode={listingMode}
              propertyTypeOptions={mockFilterPropertyTypes}
              provinceWardMap={provinceWardMap}
              value={advancedFilters}
              onApply={(value, demandTab) => {
                setAdvancedFilters(value);
                const targetBasePath =
                  demandTab === "can-thue" ? "/can-thue" : "/cho-thue";
                runFilter(value, { targetBasePath });
              }}
              onReset={resetAll}
            />
          </div>

          <div className="mx-1 h-6 w-px shrink-0 bg-black/6" />

          <div className="[&::-webkit-scrollbar-thumb]:bg-primary/35 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 lg:w-auto lg:flex-none lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            <ListingFilterChipPopover
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
            </ListingFilterChipPopover>

            <ListingFilterChipPopover
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
            </ListingFilterChipPopover>

            <ListingFilterChipPopover
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
            </ListingFilterChipPopover>

            <Button
              type="button"
              onClick={resetAll}
              className="hidden h-10 px-4 lg:flex"
            >
              Đặt lại
            </Button>

            <Button
              type="submit"
              className="ml-auto hidden h-10 shrink-0 items-center rounded-lg px-6 lg:flex"
            >
              <Search className="mr-2 size-5" />
              <span>Tìm kiếm</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

