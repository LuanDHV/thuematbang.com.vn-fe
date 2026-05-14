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
import { INITIAL_ADVANCED_FILTER_VALUE, type AdvancedFilterValue } from "@/types/filter";
import { resolveAreaSummary, resolvePriceSummary, toAreaRange, toPriceRange } from "@/helpers/filterHelpers";
import {
  AdvancedMainTab,
  AreaDetailTab,
  LocationDetailTab,
  PriceDetailTab,
  PropertyTypeDetailTab,
} from "./AdvancedFilterSections";

type DemandTab = "cho-thue" | "can-thue";
type DetailTab = "main" | "propertyType" | "location" | "price" | "area";

type Props = {
  filterCount?: number;
  propertyTypeOptions: string[];
  cityMap: Record<string, Record<string, string[]>>;
  value?: AdvancedFilterValue;
  onApply?: (value: AdvancedFilterValue) => void;
  onReset?: () => void;
};

export { AreaDetailTab, PriceDetailTab, PropertyTypeDetailTab };
export type { AdvancedFilterValue };

export function AdvancedSearchModal({
  filterCount = 0,
  propertyTypeOptions,
  cityMap,
  value,
  onApply,
  onReset,
}: Props) {
  const [open, setOpen] = useState(false);
  const [demandTab, setDemandTab] = useState<DemandTab>("cho-thue");
  const [detailTab, setDetailTab] = useState<DetailTab>("main");
  const [localValue, setLocalValue] = useState<AdvancedFilterValue>(
    value ?? INITIAL_ADVANCED_FILTER_VALUE,
  );

  const current = localValue;

  const activeCount = useMemo(() => {
    return [
      current.propertyTypes.length,
      current.city || current.ward || current.street ? 1 : 0,
      current.priceMin || current.priceMax || current.negotiable ? 1 : 0,
      current.areaMin || current.areaMax ? 1 : 0,
      current.bedrooms.length,
      current.bathrooms.length,
      current.directions.length,
    ].reduce((sum, valueItem) => sum + (valueItem > 0 ? 1 : 0), 0);
  }, [current]);

  const priceSummary = resolvePriceSummary(current, mockFilterPriceOptions);
  const areaSummary = resolveAreaSummary(current, mockFilterAreaOptions);

  const updateCurrent = (
    updater: (prev: AdvancedFilterValue) => AdvancedFilterValue,
  ) => {
    setLocalValue((prev) => updater(prev));
  };

  const toggleFromList = (
    key: "propertyTypes" | "bedrooms" | "bathrooms" | "directions",
    item: string,
  ) => {
    updateCurrent((prev) => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter((valueItem) => valueItem !== item)
        : [...prev[key], item],
    }));
  };

  const resetCurrent = () => {
    setLocalValue({ ...INITIAL_ADVANCED_FILTER_VALUE });
    setDetailTab("main");
    onReset?.();
  };

  const applyCurrent = () => {
    onApply?.(localValue);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setLocalValue(value ?? INITIAL_ADVANCED_FILTER_VALUE);
          setDetailTab("main");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative h-10 w-10 cursor-pointer rounded-xl border-gray-200 bg-white p-0 hover:bg-gray-50"
        >
          <Filter className="h-5 w-5 text-gray-600" />
          {(filterCount > 0 || activeCount > 0) && (
            <span className="bg-primary absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {Math.max(filterCount, activeCount)}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[88vh] max-w-xl flex-col gap-0 overflow-hidden rounded-2xl bg-white p-0 shadow-2xl">
        <DialogHeader className="border-b border-gray-100 bg-white p-4">
          <DialogTitle className="text-center text-lg font-bold text-gray-800">
            Bộ lọc nâng cao
          </DialogTitle>
          <DialogDescription className="sr-only">
            Chọn các tiêu chí để lọc bất động sản theo nhu cầu của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white px-4 pt-4">
          <Tabs
            value={demandTab}
            onValueChange={(valueItem) => {
              setDemandTab(valueItem as DemandTab);
              setDetailTab("main");
            }}
          >
            <TabsList className="grid h-11 w-full grid-cols-2 bg-gray-100 p-1">
              <TabsTrigger
                value="cho-thue"
                className="data-[state=active]:bg-primary cursor-pointer font-medium data-[state=active]:text-white"
              >
                Cho thuê
              </TabsTrigger>
              <TabsTrigger
                value="can-thue"
                className="data-[state=active]:bg-primary cursor-pointer font-medium data-[state=active]:text-white"
              >
                Cần thuê
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="[&::-webkit-scrollbar-thumb]:bg-primary/40 flex-1 overflow-y-auto bg-white px-4 py-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full">
          {detailTab !== "main" && (
            <Button
              variant="ghost"
              onClick={() => setDetailTab("main")}
              className="text-primary hover:bg-primary/10 mb-3 h-9 cursor-pointer px-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Quay lại
            </Button>
          )}

          {detailTab === "main" && (
            <AdvancedMainTab
              current={current}
              priceSummary={priceSummary}
              areaSummary={areaSummary}
              setDetailTab={setDetailTab}
              toggleFromList={toggleFromList}
              updateCurrent={updateCurrent}
            />
          )}

          {detailTab === "propertyType" && (
            <PropertyTypeDetailTab
              current={current}
              updateCurrent={updateCurrent}
              propertyTypeOptions={propertyTypeOptions}
            />
          )}

          {detailTab === "location" && (
            <LocationDetailTab
              current={current}
              updateCurrent={updateCurrent}
              cityMap={cityMap}
              onDone={() => setDetailTab("main")}
            />
          )}

          {detailTab === "price" && (
            <PriceDetailTab
              current={current}
              updateCurrent={updateCurrent}
              priceRange={toPriceRange(current.priceMin, current.priceMax)}
              onDone={() => setDetailTab("main")}
            />
          )}

          {detailTab === "area" && (
            <AreaDetailTab
              current={current}
              updateCurrent={updateCurrent}
              areaRange={toAreaRange(current.areaMin, current.areaMax)}
              onDone={() => setDetailTab("main")}
            />
          )}
        </div>

        <div className="border-t border-gray-100 bg-white p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetCurrent}
              className="border-primary text-primary hover:bg-primary/10 h-11 w-28 cursor-pointer rounded-xl"
            >
              Đặt lại
            </Button>
            <Button
              onClick={applyCurrent}
              className="bg-primary hover:bg-primary/90 h-11 flex-1 cursor-pointer rounded-xl text-white"
            >
              Xem kết quả
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
