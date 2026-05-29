"use client";

import { useMemo, useState } from "react";
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
} from "@/helpers/filterHelpers";
import {
  AdvancedMainTab,
  AreaDetailTab,
  LocationDetailTab,
  PriceDetailTab,
  PropertyTypeDetailTab,
} from "./ListingFilterPanels";

type DemandTab = "cho-thue" | "can-thue";
type DetailTab = "main" | "propertyType" | "location" | "price" | "area";

type Props = {
  filterCount?: number;
  defaultDemandTab?: DemandTab;
  listingMode?: "property" | "rentRequest";
  propertyTypeOptions: string[];
  provinceWardMap: Record<string, Record<string, string[]>>;
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
        [key]: exists
          ? list.filter((value) => value !== item)
          : [...list, item],
      };
    });
  };

  const activeCount = useMemo(() => {
    return [
      current.propertyTypes.length,
      current.province || current.ward || current.street ? 1 : 0,
      current.priceMin || current.priceMax || current.negotiable ? 1 : 0,
      current.areaMin || current.areaMax ? 1 : 0,
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
              : "border-black/8 bg-white text-secondary hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
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

      <DialogContent className="flex h-[min(92vh,760px)] w-[min(96vw,920px)] max-w-none flex-col overflow-hidden rounded-[1.75rem] border border-black/6 bg-white p-0 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <DialogHeader className="border-b border-black/6 bg-linear-to-b from-primary/10 via-white to-white p-5">
          <DialogTitle className="text-primary text-lg font-bold tracking-tight">
            Bộ lọc nâng cao
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-body">
            Chọn các tiêu chí để lọc bất động sản theo nhu cầu của bạn.
          </DialogDescription>

          <Tabs
            value={demandTab}
            onValueChange={(v) => setDemandTab(v as DemandTab)}
          >
            <TabsList className="mt-4 flex h-12 w-full items-stretch rounded-xl border border-black/6 bg-white p-1">
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

        <div className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="min-h-0 flex-1 overflow-y-auto bg-linear-to-b from-white via-app/60 to-white px-4">
            {detailTab !== "main" ? (
              <Button
                variant="ghost"
                onClick={goMain}
                className="mb-3 h-8 rounded-lg px-2 text-xs font-medium text-primary hover:bg-primary/8"
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
                provinceWardMap={provinceWardMap}
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

          <div className="flex items-center justify-between gap-2 border-t border-black/6 bg-white/95 p-4 backdrop-blur supports-backdrop-filter:bg-white/75">
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

