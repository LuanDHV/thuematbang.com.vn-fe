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
import { mockFilterAreaOptions, mockFilterPriceOptions } from "@/mocks/filter";
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
} from "./PropertyFilterPanels";

type DemandTab = "cho-thue" | "can-thue";
type DetailTab = "main" | "propertyType" | "location" | "price" | "area";

type Props = {
  filterCount?: number;
  defaultDemandTab?: DemandTab;
  listingMode?: "property" | "rentRequest";
  propertyTypeOptions: string[];
  cityMap: Record<string, Record<string, string[]>>;
  value?: AdvancedFilterValue;
  onApply?: (value: AdvancedFilterValue) => void;
  onReset?: () => void;
};

export { AreaDetailTab, PriceDetailTab, PropertyTypeDetailTab };
export type { AdvancedFilterValue };

export function PropertyFilterDrawer({
  filterCount = 0,
  defaultDemandTab = "cho-thue",
  listingMode = "property",
  propertyTypeOptions,
  cityMap,
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
      current.city || current.ward || current.street ? 1 : 0,
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
    onApply?.(localValue);
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
          className={`h-10 w-10 cursor-pointer rounded-xl border px-4 text-xs font-semibold shadow-sm transition-all hover:-translate-y-px hover:shadow ${
            activeCount > 0
              ? "border-primary text-primary bg-primary/5 hover:bg-primary/10"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter size={12} />

          {displayedCount > 0 ? (
            <span className="bg-primary ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white">
              {displayedCount}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>

      <DialogContent className="border-primary/15 flex h-[min(92vh,760px)] w-[min(96vw,920px)] max-w-none flex-col overflow-hidden rounded-3xl border bg-white p-0 shadow-2xl">
        <DialogHeader className="border-primary/15 from-primary/12 via-primary/6 border-b bg-linear-to-b to-white p-5">
          <DialogTitle className="text-primary text-lg font-bold tracking-tight">
            Bộ lọc nâng cao
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-700">
            Chọn các tiêu chí để lọc bất động sản theo nhu cầu của bạn.
          </DialogDescription>

          <Tabs
            value={demandTab}
            onValueChange={(v) => setDemandTab(v as DemandTab)}
          >
            <TabsList className="border-primary/20 mt-4 flex h-12 w-full items-stretch rounded-xl border bg-white p-1 shadow-sm">
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
          <div className="min-h-0 flex-1 overflow-y-auto bg-linear-to-b from-white via-gray-50/50 to-white px-4">
            {detailTab !== "main" ? (
              <Button
                variant="ghost"
                onClick={goMain}
                className="text-primary hover:bg-primary/10 mb-3 h-8 rounded-lg px-2 text-xs font-medium"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
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
                cityMap={cityMap}
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

          <div className="border-primary/15 flex items-center justify-between gap-2 border-t bg-white/95 p-4 backdrop-blur supports-backdrop-filter:bg-white/75">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-primary text-primary hover:bg-primary/10 h-10 rounded-xl px-5 font-semibold"
            >
              Đặt lại
            </Button>
            <Button
              onClick={handleApply}
              className="bg-primary h-10 rounded-xl px-6 font-semibold text-white shadow-md hover:brightness-110"
            >
              Xem kết quả
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
