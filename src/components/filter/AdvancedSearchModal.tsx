"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ChevronRight,
  CircleDollarSign,
  Filter,
  MapPin,
  Maximize,
  Plus,
} from "lucide-react";

type DemandTab = "cho-thue" | "can-thue";
type DetailTab = "main" | "propertyType" | "location" | "price" | "area";

export interface AdvancedFilterValue {
  propertyTypes: string[];
  city: string;
  ward: string;
  street: string;
  priceMin: string;
  priceMax: string;
  negotiable: boolean;
  areaMin: string;
  areaMax: string;
  bedrooms: string[];
  bathrooms: string[];
  directions: string[];
}

type Props = {
  filterCount?: number;
  propertyTypeOptions: string[];
  cityMap: Record<string, Record<string, string[]>>;
  value?: AdvancedFilterValue;
  onApply?: (value: AdvancedFilterValue) => void;
  onReset?: () => void;
};

const BED_BATH_OPTIONS = ["1", "2", "3", "4", "5+"];
const PRICE_OPTIONS = [
  "Dưới 3 triệu",
  "3 - 5 triệu",
  "5 - 10 triệu",
  "10 - 20 triệu",
  "Trên 20 triệu",
];
const AREA_OPTIONS = [
  "Dưới 30 m²",
  "30 - 50 m²",
  "50 - 80 m²",
  "80 - 120 m²",
  "Trên 120 m²",
];

const DIRECTIONS = [
  { id: "BAC", label: "Bắc" },
  { id: "DONG_BAC", label: "Đông Bắc" },
  { id: "DONG", label: "Đông" },
  { id: "DONG_NAM", label: "Đông Nam" },
  { id: "NAM", label: "Nam" },
  { id: "TAY_NAM", label: "Tây Nam" },
  { id: "TAY", label: "Tây" },
  { id: "TAY_BAC", label: "Tây Bắc" },
];

const initialFilterState: AdvancedFilterValue = {
  propertyTypes: [],
  city: "",
  ward: "",
  street: "",
  priceMin: "",
  priceMax: "",
  negotiable: false,
  areaMin: "",
  areaMax: "",
  bedrooms: [],
  bathrooms: [],
  directions: [],
};

export function AdvancedSearchModal({
  filterCount = 0,
  propertyTypeOptions,
  cityMap,
  value,
  onApply,
  onReset,
}: Props) {
  const [demandTab, setDemandTab] = useState<DemandTab>("cho-thue");
  const [detailTab, setDetailTab] = useState<DetailTab>("main");
  const [localValue, setLocalValue] = useState<AdvancedFilterValue>(
    value ?? initialFilterState,
  );

  const current = localValue;
  const wards = current.city ? Object.keys(cityMap[current.city] ?? {}) : [];
  const streets =
    current.city && current.ward ? cityMap[current.city]?.[current.ward] ?? [] : [];

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

  const updateCurrent = (updater: (prev: AdvancedFilterValue) => AdvancedFilterValue) => {
    setLocalValue((prev) => updater(prev));
  };

  const toggleFromList = (
    key:
      | "propertyTypes"
      | "bedrooms"
      | "bathrooms"
      | "directions",
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
    setLocalValue({ ...initialFilterState });
    setDetailTab("main");
    onReset?.();
  };

  const applyCurrent = () => {
    onApply?.(localValue);
  };

  const quickCellClass =
    "hover:border-primary hover:text-primary cursor-pointer rounded-xl border border-gray-200 px-4 py-1 text-sm font-medium text-gray-600 transition-colors";
  const selectedQuickCellClass = "border-primary bg-primary/5 text-primary";

  return (
    <Dialog>
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
                className="data-[state=active]:bg-primary cursor-pointer font-semibold data-[state=active]:text-white"
              >
                Cho thuê
              </TabsTrigger>
              <TabsTrigger
                value="can-thue"
                className="data-[state=active]:bg-primary cursor-pointer font-semibold data-[state=active]:text-white"
              >
                Cần thuê
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto bg-white px-4 py-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar]:w-1.5">
          {detailTab !== "main" && (
            <Button
              variant="ghost"
              onClick={() => setDetailTab("main")}
              className="text-primary mb-3 h-9 cursor-pointer px-2 hover:bg-primary/10"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Quay lại
            </Button>
          )}

          {detailTab === "main" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Loại bất động sản
                </label>
                <Button
                  variant="ghost"
                  onClick={() => setDetailTab("propertyType")}
                  className="text-primary h-9 cursor-pointer rounded-full px-4 hover:bg-primary/10"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Thêm
                </Button>
              </div>

              {[
                {
                  key: "location",
                  icon: MapPin,
                  label: "Khu vực",
                  value: current.city || "Toàn quốc",
                },
                {
                  key: "price",
                  icon: CircleDollarSign,
                  label: "Khoảng giá",
                  value: current.negotiable
                    ? "Thỏa thuận"
                    : current.priceMin || current.priceMax
                      ? `${current.priceMin || 0} - ${current.priceMax || "max"} triệu`
                      : "Tất cả",
                },
                {
                  key: "area",
                  icon: Maximize,
                  label: "Diện tích",
                  value:
                    current.areaMin || current.areaMax
                      ? `${current.areaMin || 0} - ${current.areaMax || "max"} m²`
                      : "Tất cả",
                },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">{item.label}</label>
                  <button
                    type="button"
                    onClick={() => setDetailTab(item.key as DetailTab)}
                    className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2 text-gray-600">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.value}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Số phòng ngủ</label>
                <div className="flex flex-wrap gap-2">
                  {BED_BATH_OPTIONS.map((item) => (
                    <button
                      key={`bed-${item}`}
                      type="button"
                      onClick={() => toggleFromList("bedrooms", item)}
                      className={`${quickCellClass} ${current.bedrooms.includes(item) ? selectedQuickCellClass : ""}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Số phòng tắm, vệ sinh</label>
                <div className="flex flex-wrap gap-2">
                  {BED_BATH_OPTIONS.map((item) => (
                    <button
                      key={`bath-${item}`}
                      type="button"
                      onClick={() => toggleFromList("bathrooms", item)}
                      className={`${quickCellClass} ${current.bathrooms.includes(item) ? selectedQuickCellClass : ""}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-800">Hướng nhà</label>
                <div className="flex justify-center py-2">
                  <svg viewBox="-5 -5 210 210" className="mx-auto h-55 w-55 drop-shadow-sm">
                    {DIRECTIONS.map((dir, index) => {
                      const angle = index * 45;
                      const textAngle = angle - 90;
                      const textX = 100 + 70 * Math.cos((textAngle * Math.PI) / 180);
                      const textY = 100 + 70 * Math.sin((textAngle * Math.PI) / 180);
                      const isSelected = current.directions.includes(dir.id);

                      return (
                        <g
                          key={dir.id}
                          onClick={() => toggleFromList("directions", dir.id)}
                          className="group cursor-pointer"
                        >
                          <path
                            d="M 61.73 7.61 A 100 100 0 0 1 138.27 7.61 L 115.31 63.04 A 40 40 0 0 0 84.69 63.04 Z"
                            transform={`rotate(${angle} 100 100)`}
                            className={`stroke-white stroke-[2.5px] transition-colors duration-200 ${isSelected ? "fill-primary" : "fill-[#f4f4f4] group-hover:fill-gray-200"}`}
                          />
                          <text
                            x={textX}
                            y={textY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`pointer-events-none text-[10px] transition-colors duration-200 ${isSelected ? "fill-white font-bold" : "fill-gray-600 font-medium"}`}
                          >
                            {dir.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          )}

          {detailTab === "propertyType" && (
            <div className="space-y-2">
              {propertyTypeOptions.map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">{type}</span>
                  <input
                    type="checkbox"
                    checked={current.propertyTypes.includes(type)}
                    onChange={() => toggleFromList("propertyTypes", type)}
                    className="accent-primary h-4 w-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          )}

          {detailTab === "location" && (
            <div className="space-y-3">
              <Select
                value={current.city}
                onValueChange={(valueItem) =>
                  updateCurrent((prev) => ({ ...prev, city: valueItem, ward: "", street: "" }))
                }
              >
                <SelectTrigger className="h-11 cursor-pointer rounded-xl border-gray-200">
                  <SelectValue placeholder="Chọn tỉnh / thành phố" />
                </SelectTrigger>
                <SelectContent className="max-h-60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/35 [&::-webkit-scrollbar]:w-1">
                  {Object.keys(cityMap).map((city) => (
                    <SelectItem key={city} value={city} className="cursor-pointer">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={current.ward}
                onValueChange={(valueItem) =>
                  updateCurrent((prev) => ({ ...prev, ward: valueItem, street: "" }))
                }
                disabled={!current.city}
              >
                <SelectTrigger className="h-11 cursor-pointer rounded-xl border-gray-200">
                  <SelectValue placeholder="Chọn phường / xã" />
                </SelectTrigger>
                <SelectContent className="max-h-60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/35 [&::-webkit-scrollbar]:w-1">
                  {wards.map((ward) => (
                    <SelectItem key={ward} value={ward} className="cursor-pointer">
                      {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={current.street}
                onValueChange={(valueItem) =>
                  updateCurrent((prev) => ({ ...prev, street: valueItem }))
                }
                disabled={!current.ward}
              >
                <SelectTrigger className="h-11 cursor-pointer rounded-xl border-gray-200">
                  <SelectValue placeholder="Chọn đường / phố" />
                </SelectTrigger>
                <SelectContent className="max-h-60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/35 [&::-webkit-scrollbar]:w-1">
                  {streets.map((street) => (
                    <SelectItem key={street} value={street} className="cursor-pointer">
                      {street}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {detailTab === "price" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  value={current.priceMin}
                  onChange={(event) =>
                    updateCurrent((prev) => ({ ...prev, priceMin: event.target.value }))
                  }
                  placeholder="Từ"
                  className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
                />
                <input
                  value={current.priceMax}
                  onChange={(event) =>
                    updateCurrent((prev) => ({ ...prev, priceMax: event.target.value }))
                  }
                  placeholder="Đến"
                  className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
                />
              </div>
              <Slider min={0} max={100} step={1} defaultValue={[10, 60]} className="cursor-pointer" />
              <label className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-50">
                <span className="text-sm text-gray-700">Thỏa thuận</span>
                <input
                  type="checkbox"
                  checked={current.negotiable}
                  onChange={() =>
                    updateCurrent((prev) => ({ ...prev, negotiable: !prev.negotiable }))
                  }
                  className="accent-primary h-4 w-4 cursor-pointer"
                />
              </label>
              {PRICE_OPTIONS.map((option) => (
                <div key={option} className="rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50">
                  {option}
                </div>
              ))}
            </div>
          )}

          {detailTab === "area" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  value={current.areaMin}
                  onChange={(event) =>
                    updateCurrent((prev) => ({ ...prev, areaMin: event.target.value }))
                  }
                  placeholder="Từ"
                  className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
                />
                <input
                  value={current.areaMax}
                  onChange={(event) =>
                    updateCurrent((prev) => ({ ...prev, areaMax: event.target.value }))
                  }
                  placeholder="Đến"
                  className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
                />
              </div>
              <Slider min={0} max={300} step={1} defaultValue={[30, 120]} className="cursor-pointer" />
              {AREA_OPTIONS.map((option) => (
                <div key={option} className="rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50">
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 bg-white p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetCurrent}
              className="border-primary text-primary h-11 w-28 cursor-pointer rounded-xl hover:bg-primary/10"
            >
              Đặt lại
            </Button>
            <Button
              onClick={applyCurrent}
              className="bg-primary h-11 flex-1 cursor-pointer rounded-xl text-white hover:bg-primary/90"
            >
              Xem kết quả
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
