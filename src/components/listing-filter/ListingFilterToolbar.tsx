"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getProvinceWardsAction,
  getProvincesAction,
} from "@/actions/location.actions";
import { getPublicSearchSuggestionsAction } from "@/actions/public-search.actions";
import { Button } from "@/components/ui/button";
import { PublicSearchSuggestion } from "@/types/public-search";
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
  resolveAreaSummary,
  resolvePriceSummary,
  toAreaRange,
  toPriceRange,
} from "@/lib/filter/filter-helpers";
import {
  INITIAL_ADVANCED_FILTER_VALUE,
  type AdvancedFilterValue,
} from "@/types/filter";
import {
  buildPagedPath,
  buildPropertyFilterPath,
  type FlatUrlContext,
} from "@/lib/listing/flat-url";
import type { Province, Ward } from "@/types/location";
import {
  buildFlatUrlLocationContext,
  buildProvinceWardMap,
  reconcileLocationFilter,
  type ProvinceWardMap,
} from "@/lib/location/location-filter";

type Props = {
  basePath: string;
  listingMode?: "property" | "rentRequest";
  initialFilters?: AdvancedFilterValue;
  initialLocationContext?: FlatUrlContext;
};

const isSameFilterValue = (
  left: AdvancedFilterValue,
  right: AdvancedFilterValue,
) =>
  left.province === right.province &&
  left.ward === right.ward &&
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
  initialFilters = INITIAL_ADVANCED_FILTER_VALUE,
  initialLocationContext,
}: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [advancedFilters, setAdvancedFilters] =
    useState<AdvancedFilterValue>(initialFilters);
  const lastSyncedInitialFiltersRef = useRef<AdvancedFilterValue | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Server data should stay authoritative when available, but the toolbar still
  // needs the initial server context so slug-derived filters stay stable before
  // the client queries finish loading.
  const { data: provincesData = [] } = useQuery({
    queryKey: ["locations", "provinces"],
    queryFn: getProvincesAction,
    staleTime: 5 * 60 * 1000,
  });

  const fallbackProvinces = useMemo<Province[]>(
    () =>
      (initialLocationContext?.provinces ?? []).map((province) => ({
        id: province.id,
        name: province.name,
        slug: province.slug,
      })),
    [initialLocationContext],
  );

  const fallbackWards = useMemo<Ward[]>(
    () =>
      (initialLocationContext?.wards ?? []).map((ward, index) => ({
        id: -(index + 1),
        name: ward.name,
        slug: ward.slug,
        provinceId: ward.provinceId,
      })),
    [initialLocationContext],
  );

  const resolvedProvinces = provincesData.length
    ? provincesData
    : fallbackProvinces;

  const selectedProvinceId = useMemo(() => {
    if (!advancedFilters.province || !resolvedProvinces.length) return null;
    const selected = resolvedProvinces.find(
      (province) => province.name === advancedFilters.province,
    );
    return selected?.id ?? null;
  }, [advancedFilters.province, resolvedProvinces]);

  const { data: selectedProvinceWards = [] } = useQuery({
    queryKey: ["locations", "wards", selectedProvinceId],
    queryFn: () => getProvinceWardsAction(selectedProvinceId ?? undefined),
    enabled: typeof selectedProvinceId === "number",
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const trimmedDebouncedKeyword = debouncedKeyword.trim();
  const suggestionContextResource =
    listingMode === "rentRequest" ? "rent-request" : "property";
  const { data: suggestions = [], isFetching: isSuggestionsFetching } =
    useQuery({
      queryKey: [
        "public-search-suggestions",
        suggestionContextResource,
        trimmedDebouncedKeyword,
      ],
      queryFn: () =>
        getPublicSearchSuggestionsAction({
          contextResource: suggestionContextResource,
          keyword: trimmedDebouncedKeyword,
          limit: 8,
        }),
      enabled: trimmedDebouncedKeyword.length >= 2,
      staleTime: 30 * 1000,
    });

  const provinceWardMap = useMemo<ProvinceWardMap>(() => {
    return buildProvinceWardMap({
      provinces: resolvedProvinces,
      selectedProvinceId,
      selectedProvinceWards,
      fallbackWards,
    });
  }, [
    fallbackWards,
    resolvedProvinces,
    selectedProvinceId,
    selectedProvinceWards,
  ]);

  const flatUrlContext = useMemo<FlatUrlContext>(() => {
    return buildFlatUrlLocationContext({
      provinces: resolvedProvinces,
      selectedProvinceWards,
      fallbackWards,
    });
  }, [
    fallbackWards,
    resolvedProvinces,
    selectedProvinceWards,
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

  const resolveSuggestionBasePath = (suggestion: PublicSearchSuggestion) =>
    suggestion.targetResource === "rent-request" ? "/can-thue" : "/cho-thue";

  const resolveSuggestionHref = (suggestion: PublicSearchSuggestion) => {
    const basePath = resolveSuggestionBasePath(suggestion);
    return suggestion.flatSlug
      ? `${basePath}/${suggestion.flatSlug}`
      : basePath;
  };

  const navigateToSuggestion = (suggestion: PublicSearchSuggestion) => {
    setIsSuggestionOpen(false);
    setActiveSuggestionIndex(0);
    router.replace(resolveSuggestionHref(suggestion), { scroll: false });
  };

  // All URL sync goes through the same builder so pagination, breadcrumbs, and
  // autocomplete links remain aligned with the flat-url contract.
  const runFilter = (
    nextFilters?: AdvancedFilterValue,
    options?: { syncUrl?: boolean; targetBasePath?: string },
  ) => {
    const activeFilters = nextFilters ?? advancedFilters;
    const nextBasePath = options?.targetBasePath ?? basePath;

    if (options?.syncUrl !== false) {
      router.replace(
        buildPagedPath(
          buildPropertyFilterPath(nextBasePath, activeFilters, flatUrlContext),
          1,
        ),
        {
          scroll: false,
        },
      );
    }
  };

  const resetAll = () => {
    setKeyword("");
    setAdvancedFilters(INITIAL_ADVANCED_FILTER_VALUE);
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
  }, [initialFilters, provinceWardMap]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [keyword]);

  useEffect(() => {
    if (trimmedDebouncedKeyword.length < 2) {
      queueMicrotask(() => {
        setIsSuggestionOpen(false);
        setActiveSuggestionIndex(0);
      });
      return;
    }

    queueMicrotask(() => {
      setIsSuggestionOpen(true);
      setActiveSuggestionIndex(0);
    });
  }, [trimmedDebouncedKeyword]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchContainerRef.current) {
        return;
      }

      if (!searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const showSuggestions =
    isSuggestionOpen &&
    trimmedDebouncedKeyword.length >= 2 &&
    (isSuggestionsFetching || suggestions.length > 0);
  const showEmptySuggestions =
    isSuggestionOpen &&
    trimmedDebouncedKeyword.length >= 2 &&
    !isSuggestionsFetching &&
    suggestions.length === 0;

  return (
    <div className="surface-float rounded-lg transition-all duration-300">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const firstSuggestion =
            suggestions[activeSuggestionIndex] ?? suggestions[0];
          if (trimmedDebouncedKeyword.length >= 2 && firstSuggestion) {
            navigateToSuggestion(firstSuggestion);
            return;
          }
          runFilter();
        }}
        className="flex flex-col gap-3 p-2.5 lg:flex-row lg:items-center lg:gap-2"
      >
        <div className="flex w-full items-center gap-2 lg:w-auto lg:flex-1">
          <div
            ref={searchContainerRef}
            className="relative flex min-w-0 flex-1 items-center"
          >
            <div
              className={`focus-within:border-primary/25 relative flex min-w-0 flex-1 items-center border border-black/8 bg-white px-2 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-all focus-within:shadow-[0_12px_28px_rgba(247,170,27,0.12)] ${
                isSuggestionOpen && trimmedDebouncedKeyword.length >= 2
                  ? "rounded-t-lg rounded-b-none border-b-transparent"
                  : "rounded-lg"
              }`}
            >
              <Search className="text-secondary ml-2 size-5 shrink-0 opacity-80" />
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onFocus={() => {
                  if (keyword.trim().length >= 2) {
                    setIsSuggestionOpen(true);
                  }
                }}
                onKeyDown={(event) => {
                  if (!isSuggestionOpen || trimmedDebouncedKeyword.length < 2) {
                    return;
                  }

                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    if (!suggestions.length) {
                      return;
                    }

                    setActiveSuggestionIndex((prev) =>
                      prev >= suggestions.length - 1 ? 0 : prev + 1,
                    );
                    return;
                  }

                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    if (!suggestions.length) {
                      return;
                    }

                    setActiveSuggestionIndex((prev) =>
                      prev <= 0 ? suggestions.length - 1 : prev - 1,
                    );
                    return;
                  }

                  if (event.key === "Escape") {
                    setIsSuggestionOpen(false);
                  }
                }}
                placeholder="Bạn muốn thuê ở đâu?"
                className="text-body placeholder:text-secondary h-10 w-full border-none bg-transparent pr-10 pl-3 text-sm font-medium outline-none focus:ring-0"
              />
              {isSuggestionsFetching ? (
                <LoaderCircle className="text-secondary mr-2 size-4 shrink-0 animate-spin opacity-75" />
              ) : null}
            </div>

            {showSuggestions ? (
              <div className="absolute top-full left-0 z-50 w-full overflow-hidden rounded-b-lg border-x border-b border-black/8 bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
                <ul className="[&::-webkit-scrollbar-thumb]:bg-primary/30 max-h-80 overflow-y-auto py-1.5 pr-1 [scrollbar-color:rgba(247,170,27,0.3)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => {
                      const isActive = index === activeSuggestionIndex;

                      return (
                        <li
                          key={`${suggestion.targetResource}-${suggestion.flatSlug}`}
                        >
                          <button
                            type="button"
                            onMouseEnter={() => setActiveSuggestionIndex(index)}
                            onClick={() => navigateToSuggestion(suggestion)}
                            className={`flex w-full items-center px-4 py-2.5 text-left transition-colors ${
                              isActive
                                ? "bg-primary/6 text-primary"
                                : "text-body hover:bg-primary/5"
                            }`}
                          >
                            <span className="min-w-0 flex-1 cursor-pointer truncate text-sm font-medium">
                              {suggestion.label}
                            </span>
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-secondary flex items-center gap-2 px-4 py-3 text-sm">
                      <LoaderCircle className="size-4 animate-spin" />
                      Đang tải...
                    </li>
                  )}
                </ul>
              </div>
            ) : null}

            {showEmptySuggestions ? (
              <div className="text-secondary absolute top-full left-0 z-50 w-full rounded-b-lg border-x border-b border-black/8 bg-white px-4 py-3 text-sm shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
                Không tìm thấy gợi ý phù hợp.
              </div>
            ) : null}
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
                (advancedFilters.province || advancedFilters.ward ? 1 : 0) +
                advancedFilters.bedrooms.length +
                advancedFilters.bathrooms.length +
                advancedFilters.directions.length
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
