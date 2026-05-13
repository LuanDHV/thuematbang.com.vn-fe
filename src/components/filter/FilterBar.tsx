"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { AdvancedFilterValue, AdvancedSearchModal } from "./AdvancedSearchModal";
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
const priceOptions = mockFilterPriceOptions;
const areaOptions = mockFilterAreaOptions;

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

const formatMoneyLabel = (value: string) => {
  const numeric = parseNumericInput(value);
  if (!numeric) return "";
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
    numeric,
  );
};

export default function FilterBar({ sourceProperties, onFilteredChange }: Props) {
  const [keyword, setKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [priceLabel, setPriceLabel] = useState("");

  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");
  const [areaLabel, setAreaLabel] = useState("");

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterValue>({
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
  });

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type],
    );
  };

  const displayTypeLabel =
    selectedTypes.length > 0
      ? selectedTypes.length === 1
        ? selectedTypes[0]
        : `${selectedTypes.length} loại`
      : "Loại BĐS";

  const displayPriceLabel =
    priceLabel ||
    (priceMin && priceMax
      ? `${formatMoneyLabel(priceMin)} - ${formatMoneyLabel(priceMax)}`
      : priceMin
        ? `Từ ${formatMoneyLabel(priceMin)}`
        : priceMax
          ? `Dưới ${formatMoneyLabel(priceMax)}`
          : "Mức giá");

  const displayAreaLabel =
    areaLabel ||
    (areaMin && areaMax
      ? `${areaMin} - ${areaMax} m²`
      : areaMin
        ? `Từ ${areaMin} m²`
        : areaMax
          ? `Dưới ${areaMax} m²`
          : "Diện tích");

  const mergedCategoryFilter = useMemo(() => {
    const fromAdvanced = advancedFilters.propertyTypes;
    return Array.from(new Set([...selectedTypes, ...fromAdvanced]));
  }, [selectedTypes, advancedFilters.propertyTypes]);

  const runFilter = () => {
    const keywordText = normalize(keyword);
    const minPrice = parseNumericInput(priceMin || advancedFilters.priceMin || "");
    const maxPrice = parseNumericInput(priceMax || advancedFilters.priceMax || "");
    const minArea = Number(areaMin || advancedFilters.areaMin || 0);
    const maxArea = Number(areaMax || advancedFilters.areaMax || 0);

    const filtered = sourceProperties.filter((property) => {
      const categoryName = property.category?.name ?? "";
      const cityName = property.city?.name ?? "";
      const wardName = property.ward?.name ?? "";
      const streetName = property.street?.name ?? "";
      const haystack = normalize(
        `${property.title} ${property.addressDetail ?? ""} ${categoryName} ${cityName} ${wardName} ${streetName}`,
      );

      if (keywordText && !haystack.includes(keywordText)) return false;

      if (mergedCategoryFilter.length > 0) {
        const normalizedCategory = normalize(categoryName);
        const matched = mergedCategoryFilter.some(
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
      if (advancedFilters.street && property.street?.name !== advancedFilters.street)
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
    setSelectedTypes([]);
    setPriceMin("");
    setPriceMax("");
    setPriceLabel("");
    setAreaMin("");
    setAreaMax("");
    setAreaLabel("");
    setAdvancedFilters({
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
    });
    onFilteredChange(sourceProperties);
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

        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1 lg:w-auto lg:overflow-visible lg:pb-0">
          <div className="shrink-0">
            <AdvancedSearchModal
              filterCount={
                mergedCategoryFilter.length +
                (priceMin || priceMax || advancedFilters.priceMin || advancedFilters.priceMax ? 1 : 0) +
                (areaMin || areaMax || advancedFilters.areaMin || advancedFilters.areaMax ? 1 : 0) +
                (advancedFilters.city || advancedFilters.ward || advancedFilters.street ? 1 : 0)
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
            isActive={selectedTypes.length > 0}
            onReset={() => {
              setSelectedTypes([]);
              setTimeout(runFilter, 0);
            }}
            onApply={runFilter}
          >
            <div className="grid gap-2">
              {propertyTypes.map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                    className="focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded border-gray-300"
                  />
                </label>
              ))}
            </div>
          </MiniFilterPopover>

          <MiniFilterPopover
            title="Khoảng giá"
            label={displayPriceLabel}
            isActive={!!priceMin || !!priceMax || advancedFilters.negotiable}
            onReset={() => {
              setPriceMin("");
              setPriceMax("");
              setPriceLabel("");
              setAdvancedFilters((prev) => ({ ...prev, negotiable: false }));
              setTimeout(runFilter, 0);
            }}
            onApply={runFilter}
          >
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium text-gray-500">Giá thấp nhất</p>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Từ"
                    value={priceMin}
                    onChange={(event) => {
                      setPriceMin(event.target.value);
                      setPriceLabel("");
                    }}
                    className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-200 p-2 text-sm outline-none"
                  />
                </div>
                <span className="mt-5 text-gray-400">-</span>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium text-gray-500">Giá cao nhất</p>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Đến"
                    value={priceMax}
                    onChange={(event) => {
                      setPriceMax(event.target.value);
                      setPriceLabel("");
                    }}
                    className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-200 p-2 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                {priceOptions.map((option) => {
                  const isSelected =
                    priceMin === option.min &&
                    priceMax === option.max &&
                    Boolean(option.isNegotiable) === advancedFilters.negotiable;
                  return (
                    <label
                      key={option.label}
                      className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-gray-50 ${
                        isSelected ? "text-primary font-semibold" : "text-gray-700"
                      }`}
                    >
                      <span>{option.label}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            setPriceMin("");
                            setPriceMax("");
                            setPriceLabel("");
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              negotiable: false,
                            }));
                          } else {
                            setPriceMin(option.min);
                            setPriceMax(option.max);
                            setPriceLabel(option.label === "Tất cả khoảng giá" ? "" : option.label);
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              negotiable: Boolean(option.isNegotiable),
                            }));
                          }
                        }}
                        className="focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded border-gray-300"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </MiniFilterPopover>

          <MiniFilterPopover
            title="Diện tích"
            label={displayAreaLabel}
            isActive={!!areaMin || !!areaMax}
            onReset={() => {
              setAreaMin("");
              setAreaMax("");
              setAreaLabel("");
              setTimeout(runFilter, 0);
            }}
            onApply={runFilter}
          >
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium text-gray-500">Diện tích thấp nhất</p>
                  <input
                    type="number"
                    placeholder="Từ"
                    value={areaMin}
                    onChange={(event) => {
                      setAreaMin(event.target.value);
                      setAreaLabel("");
                    }}
                    className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-200 p-2 text-sm outline-none"
                  />
                </div>
                <span className="mt-5 text-gray-400">-</span>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium text-gray-500">Diện tích cao nhất</p>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={areaMax}
                    onChange={(event) => {
                      setAreaMax(event.target.value);
                      setAreaLabel("");
                    }}
                    className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-200 p-2 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                {areaOptions.map((option) => {
                  const isSelected = areaMin === option.min && areaMax === option.max;
                  return (
                    <label
                      key={option.label}
                      className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-gray-50 ${
                        isSelected ? "text-primary font-semibold" : "text-gray-700"
                      }`}
                    >
                      <span>{option.label}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            setAreaMin("");
                            setAreaMax("");
                            setAreaLabel("");
                          } else {
                            setAreaMin(option.min);
                            setAreaMax(option.max);
                            setAreaLabel(option.label === "Tất cả diện tích" ? "" : option.label);
                          }
                        }}
                        className="focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded border-gray-300"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
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
