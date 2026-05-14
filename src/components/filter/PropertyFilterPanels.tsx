"use client";

import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  ChevronRight,
  CircleDollarSign,
  MapPin,
  Maximize,
} from "lucide-react";
import {
  BED_BATH_OPTIONS,
  DIRECTION_OPTIONS,
  FILTER_LIMITS,
  mockFilterAreaOptions,
  mockFilterPriceOptions,
} from "@/mocks/filter";
import { AdvancedFilterValue } from "@/types/filter";
import {
  formatArea,
  formatCurrencyShort,
  millionToVnd,
  parseNumericInput,
} from "@/helpers/filterHelpers";

type UpdateCurrent = (
  updater: (prev: AdvancedFilterValue) => AdvancedFilterValue,
) => void;

type DetailTabSharedProps = {
  current: AdvancedFilterValue;
  updateCurrent: UpdateCurrent;
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
      <label className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-50">
        <span className="text-sm text-gray-700">Tất cả loại mặt bằng</span>
        <input
          type="checkbox"
          name="property-type-single"
          checked={current.propertyTypes.length === 0}
          onChange={() => {
            updateCurrent((prev) => ({
              ...prev,
              propertyTypes: [],
            }));
            onDone?.();
          }}
          className="accent-primary h-4 w-4 cursor-pointer"
        />
      </label>
      {propertyTypeOptions.map((type) => (
        <label
          key={type}
          className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-50"
        >
          <span className="text-sm text-gray-700">{type}</span>
          <input
            type="checkbox"
            name="property-type-single"
            checked={current.propertyTypes[0] === type}
            onChange={() => {
              updateCurrent((prev) => ({
                ...prev,
                propertyTypes: [type],
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
}: DetailTabSharedProps & { priceRange: [number, number] }) {
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
            value={Math.round(
              parseNumericInput(current.priceMin || "0") / 1_000_000,
            )}
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
            value={Math.round(
              parseNumericInput(
                current.priceMax || String(FILTER_LIMITS.PRICE_MAX),
              ) / 1_000_000,
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
        max={FILTER_LIMITS.PRICE_MAX_MILLION}
        step={100}
        value={priceRange}
        onValueChange={(valueItem) =>
          updateCurrent((prev) => ({
            ...prev,
            priceMin: String(millionToVnd(valueItem[0])),
            priceMax: String(millionToVnd(valueItem[1])),
            negotiable: false,
          }))
        }
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
                  const minMillion = Math.round(
                    parseNumericInput(option.min || "0") / 1_000_000,
                  );
                  const maxMillion = option.max
                    ? Math.round(parseNumericInput(option.max) / 1_000_000)
                    : FILTER_LIMITS.PRICE_MAX_MILLION;

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
}: DetailTabSharedProps & { areaRange: [number, number] }) {
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
              updateCurrent((prev) => ({
                ...prev,
                areaMin: event.target.value,
              }))
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
              updateCurrent((prev) => ({
                ...prev,
                areaMax: event.target.value,
              }))
            }
            placeholder="Đến"
            className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
          />
        </div>
      </div>

      <Slider
        min={0}
        max={FILTER_LIMITS.AREA_MAX}
        step={1}
        value={areaRange}
        onValueChange={(valueItem) =>
          updateCurrent((prev) => ({
            ...prev,
            areaMin: String(valueItem[0]),
            areaMax: String(valueItem[1]),
          }))
        }
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

export function LocationDetailTab({
  current,
  updateCurrent,
  cityMap,
  onDone,
}: DetailTabSharedProps & {
  cityMap: Record<string, Record<string, string[]>>;
}) {
  const wards = current.city ? Object.keys(cityMap[current.city] ?? {}) : [];
  const streets =
    current.city && current.ward
      ? (cityMap[current.city]?.[current.ward] ?? [])
      : [];

  return (
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
        <SelectContent className="[&::-webkit-scrollbar-thumb]:bg-primary/35 max-h-60 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full">
          {wards.map((ward) => (
            <SelectItem key={ward} value={ward} className="cursor-pointer">
              {ward}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={current.street}
        onValueChange={(valueItem) => {
          updateCurrent((prev) => ({ ...prev, street: valueItem }));
          onDone?.();
        }}
        disabled={!current.ward}
      >
        <SelectTrigger className="h-11 cursor-pointer rounded-xl border-gray-200">
          <SelectValue placeholder="Chọn đường / phố" />
        </SelectTrigger>
        <SelectContent className="[&::-webkit-scrollbar-thumb]:bg-primary/35 max-h-60 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full">
          {streets.map((street) => (
            <SelectItem key={street} value={street} className="cursor-pointer">
              {street}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function AdvancedMainTab({
  current,
  priceSummary,
  areaSummary,
  setDetailTab,
  toggleFromList,
}: {
  current: AdvancedFilterValue;
  priceSummary: string;
  areaSummary: string;
  setDetailTab: (tab: "propertyType" | "location" | "price" | "area") => void;
  toggleFromList: (
    key: "propertyTypes" | "bedrooms" | "bathrooms" | "directions",
    item: string,
  ) => void;
}) {
  const quickCellClass =
    "hover:border-primary mt-2 hover:text-primary cursor-pointer rounded-xl border border-gray-200 px-4 py-1 text-sm font-medium text-gray-600 transition-colors";
  const selectedQuickCellClass = "border-primary bg-primary/5 text-primary";
  const locationSummary = [current.city, current.ward]
    .filter(Boolean)
    .join(", ");
  const propertyTypeSummary =
    current.propertyTypes[0] || "Tất cả loại bất động sản";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Loại bất động sản
        </label>
        <button
          type="button"
          onClick={() => setDetailTab("propertyType")}
          className="mt-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="h-4 w-4" />
            <span className="text-sm">{propertyTypeSummary}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Khu vực</label>
        <button
          type="button"
          onClick={() => setDetailTab("location")}
          className="mt-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{locationSummary || "Toàn quốc"}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Khoảng giá
        </label>
        <button
          type="button"
          onClick={() => setDetailTab("price")}
          className="mt-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2 text-gray-600">
            <CircleDollarSign className="h-4 w-4" />
            <span className="text-sm">{priceSummary}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Diện tích</label>
        <button
          type="button"
          onClick={() => setDetailTab("area")}
          className="mt-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2 text-gray-600">
            <Maximize className="h-4 w-4" />
            <span className="text-sm">{areaSummary}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
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
        <label className="text-sm font-semibold text-gray-700">
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
        <label className="text-sm font-semibold text-gray-700">Hướng nhà</label>
        <div className="flex justify-center py-2">
          <svg
            viewBox="-5 -5 210 210"
            className="mx-auto h-55 w-55 drop-shadow-sm"
          >
            {DIRECTION_OPTIONS.map((dir, index) => {
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
  );
}
