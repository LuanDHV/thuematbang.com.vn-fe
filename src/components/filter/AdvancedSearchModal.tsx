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
  X,
} from "lucide-react";
import {
  mockFilterAreaOptions,
  mockFilterPriceOptions,
} from "../../../mocks/filter";

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
const PRICE_MAX = 60_000_000_000;
const PRICE_MAX_MILLION = 60_000;
const AREA_MAX = 500;

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

const parseNumericInput = (value: string) =>
  Number((value || "").replace(/[^\d]/g, ""));

const millionToVnd = (million: number) => million * 1_000_000;
const vndToMillion = (vnd: number) => Math.round(vnd / 1_000_000);

const formatCurrencyShort = (value: number) => {
  if (!value) return "0";
  if (value >= 1_000_000_000) {
    const billion = value / 1_000_000_000;
    return `${Number.isInteger(billion) ? billion : billion.toFixed(1)} tỷ`;
  }
  const million = value / 1_000_000;
  return `${Number.isInteger(million) ? million : million.toFixed(1)} triệu`;
};

const formatArea = (value: number) => `${value.toLocaleString("vi-VN")} m²`;

type DetailTabSharedProps = {
  current: AdvancedFilterValue;
  updateCurrent: (
    updater: (prev: AdvancedFilterValue) => AdvancedFilterValue,
  ) => void;
  onDone?: () => void;
};

export function PropertyTypeDetailTab({
  current,
  updateCurrent,
  propertyTypeOptions,
  onDone,
}: DetailTabSharedProps & { propertyTypeOptions: string[] }) {
  return (
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
            onChange={() => {
              updateCurrent((prev) => ({
                ...prev,
                propertyTypes: prev.propertyTypes.includes(type)
                  ? prev.propertyTypes.filter((item) => item !== type)
                  : [...prev.propertyTypes, type],
              }));
              onDone?.();
            }}
            className="accent-primary h-4 w-4 cursor-pointer"
          />
        </label>
      ))}
    </div>
  );
}

export function PriceDetailTab({
  current,
  updateCurrent,
  priceRange,
  onDone,
}: DetailTabSharedProps & {
  priceRange: [number, number];
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
        <p>
          Từ:{" "}
          <span className="text-primary">
            {formatCurrencyShort(millionToVnd(priceRange[0]))}
          </span>
        </p>
        <p>
          Đến:{" "}
          <span className="text-primary">
            {formatCurrencyShort(millionToVnd(priceRange[1]))}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <input
            type="number"
            value={vndToMillion(parseNumericInput(current.priceMin || "0"))}
            onChange={(event) =>
              updateCurrent((prev) => ({
                ...prev,
                priceMin: String(millionToVnd(Number(event.target.value || 0))),
                negotiable: false,
              }))
            }
            placeholder="0"
            className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
          />
        </div>
        <span className="mt-1 text-xl text-gray-500">→</span>
        <div className="flex-1 space-y-1">
          <input
            type="number"
            value={vndToMillion(
              parseNumericInput(current.priceMax || String(PRICE_MAX)),
            )}
            onChange={(event) =>
              updateCurrent((prev) => ({
                ...prev,
                priceMax: String(millionToVnd(Number(event.target.value || 0))),
                negotiable: false,
              }))
            }
            placeholder="60000"
            className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
          />
        </div>
      </div>

      <Slider
        min={0}
        max={PRICE_MAX_MILLION}
        step={100}
        value={priceRange}
        onValueChange={(valueItem) => {
          updateCurrent((prev) => ({
            ...prev,
            priceMin: String(millionToVnd(valueItem[0])),
            priceMax: String(millionToVnd(valueItem[1])),
            negotiable: false,
          }));
        }}
        className="cursor-pointer"
      />

      <div className="grid gap-2">
        {mockFilterPriceOptions.map((option) => {
          const isSelected =
            current.priceMin === option.min &&
            current.priceMax === option.max &&
            Boolean(option.isNegotiable) === current.negotiable;
          return (
            <label
              key={option.label}
              className={`flex cursor-pointer items-center justify-between rounded-lg p-2 text-sm hover:bg-gray-50 ${isSelected ? "text-primary font-semibold" : "text-gray-700"}`}
            >
              <span>{option.label}</span>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {
                  const nextMin = option.min;
                  const nextMax = option.max;
                  const minMillion = vndToMillion(parseNumericInput(nextMin || "0"));
                  const maxMillion = nextMax
                    ? vndToMillion(parseNumericInput(nextMax))
                    : PRICE_MAX_MILLION;
                  updateCurrent((prev) => ({
                    ...prev,
                    priceMin: String(millionToVnd(minMillion)),
                    priceMax: String(millionToVnd(maxMillion)),
                    negotiable: Boolean(option.isNegotiable),
                  }));
                  onDone?.();
                }}
                className="accent-primary h-4 w-4 cursor-pointer"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function AreaDetailTab({
  current,
  updateCurrent,
  areaRange,
  onDone,
}: DetailTabSharedProps & {
  areaRange: [number, number];
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
        <p>
          Từ: <span className="text-primary">{formatArea(areaRange[0])}</span>
        </p>
        <p>
          Đến: <span className="text-primary">{formatArea(areaRange[1])}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <input
            type="number"
            value={current.areaMin}
            onChange={(event) =>
              updateCurrent((prev) => ({ ...prev, areaMin: event.target.value }))
            }
            placeholder="Từ"
            className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
          />
        </div>
        <span className="mt-1 text-xl text-gray-500">→</span>
        <div className="flex-1 space-y-1">
          <input
            type="number"
            value={current.areaMax}
            onChange={(event) =>
              updateCurrent((prev) => ({ ...prev, areaMax: event.target.value }))
            }
            placeholder="Đến"
            className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
          />
        </div>
      </div>

      <Slider
        min={0}
        max={AREA_MAX}
        step={1}
        value={areaRange}
        onValueChange={(valueItem) => {
          updateCurrent((prev) => ({
            ...prev,
            areaMin: String(valueItem[0]),
            areaMax: String(valueItem[1]),
          }));
        }}
        className="cursor-pointer"
      />

      <div className="grid gap-2">
        {mockFilterAreaOptions.map((option) => {
          const isSelected =
            current.areaMin === option.min && current.areaMax === option.max;
          return (
            <label
              key={option.label}
              className={`flex cursor-pointer items-center justify-between rounded-lg p-2 text-sm hover:bg-gray-50 ${isSelected ? "text-primary font-semibold" : "text-gray-700"}`}
            >
              <span>{option.label}</span>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {
                  updateCurrent((prev) => ({
                    ...prev,
                    areaMin: option.min,
                    areaMax: option.max,
                  }));
                  onDone?.();
                }}
                className="accent-primary h-4 w-4 cursor-pointer"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

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
    value ?? initialFilterState,
  );

  const current = localValue;
  const wards = current.city ? Object.keys(cityMap[current.city] ?? {}) : [];
  const streets =
    current.city && current.ward
      ? (cityMap[current.city]?.[current.ward] ?? [])
      : [];

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

  const priceRange = useMemo<[number, number]>(() => {
    const minPrice = parseNumericInput(current.priceMin);
    const maxPrice = parseNumericInput(current.priceMax);
    return [
      minPrice > 0 ? vndToMillion(minPrice) : 0,
      maxPrice > 0 ? vndToMillion(maxPrice) : PRICE_MAX_MILLION,
    ];
  }, [current.priceMin, current.priceMax]);

  const areaRange = useMemo<[number, number]>(() => {
    const minArea = Number(current.areaMin || 0);
    const maxArea = Number(current.areaMax || 0);
    return [minArea > 0 ? minArea : 0, maxArea > 0 ? maxArea : AREA_MAX];
  }, [current.areaMin, current.areaMax]);

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
    setLocalValue({ ...initialFilterState });
    setDetailTab("main");
    onReset?.();
  };

  const applyCurrent = () => {
    onApply?.(localValue);
    setOpen(false);
  };

  const quickCellClass =
    "hover:border-primary hover:text-primary cursor-pointer rounded-xl border border-gray-200 px-4 py-1 text-sm font-medium text-gray-600 transition-colors";
  const selectedQuickCellClass = "border-primary bg-primary/5 text-primary";

  const selectedPriceOption = mockFilterPriceOptions.find(
    (option) =>
      current.priceMin === option.min &&
      current.priceMax === option.max &&
      Boolean(option.isNegotiable) === current.negotiable,
  );

  const selectedAreaOption = mockFilterAreaOptions.find(
    (option) =>
      current.areaMin === option.min && current.areaMax === option.max,
  );

  const priceSummary = selectedPriceOption
    ? selectedPriceOption.label
    : current.negotiable
      ? "Thỏa thuận"
      : current.priceMin || current.priceMax
        ? `${formatCurrencyShort(parseNumericInput(current.priceMin) || 0)} - ${
            parseNumericInput(current.priceMax)
              ? formatCurrencyShort(parseNumericInput(current.priceMax))
              : "max"
          }`
        : "Tất cả";

  const areaSummary = selectedAreaOption
    ? selectedAreaOption.label
    : current.areaMin || current.areaMax
      ? `${current.areaMin ? formatArea(Number(current.areaMin)) : "0 m²"} - ${
          current.areaMax ? formatArea(Number(current.areaMax)) : "max"
        }`
      : "Tất cả";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setLocalValue(value ?? initialFilterState);
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
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Loại bất động sản
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {current.propertyTypes.length > 0
                    ? current.propertyTypes.map((item) => (
                        <div
                          key={item}
                          className="text-primary flex h-10 items-center gap-1 rounded-full border border-orange-200 px-4 text-sm"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCurrent((prev) => ({
                                ...prev,
                                propertyTypes: prev.propertyTypes.filter(
                                  (selected) => selected !== item,
                                ),
                              }))
                            }
                            className="text-primary/80 hover:text-primary cursor-pointer"
                            aria-label={`Bỏ chọn ${item}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    : null}
                  <Button
                    variant="ghost"
                    onClick={() => setDetailTab("propertyType")}
                    className="text-primary hover:bg-primary/10 h-10 cursor-pointer rounded-full px-4"
                  >
                    Thêm
                    <Plus className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Khu vực
                </label>
                <button
                  type="button"
                  onClick={() => setDetailTab("location")}
                  className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      {current.city || "Toàn quốc"}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {current.city ? (
                <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50/70 p-3 text-sm text-gray-700">
                  {current.ward ? (
                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        Phường/ Xã
                      </p>
                      <p>{current.ward}</p>
                    </div>
                  ) : null}
                  {current.street ? (
                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        Đường Phố
                      </p>
                      <p>{current.street}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Khoảng giá
                </label>
                <button
                  type="button"
                  onClick={() => setDetailTab("price")}
                  className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 text-gray-600">
                    <CircleDollarSign className="h-4 w-4" />
                    <span className="text-sm">{priceSummary}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Diện tích
                </label>
                <button
                  type="button"
                  onClick={() => setDetailTab("area")}
                  className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 text-gray-600">
                    <Maximize className="h-4 w-4" />
                    <span className="text-sm">{areaSummary}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Số phòng ngủ
                </label>
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
                <label className="text-sm font-semibold text-gray-800">
                  Số phòng tắm, vệ sinh
                </label>
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
                <label className="text-sm font-semibold text-gray-800">
                  Hướng nhà
                </label>
                <div className="flex justify-center py-2">
                  <svg
                    viewBox="-5 -5 210 210"
                    className="mx-auto h-55 w-55 drop-shadow-sm"
                  >
                    {DIRECTIONS.map((dir, index) => {
                      const angle = index * 45;
                      const textAngle = angle - 90;
                      const textX =
                        100 + 70 * Math.cos((textAngle * Math.PI) / 180);
                      const textY =
                        100 + 70 * Math.sin((textAngle * Math.PI) / 180);
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
            <PropertyTypeDetailTab
              current={current}
              updateCurrent={updateCurrent}
              propertyTypeOptions={propertyTypeOptions}
            />
          )}

          {detailTab === "location" && (
            <div className="space-y-3">
              <Select
                value={current.city}
                onValueChange={(valueItem) =>
                  updateCurrent((prev) => ({
                    ...prev,
                    city: valueItem,
                    ward: "",
                    street: "",
                  }))
                }
              >
                <SelectTrigger className="h-11 cursor-pointer rounded-xl border-gray-200">
                  <SelectValue placeholder="Chọn tỉnh / thành phố" />
                </SelectTrigger>
                <SelectContent className="[&::-webkit-scrollbar-thumb]:bg-primary/35 max-h-60 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {Object.keys(cityMap).map((city) => (
                    <SelectItem
                      key={city}
                      value={city}
                      className="cursor-pointer"
                    >
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={current.ward}
                onValueChange={(valueItem) =>
                  updateCurrent((prev) => ({
                    ...prev,
                    ward: valueItem,
                    street: "",
                  }))
                }
                disabled={!current.city}
              >
                <SelectTrigger className="h-11 cursor-pointer rounded-xl border-gray-200">
                  <SelectValue placeholder="Chọn phường / xã" />
                </SelectTrigger>
                <SelectContent className="[&::-webkit-scrollbar-thumb]:bg-primary/35 max-h-60 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {wards.map((ward) => (
                    <SelectItem
                      key={ward}
                      value={ward}
                      className="cursor-pointer"
                    >
                      {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={current.street}
                onValueChange={(valueItem) => {
                  updateCurrent((prev) => ({ ...prev, street: valueItem }));
                  setDetailTab("main");
                }}
                disabled={!current.ward}
              >
                <SelectTrigger className="h-11 cursor-pointer rounded-xl border-gray-200">
                  <SelectValue placeholder="Chọn đường / phố" />
                </SelectTrigger>
                <SelectContent className="[&::-webkit-scrollbar-thumb]:bg-primary/35 max-h-60 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {streets.map((street) => (
                    <SelectItem
                      key={street}
                      value={street}
                      className="cursor-pointer"
                    >
                      {street}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {detailTab === "price" && (
            <PriceDetailTab
              current={current}
              updateCurrent={updateCurrent}
              priceRange={priceRange}
              onDone={() => setDetailTab("main")}
            />
          )}

          {detailTab === "area" && (
            <AreaDetailTab
              current={current}
              updateCurrent={updateCurrent}
              areaRange={areaRange}
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
