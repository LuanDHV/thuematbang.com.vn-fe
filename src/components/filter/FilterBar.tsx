"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { AdvancedSearchModal } from "./AdvancedSearchModal";
import { MiniFilterPopover } from "./MiniFilterPopover";

const propertyTypes = [
  "Văn phòng",
  "Mặt bằng",
  "Kho xưởng",
  "Căn hộ",
  "Nhà trọ",
];

const priceOptions = [
  { label: "Tất cả mức giá", min: "", max: "" },
  { label: "Dưới 1 triệu", min: "0", max: "1" },
  { label: "1 - 3 triệu", min: "1", max: "3" },
  { label: "3 - 5 triệu", min: "3", max: "5" },
  { label: "5 - 10 triệu", min: "5", max: "10" },
  { label: "10 - 40 triệu", min: "10", max: "40" },
  { label: "40 - 70 triệu", min: "40", max: "70" },
  { label: "70 - 100 triệu", min: "70", max: "100" },
  { label: "Trên 100 triệu", min: "100", max: "" },
];

const areaOptions = [
  { label: "Tất cả diện tích", min: "", max: "" },
  { label: "Dưới 30 m²", min: "0", max: "30" },
  { label: "30 - 50 m²", min: "30", max: "50" },
  { label: "50 - 80 m²", min: "50", max: "80" },
  { label: "80 - 100 m²", min: "80", max: "100" },
  { label: "100 - 150 m²", min: "100", max: "150" },
  { label: "150 - 200 m²", min: "150", max: "200" },
  { label: "200 - 250 m²", min: "200", max: "250" },
  { label: "250 - 300 m²", min: "250", max: "300" },
  { label: "300 - 500 m²", min: "300", max: "500" },
  { label: "Trên 500 m²", min: "500", max: "" },
];

export default function FilterBar() {
  const [keyword, setKeyword] = useState("");

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [priceLabel, setPriceLabel] = useState("");

  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");
  const [areaLabel, setAreaLabel] = useState("");

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
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
      ? `${priceMin} - ${priceMax} triệu`
      : priceMin
        ? `Từ ${priceMin} triệu`
        : priceMax
          ? `Dưới ${priceMax} triệu`
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

  return (
    <div className="mx-auto max-w-7xl rounded-lg bg-white shadow backdrop-blur-md transition-all duration-300">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="no-scrollbar flex flex-nowrap items-center gap-2 overflow-x-auto p-2"
      >
        {/* Ô tìm kiếm chính */}
        <div className="relative flex min-w-60 flex-1 items-center rounded-xl bg-gray-50/50 px-2">
          <Search className="ml-2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Bạn muốn thuê ở đâu?"
            className="h-10 w-full border-none bg-transparent pr-4 pl-3 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
          />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {/* Popover Loại BĐS */}
          <MiniFilterPopover
            title="Loại bất động sản"
            label={displayTypeLabel}
            isActive={selectedTypes.length > 0}
            onReset={() => setSelectedTypes([])}
            onApply={() => console.log("Applied types:", selectedTypes)}
          >
            <div className="grid gap-2">
              {propertyTypes.map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {type}
                  </span>
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

          {/* Popover Khoảng Giá */}
          <MiniFilterPopover
            title="Mức giá (Triệu VNĐ)"
            label={displayPriceLabel}
            isActive={!!priceMin || !!priceMax}
            onReset={() => {
              setPriceMin("");
              setPriceMax("");
              setPriceLabel("");
            }}
            onApply={() =>
              console.log("Applied price:", { priceMin, priceMax })
            }
          >
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={priceMin}
                    onChange={(e) => {
                      setPriceMin(e.target.value);
                      setPriceLabel("");
                    }}
                    className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-200 p-2 text-sm outline-none [-moz-appearance:textfield] focus:ring-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Đến"
                    value={priceMax}
                    onChange={(e) => {
                      setPriceMax(e.target.value);
                      setPriceLabel("");
                    }}
                    className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-200 p-2 text-sm outline-none [-moz-appearance:textfield] focus:ring-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                {priceOptions.map((opt, idx) => {
                  const isSelected =
                    priceMin === opt.min && priceMax === opt.max;
                  return (
                    <label
                      key={idx}
                      className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-gray-50 ${
                        isSelected
                          ? "text-primary font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{opt.label}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            setPriceMin("");
                            setPriceMax("");
                            setPriceLabel("");
                          } else {
                            setPriceMin(opt.min);
                            setPriceMax(opt.max);
                            setPriceLabel(
                              opt.label === "Tất cả mức giá" ? "" : opt.label,
                            );
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

          {/* Popover Diện tích */}
          <MiniFilterPopover
            title="Diện tích"
            label={displayAreaLabel}
            isActive={!!areaMin || !!areaMax}
            onReset={() => {
              setAreaMin("");
              setAreaMax("");
              setAreaLabel("");
            }}
            onApply={() => console.log("Applied area:", { areaMin, areaMax })}
          >
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={areaMin}
                    onChange={(e) => {
                      setAreaMin(e.target.value);
                      setAreaLabel("");
                    }}
                    className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-200 p-2 text-sm outline-none [-moz-appearance:textfield] focus:ring-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Đến"
                    value={areaMax}
                    onChange={(e) => {
                      setAreaMax(e.target.value);
                      setAreaLabel("");
                    }}
                    className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-200 p-2 text-sm outline-none [-moz-appearance:textfield] focus:ring-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                {areaOptions.map((opt, idx) => {
                  const isSelected = areaMin === opt.min && areaMax === opt.max;
                  return (
                    <label
                      key={idx}
                      className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-gray-50 ${
                        isSelected
                          ? "text-primary font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{opt.label}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            setAreaMin("");
                            setAreaMax("");
                            setAreaLabel("");
                          } else {
                            setAreaMin(opt.min);
                            setAreaMax(opt.max);
                            setAreaLabel(
                              opt.label === "Tất cả diện tích" ? "" : opt.label,
                            );
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

          {/* Modal Lọc Nâng Cao */}
          <div className="mx-1 h-6 w-px bg-gray-200" />
          <AdvancedSearchModal
            filterCount={
              selectedTypes.length +
              (priceMin || priceMax ? 1 : 0) +
              (areaMin || areaMax ? 1 : 0)
            }
          />
        </div>

        {/* Nút Tìm kiếm */}
        <Button
          type="submit"
          className="bg-primary ml-auto h-10 shrink-0 cursor-pointer rounded-xl px-6 font-bold text-white shadow-md transition-all hover:brightness-105"
        >
          <Search className="h-4 w-4 lg:mr-2" />
          <span className="hidden lg:inline">Tìm kiếm</span>
        </Button>
      </form>
    </div>
  );
}
