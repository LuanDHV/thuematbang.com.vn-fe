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
} from "@/constants/filter";
import { AdvancedFilterValue } from "@/types/filter";
import {
  formatArea,
  formatCurrencyShort,
  millionToVnd,
  parseNumericInput,
} from "@/lib/filter/filter-helpers";
import { normalizeVietnameseText } from "@/lib/text/text-normalize";
import type { ProvinceWardMap } from "@/lib/location/location-filter";

type UpdateCurrent = (
  updater: (prev: AdvancedFilterValue) => AdvancedFilterValue,
) => void;

type DetailTabSharedProps = {
  current: AdvancedFilterValue;
  updateCurrent: UpdateCurrent;
  onDone?: () => void;
};

const quickCellClass =
  "mt-2 cursor-pointer rounded-lg border border-hairline bg-surface px-4 py-1.5 text-sm font-medium text-body shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-all hover:border-primary/20 hover:bg-accent-soft hover:text-primary";
const selectedQuickCellClass = "border-primary bg-primary/5 text-primary";

export function PropertyTypeDetailTab({
  current,
  updateCurrent,
  propertyTypeOptions,
  onDone,
}: DetailTabSharedProps & { propertyTypeOptions: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="hover:bg-primary/5 flex cursor-pointer items-center justify-between rounded-lg p-2.5">
        <span className="text-sm text-heading">Tất cả loại bất động sản</span>
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
          className="accent-primary size-5 cursor-pointer"
        />
      </label>
      {propertyTypeOptions.map((type) => (
        <label
          key={type}
          className="hover:bg-primary/5 flex cursor-pointer items-center justify-between rounded-lg p-2.5"
        >
          <span className="text-sm text-heading">{type}</span>
          <input
            type="checkbox"
            name="property-type-single"
            checked={
              normalizeVietnameseText(current.propertyTypes[0] || "") ===
              normalizeVietnameseText(type)
            }
            onChange={() => {
              updateCurrent((prev) => ({
                ...prev,
                propertyTypes: [type],
              }));
              onDone?.();
            }}
            className="accent-primary size-5 cursor-pointer"
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
    <div className="flex flex-col gap-4">
      <div className="text-heading grid grid-cols-2 gap-4 text-sm font-semibold">
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
        <div className="flex flex-1 flex-col gap-1">
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
            className="text-body focus:ring-primary/12 h-11 w-full [appearance:textfield] rounded-lg border border-hairline bg-surface px-3.5 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none focus:ring-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <span className="mt-1 text-xl text-secondary">→</span>
        <div className="flex flex-1 flex-col gap-1">
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
            className="text-body focus:ring-primary/12 h-11 w-full [appearance:textfield] rounded-lg border border-hairline bg-surface px-3.5 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none focus:ring-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
              className={`hover:bg-primary/5 flex cursor-pointer items-center justify-between rounded-lg p-2.5 text-sm ${isSelected ? "text-primary font-semibold" : "text-body"}`}
            >
              <span>{option.label}</span>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {
                  const isAllOption =
                    option.min === "" &&
                    option.max === "" &&
                    !option.isNegotiable;
                  const isNegotiableOption = Boolean(option.isNegotiable);

                  if (isAllOption) {
                    updateCurrent((prev) => ({
                      ...prev,
                      priceMin: "",
                      priceMax: "",
                      negotiable: false,
                    }));
                    onDone?.();
                    return;
                  }

                  if (isNegotiableOption) {
                    updateCurrent((prev) => ({
                      ...prev,
                      priceMin: "",
                      priceMax: "",
                      negotiable: true,
                    }));
                    onDone?.();
                    return;
                  }

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
                    negotiable: false,
                  }));
                  onDone?.();
                }}
                className="accent-primary size-5 cursor-pointer"
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
    <div className="flex flex-col gap-4">
      <div className="text-heading grid grid-cols-2 gap-4 text-sm font-semibold">
        <p>
          Từ: <span className="text-primary">{formatArea(areaRange[0])}</span>
        </p>
        <p>
          Đến: <span className="text-primary">{formatArea(areaRange[1])}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 flex-col gap-1">
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
            className="text-body focus:ring-primary/12 h-11 w-full [appearance:textfield] rounded-lg border border-hairline bg-surface px-3.5 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none focus:ring-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <span className="mt-1 text-xl text-secondary">→</span>
        <div className="flex flex-1 flex-col gap-1">
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
            className="text-body focus:ring-primary/12 h-11 w-full [appearance:textfield] rounded-lg border border-hairline bg-surface px-3.5 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none focus:ring-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
              className={`hover:bg-primary/5 flex cursor-pointer items-center justify-between rounded-lg p-2.5 text-sm ${isSelected ? "text-primary font-semibold" : "text-body"}`}
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
                className="accent-primary size-5 cursor-pointer"
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
  provinceWardMap,
}: DetailTabSharedProps & {
  provinceWardMap: ProvinceWardMap;
}) {
  const wards = current.province
    ? Object.keys(provinceWardMap[current.province] ?? {})
    : [];

  return (
    <div className="flex flex-col gap-3">
      <Select
        value={current.province}
        onValueChange={(valueItem) =>
          updateCurrent((prev) => ({
            ...prev,
            province: valueItem,
            ward: "",
          }))
        }
      >
          <SelectTrigger className="h-11 cursor-pointer rounded-xl border border-hairline">
          <SelectValue placeholder="Chọn tỉnh / thành phố" />
        </SelectTrigger>
        <SelectContent className="[&::-webkit-scrollbar-thumb]:bg-primary/35 max-h-80 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full">
          {Object.keys(provinceWardMap).map((province) => (
            <SelectItem
              key={province}
              value={province}
              className="cursor-pointer"
            >
              {province}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={current.ward}
        onValueChange={(valueItem) =>
          updateCurrent((prev) => ({ ...prev, ward: valueItem }))
        }
        disabled={!current.province}
      >
          <SelectTrigger className="h-11 cursor-pointer rounded-xl border border-hairline">
          <SelectValue placeholder="Chọn phường / xã" />
        </SelectTrigger>
        <SelectContent className="[&::-webkit-scrollbar-thumb]:bg-primary/35 max-h-80 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full">
          {wards.map((ward) => (
            <SelectItem key={ward} value={ward} className="cursor-pointer">
              {ward}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function AdvancedMainTab({
  current,
  listingMode = "property",
  priceSummary,
  areaSummary,
  setDetailTab,
  toggleFromList,
}: {
  current: AdvancedFilterValue;
  listingMode?: "property" | "rentRequest";
  priceSummary: string;
  areaSummary: string;
  setDetailTab: (tab: "propertyType" | "location" | "price" | "area") => void;
  toggleFromList: (
    key: "propertyTypes" | "bedrooms" | "bathrooms" | "directions",
    item: string,
  ) => void;
}) {
  const locationSummary = [current.province, current.ward]
    .filter(Boolean)
    .join(", ");
  const propertyTypeSummary =
    current.propertyTypes[0] || "Tất cả loại bất động sản";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-heading">
          Loại bất động sản
        </label>
        <button
          type="button"
          onClick={() => setDetailTab("propertyType")}
          className="hover:border-primary/20 hover:bg-accent-soft mt-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-hairline bg-surface px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
        >
          <div className="flex items-center gap-2 text-secondary">
            <Building2 className="size-5" />
            <span className="text-sm">{propertyTypeSummary}</span>
          </div>
          <ChevronRight className="size-5 text-muted" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-heading">Khu vực</label>
        <button
          type="button"
          onClick={() => setDetailTab("location")}
          className="hover:border-primary/20 hover:bg-accent-soft mt-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-hairline bg-surface px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
        >
          <div className="flex items-center gap-2 text-secondary">
            <MapPin className="size-5" />
            <span className="text-sm">{locationSummary || "Toàn quốc"}</span>
          </div>
          <ChevronRight className="size-5 text-muted" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-heading">
          Khoảng giá
        </label>
        <button
          type="button"
          onClick={() => setDetailTab("price")}
          className="hover:border-primary/20 hover:bg-accent-soft mt-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-hairline bg-surface px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
        >
          <div className="flex items-center gap-2 text-secondary">
            <CircleDollarSign className="size-5" />
            <span className="text-sm">{priceSummary}</span>
          </div>
          <ChevronRight className="size-5 text-muted" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-heading">Diện tích</label>
        <button
          type="button"
          onClick={() => setDetailTab("area")}
          className="hover:border-primary/20 hover:bg-accent-soft mt-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-hairline bg-surface px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
        >
          <div className="flex items-center gap-2 text-secondary">
            <Maximize className="size-5" />
            <span className="text-sm">{areaSummary}</span>
          </div>
          <ChevronRight className="size-5 text-muted" />
        </button>
      </div>

      {listingMode === "property" ? (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-heading">
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

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-heading">
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
        </>
      ) : null}

      <div className="flex flex-col gap-4">
        <label className="text-sm font-semibold text-heading">Hướng nhà</label>
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
                    className={`stroke-white stroke-[2.5px] transition-colors duration-200 ${isSelected ? "fill-primary" : "fill-surface-alt group-hover:fill-accent-soft"}`}
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={`pointer-events-none text-[10px] transition-colors duration-200 ${isSelected ? "fill-white font-bold" : "fill-secondary font-medium"}`}
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
