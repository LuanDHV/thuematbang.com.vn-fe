"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import {
  mockFilterAreaOptions,
  mockFilterPriceOptions,
} from "@/constants/filter";
import {
  INITIAL_ADVANCED_FILTER_VALUE,
  type AdvancedFilterValue,
} from "@/types/filter";
import {
  resolveAreaSummary,
  resolvePriceSummary,
  toAreaRange,
  toPriceRange,
} from "@/lib/filter/filter-helpers";
import {
  getProvinceWardsAction,
  getProvincesAction,
} from "@/actions/location.actions";
import {
  AdvancedMainTab,
  AreaDetailTab,
  LocationDetailTab,
  PriceDetailTab,
  PropertyTypeDetailTab,
} from "./ListingFilterPanels";
import {
  buildEffectiveProvinceWardMap,
  type ProvinceWardMap,
} from "@/lib/location/location-filter";

type DemandTab = "cho-thue" | "can-thue";
type DetailTab = "main" | "propertyType" | "location" | "price" | "area";

type Props = {
  filterCount?: number;
  defaultDemandTab?: DemandTab;
  listingMode?: "property" | "rentRequest";
  propertyTypeOptions: string[];
  provinceWardMap: ProvinceWardMap;
  value?: AdvancedFilterValue;
  onApply?: (value: AdvancedFilterValue, demandTab: DemandTab) => void;
  onReset?: () => void;
};

export { AreaDetailTab, PriceDetailTab, PropertyTypeDetailTab };
export type { AdvancedFilterValue };

export function ListingFilterDrawer({
  filterCount = 0,
  defaultDemandTab = "cho-thue",
  listingMode = "property",
  propertyTypeOptions,
  provinceWardMap,
  value,
  onApply,
  onReset,
}: Props) {
  const [open, setOpen] = useState(false);
  const [demandTab, setDemandTab] = useState<DemandTab>(defaultDemandTab);
  const [detailTab, setDetailTab] = useState<DetailTab>("main");
  const [localValue, setLocalValue] = useState<AdvancedFilterValue>(
    value ?? INITIAL_ADVANCED_FILTER_VALUE,
  );

  const { data: provincesData = [] } = useQuery({
    queryKey: ["locations", "provinces"],
    queryFn: getProvincesAction,
    staleTime: 5 * 60 * 1000,
  });

  const selectedProvinceId = useMemo(() => {
    if (!localValue.province || !provincesData.length) return null;

    const selectedProvince = provincesData.find(
      (province) => province.name === localValue.province,
    );

    return selectedProvince?.id ?? null;
  }, [localValue.province, provincesData]);

  const { data: selectedProvinceWards = [] } = useQuery({
    queryKey: ["locations", "wards", "drawer", selectedProvinceId],
    queryFn: () => getProvinceWardsAction(selectedProvinceId ?? undefined),
    enabled: typeof selectedProvinceId === "number",
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  // The drawer can fetch a richer ward list for the selected province without
  // mutating the shared toolbar map for every unopened province.
  const effectiveProvinceWardMap = useMemo(() => {
    return buildEffectiveProvinceWardMap(
      provinceWardMap,
      localValue.province,
      selectedProvinceWards,
    );
  }, [localValue.province, provinceWardMap, selectedProvinceWards]);

  const current = localValue;
  const updateCurrent = (
    updater: (prev: AdvancedFilterValue) => AdvancedFilterValue,
  ) => {
    setLocalValue((prev) => updater(prev));
  };

  const toggleFromList = (
    key: "propertyTypes" | "bedrooms" | "bathrooms" | "directions",
    item: string,
  ) => {
    updateCurrent((prev) => {
      const list = prev[key];
      const exists = list.includes(item);
      return {
        ...prev,
        [key]: exists ? [] : [item],
      };
    });
  };

  const activeCount = useMemo(() => {
    return [
      current.propertyTypes.length,
      current.province || current.ward ? 1 : 0,
      current.priceMin || current.priceMax || current.negotiable ? 1 : 0,
      current.areaMin || current.areaMax ? 1 : 0,
      current.bedrooms.length,
      current.bathrooms.length,
      current.directions.length,
    ].filter(Boolean).length;
  }, [current]);

  const priceSummary = useMemo(
    () => resolvePriceSummary(current, mockFilterPriceOptions),
    [current],
  );

  const areaSummary = useMemo(
    () => resolveAreaSummary(current, mockFilterAreaOptions),
    [current],
  );
  const displayedCount = filterCount > 0 ? filterCount : activeCount;

  const goMain = () => setDetailTab("main");

  const handleApply = () => {
    onApply?.(localValue, demandTab);
    setOpen(false);
  };

  const handleReset = () => {
    setLocalValue(INITIAL_ADVANCED_FILTER_VALUE);
    onReset?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setDetailTab("main");
          setDemandTab(defaultDemandTab);
          setLocalValue(value ?? INITIAL_ADVANCED_FILTER_VALUE);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`h-10 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
            displayedCount > 0 ? "gap-1.5 px-3" : "w-10 px-0"
          } ${
            activeCount > 0
              ? "border-primary text-primary bg-primary/5"
              : "text-secondary hover:border-primary/20 hover:bg-accent-soft hover:text-primary border-hairline bg-surface"
          }`}
        >
          <Filter size={14} />

          {displayedCount > 0 ? (
            <span className="bg-primary inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white">
              {displayedCount}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-[min(92vh,760px)] w-[min(96vw,920px)] max-w-none flex-col overflow-hidden rounded-[1.75rem] border border-hairline bg-surface p-0 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <DialogHeader className="from-primary/10 border-b border-hairline bg-linear-to-b via-surface to-surface p-5">
          <DialogTitle className="text-primary text-lg font-bold tracking-tight">
            Bộ lọc nâng cao
          </DialogTitle>
          <DialogDescription className="text-body mt-1 text-sm">
            Chọn các tiêu chí để lọc bất động sản theo nhu cầu của bạn.
          </DialogDescription>

          <Tabs
            value={demandTab}
            onValueChange={(v) => setDemandTab(v as DemandTab)}
          >
            <TabsList className="mt-4 flex h-12 w-full items-stretch rounded-xl border border-hairline bg-surface p-1">
              <TabsTrigger
                value="cho-thue"
                className="data-[state=active]:bg-primary h-full flex-1 rounded-lg px-4 text-base font-semibold data-[state=active]:text-white"
              >
                Cho thuê
              </TabsTrigger>
              <TabsTrigger
                value="can-thue"
                className="data-[state=active]:bg-primary h-full flex-1 rounded-lg px-4 text-base font-semibold data-[state=active]:text-white"
              >
                Cần thuê
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col bg-surface">
          <div className="via-app/60 min-h-0 flex-1 overflow-y-auto bg-linear-to-b from-white to-white px-4">
            {detailTab !== "main" ? (
              <Button
                variant="ghost"
                onClick={goMain}
                className="text-primary hover:bg-primary/8 mb-3 h-8 rounded-lg px-2 text-xs font-medium"
              >
                <ArrowLeft className="mr-1 size-5" />
                Quay lại
              </Button>
            ) : null}

            {detailTab === "main" ? (
              <AdvancedMainTab
                current={current}
                listingMode={listingMode}
                setDetailTab={(tab) => setDetailTab(tab)}
                priceSummary={priceSummary}
                areaSummary={areaSummary}
                toggleFromList={toggleFromList}
              />
            ) : null}

            {detailTab === "propertyType" ? (
              <PropertyTypeDetailTab
                current={current}
                updateCurrent={setLocalValue}
                propertyTypeOptions={propertyTypeOptions}
              />
            ) : null}

            {detailTab === "location" ? (
              <LocationDetailTab
                current={current}
                updateCurrent={setLocalValue}
                provinceWardMap={effectiveProvinceWardMap}
              />
            ) : null}

            {detailTab === "price" ? (
              <PriceDetailTab
                current={current}
                updateCurrent={setLocalValue}
                priceRange={toPriceRange(current.priceMin, current.priceMax)}
              />
            ) : null}

            {detailTab === "area" ? (
              <AreaDetailTab
                current={current}
                updateCurrent={setLocalValue}
                areaRange={toAreaRange(current.areaMin, current.areaMax)}
              />
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-hairline bg-surface/95 p-4 backdrop-blur supports-backdrop-filter:bg-surface/75">
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-10 px-5 font-semibold"
            >
              Đặt lại
            </Button>
            <Button
              onClick={handleApply}
              className="h-10 rounded-lg px-6 font-semibold"
            >
              Xem kết quả
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
