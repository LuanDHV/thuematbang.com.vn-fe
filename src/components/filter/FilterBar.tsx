"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import {
  AdvancedFilterValue,
  AdvancedSearchModal,
  AreaDetailTab,
  PriceDetailTab,
  PropertyTypeDetailTab,
} from "./AdvancedSearchModal";
import { MiniFilterPopover } from "./MiniFilterPopover";
import {
  mockFilterAreaOptions,
  mockFilterPriceOptions,
  mockFilterPropertyTypes,
} from "../../../mocks/filter";
import { mockCities, mockStreets, mockWards } from "../../../mocks/locations";

type Props = {
  sourceProperties: Property[];
  onFilteredChange: (items: Property[]) => void;
};

const propertyTypes = mockFilterPropertyTypes;

const cityMap = mockCities.reduce<Record<string, Record<string, string[]>>>(
  (accumulator, city) => {
    const cityWards = mockWards.filter((ward) => ward.cityId === city.id);
    accumulator[city.name] = cityWards.reduce<Record<string, string[]>>(
      (wardAccumulator, ward) => {
        wardAccumulator[ward.name] = mockStreets
          .filter((street) => street.wardId === ward.id)
          .map((street) => street.name);
        return wardAccumulator;
      },
      {},
    );
    return accumulator;
  },
  {},
);

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const parseNumericInput = (value: string) =>
  Number((value || "").replace(/[^\d]/g, ""));

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

export default function FilterBar({
  sourceProperties,
  onFilteredChange,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [advancedFilters, setAdvancedFilters] =
    useState<AdvancedFilterValue>(initialFilterState);

  const displayTypeLabel =
    advancedFilters.propertyTypes.length > 0
      ? advancedFilters.propertyTypes.length === 1
        ? advancedFilters.propertyTypes[0]
        : `${advancedFilters.propertyTypes.length} loại`
      : "Loại BĐS";

  const selectedPriceOption = mockFilterPriceOptions.find(
    (option) =>
      advancedFilters.priceMin === option.min &&
      advancedFilters.priceMax === option.max &&
      Boolean(option.isNegotiable) === advancedFilters.negotiable,
  );

  const selectedAreaOption = mockFilterAreaOptions.find(
    (option) =>
      advancedFilters.areaMin === option.min &&
      advancedFilters.areaMax === option.max,
  );

  const displayPriceLabel =
    selectedPriceOption
      ? selectedPriceOption.label
      : advancedFilters.negotiable
        ? "Thỏa thuận"
        : advancedFilters.priceMin || advancedFilters.priceMax
          ? `${formatCurrencyShort(parseNumericInput(advancedFilters.priceMin) || 0)} - ${
              parseNumericInput(advancedFilters.priceMax)
                ? formatCurrencyShort(parseNumericInput(advancedFilters.priceMax))
                : "max"
            }`
          : "Mức giá";

  const displayAreaLabel =
    selectedAreaOption
      ? selectedAreaOption.label
      : advancedFilters.areaMin || advancedFilters.areaMax
        ? `${advancedFilters.areaMin ? formatArea(Number(advancedFilters.areaMin)) : "0 m²"} - ${
            advancedFilters.areaMax
              ? formatArea(Number(advancedFilters.areaMax))
              : "max"
          }`
        : "Diện tích";

  const runFilter = () => {
    const keywordText = normalize(keyword);
    const minPrice = parseNumericInput(advancedFilters.priceMin || "");
    const maxPrice = parseNumericInput(advancedFilters.priceMax || "");
    const minArea = Number(advancedFilters.areaMin || 0);
    const maxArea = Number(advancedFilters.areaMax || 0);

    const filtered = sourceProperties.filter((property) => {
      const categoryName = property.category?.name ?? "";
      const cityName = property.city?.name ?? "";
      const wardName = property.ward?.name ?? "";
      const streetName = property.street?.name ?? "";
      const haystack = normalize(
        `${property.title} ${property.addressDetail ?? ""} ${categoryName} ${cityName} ${wardName} ${streetName}`,
      );

      if (keywordText && !haystack.includes(keywordText)) return false;

      if (advancedFilters.propertyTypes.length > 0) {
        const normalizedCategory = normalize(categoryName);
        const matched = advancedFilters.propertyTypes.some(
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

      if (advancedFilters.city && property.city?.name !== advancedFilters.city)
        return false;
      if (advancedFilters.ward && property.ward?.name !== advancedFilters.ward)
        return false;
      if (
        advancedFilters.street &&
        property.street?.name !== advancedFilters.street
      )
        return false;

      if (advancedFilters.bedrooms.length > 0) {
        const bedMatched = advancedFilters.bedrooms.some((item) => {
          if (item === "5+") return (property.bedrooms ?? 0) >= 5;
          return String(property.bedrooms ?? 0) === item;
        });
        if (!bedMatched) return false;
      }

      if (advancedFilters.bathrooms.length > 0) {
        const bathMatched = advancedFilters.bathrooms.some((item) => {
          if (item === "5+") return (property.bathrooms ?? 0) >= 5;
          return String(property.bathrooms ?? 0) === item;
        });
        if (!bathMatched) return false;
      }

      if (advancedFilters.directions.length > 0) {
        const direction = (property.direction ?? "").toString().toUpperCase();
        if (!advancedFilters.directions.includes(direction)) return false;
      }

      if (advancedFilters.negotiable && !property.isNegotiable) return false;

      return true;
    });

    onFilteredChange(filtered);
  };

  const resetAll = () => {
    setKeyword("");
    setAdvancedFilters(initialFilterState);
    onFilteredChange(sourceProperties);
  };

  const updateAdvanced = (
    updater: (prev: AdvancedFilterValue) => AdvancedFilterValue,
  ) => {
    setAdvancedFilters((prev) => updater(prev));
  };

  return (
    <div className="mx-auto max-w-7xl rounded-lg bg-white shadow backdrop-blur-md transition-all duration-300">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          runFilter();
        }}
        className="flex flex-col gap-3 p-2 lg:flex-row lg:items-center lg:gap-2"
      >
        <div className="flex w-full items-center gap-2 lg:w-auto lg:flex-1">
          <div className="relative flex min-w-0 flex-1 items-center rounded-xl bg-gray-50/50 px-2">
            <Search className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Bạn muốn thuê ở đâu?"
              className="h-10 w-full border-none bg-transparent pr-4 pl-3 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
            />
          </div>

          <Button
            type="submit"
            className="bg-primary flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-xl px-4 font-bold text-white shadow-md transition-all hover:brightness-105 lg:hidden"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="[&::-webkit-scrollbar-thumb]:bg-primary/35 flex w-full items-center gap-2 overflow-x-auto pb-1 lg:w-auto lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="shrink-0">
            <AdvancedSearchModal
              filterCount={
                advancedFilters.propertyTypes.length +
                (advancedFilters.priceMin ||
                advancedFilters.priceMax ||
                advancedFilters.negotiable
                  ? 1
                  : 0) +
                (advancedFilters.areaMin || advancedFilters.areaMax ? 1 : 0) +
                (advancedFilters.city ||
                advancedFilters.ward ||
                advancedFilters.street
                  ? 1
                  : 0)
              }
              propertyTypeOptions={propertyTypes}
              cityMap={cityMap}
              value={advancedFilters}
              onApply={(value) => {
                setAdvancedFilters(value);
                setTimeout(runFilter, 0);
              }}
              onReset={resetAll}
            />
          </div>

          <div className="mx-1 h-6 w-px shrink-0 bg-gray-200" />

          <MiniFilterPopover
            title="Loại bất động sản"
            label={displayTypeLabel}
            isActive={advancedFilters.propertyTypes.length > 0}
            onReset={() => {
              updateAdvanced((prev) => ({ ...prev, propertyTypes: [] }));
              setTimeout(runFilter, 0);
            }}
            onApply={runFilter}
          >
            <PropertyTypeDetailTab
              current={advancedFilters}
              updateCurrent={updateAdvanced}
              propertyTypeOptions={propertyTypes}
            />
          </MiniFilterPopover>

          <MiniFilterPopover
            title="Khoảng giá"
            label={displayPriceLabel}
            isActive={
              !!advancedFilters.priceMin ||
              !!advancedFilters.priceMax ||
              advancedFilters.negotiable
            }
            onReset={() => {
              updateAdvanced((prev) => ({
                ...prev,
                priceMin: "",
                priceMax: "",
                negotiable: false,
              }));
              setTimeout(runFilter, 0);
            }}
            onApply={runFilter}
          >
            <PriceDetailTab
              current={advancedFilters}
              updateCurrent={updateAdvanced}
              priceRange={[
                Math.round(
                  parseNumericInput(advancedFilters.priceMin || "0") /
                    1_000_000,
                ),
                Math.round(
                  parseNumericInput(advancedFilters.priceMax || "0") /
                    1_000_000,
                ) || 60000,
              ]}
            />
          </MiniFilterPopover>

          <MiniFilterPopover
            title="Diện tích"
            label={displayAreaLabel}
            isActive={!!advancedFilters.areaMin || !!advancedFilters.areaMax}
            onReset={() => {
              updateAdvanced((prev) => ({ ...prev, areaMin: "", areaMax: "" }));
              setTimeout(runFilter, 0);
            }}
            onApply={runFilter}
          >
            <AreaDetailTab
              current={advancedFilters}
              updateCurrent={updateAdvanced}
              areaRange={[
                Number(advancedFilters.areaMin || 0),
                Number(advancedFilters.areaMax || 500),
              ]}
            />
          </MiniFilterPopover>

          <Button
            type="button"
            onClick={resetAll}
            className="border-primary text-primary hover:bg-primary/10 hidden h-10 cursor-pointer rounded-xl border bg-transparent px-4 lg:flex"
          >
            Đặt lại
          </Button>

          <Button
            type="submit"
            className="bg-primary ml-auto hidden h-10 shrink-0 cursor-pointer items-center rounded-xl px-6 font-bold text-white shadow-md transition-all hover:brightness-105 lg:flex"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Tìm kiếm</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
