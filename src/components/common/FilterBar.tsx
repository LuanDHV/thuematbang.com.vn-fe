"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";

const propertyTypes = [
  "Văn phòng",
  "Mặt bằng",
  "Kho xưởng",
  "Khu công nghiệp",
  "Căn hộ",
  "Trung tâm thương mại",
  "Nhà trọ",
];

const directions = [
  "Đông",
  "Tây",
  "Nam",
  "Bắc",
  "Đông Bắc",
  "Đông Nam",
  "Tây Bắc",
  "Tây Nam",
];

const provinces = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Hải Phòng",
  "Đà Nẵng",
  "Cần Thơ",
  "An Giang",
  "Bắc Ninh",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Tĩnh",
  "Hưng Yên",
  "Khánh Hòa",
  "Lai Châu",
  "Lạng Sơn",
  "Lào Cai",
  "Nghệ An",
  "Ninh Bình",
  "Phú Thọ",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sơn La",
  "Tây Ninh",
  "Thái Nguyên",
  "Thanh Hóa",
  "Huế",
  "Vĩnh Long",
  "Lâm Đồng",
  "Tuyên Quang",
];

const wardOptionsByProvince: Record<string, string[]> = {
  "Hà Nội": [
    "Ba Đình",
    "Hoàn Kiếm",
    "Cầu Giấy",
    "Đống Đa",
    "Hai Bà Trưng",
    "Thanh Xuân",
    "Nam Từ Liêm",
  ],
  "TP. Hồ Chí Minh": [
    "Bến Nghé",
    "Bến Thành",
    "Tân Định",
    "Thảo Điền",
    "An Khánh",
    "Phú Nhuận",
    "Tân Thuận Đông",
  ],
  "Đà Nẵng": ["Hải Châu 1", "Hải Châu 2", "Thanh Khê Đông", "An Hải Bắc"],
  "Hải Phòng": ["Lạch Tray", "Cát Bi", "Hàng Kênh", "Đằng Lâm"],
  "Cần Thơ": ["An Cư", "An Hội", "Hưng Lợi", "Cái Khế"],
};

type QuickRangeOption = {
  id: string;
  label: string;
  min?: number;
  max?: number;
  special?: boolean;
};

type RangeFilterState = {
  min: number;
  max: number;
  quickId?: string;
  specialLabel?: string;
};

const areaQuickOptions: QuickRangeOption[] = [
  { id: "all", label: "Tất cả diện tích", min: 0, max: 500 },
  { id: "under-30", label: "Dưới 30m²", min: 0, max: 30 },
  { id: "30-50", label: "30-50m²", min: 30, max: 50 },
  { id: "50-80", label: "50-80m²", min: 50, max: 80 },
  { id: "80-100", label: "80-100m²", min: 80, max: 100 },
  { id: "100-150", label: "100-150m²", min: 100, max: 150 },
  { id: "150-200", label: "150-200m²", min: 150, max: 200 },
  { id: "200-300", label: "200-300m²", min: 200, max: 300 },
  { id: "300-500", label: "300-500m²", min: 300, max: 500 },
  { id: "above-500", label: "Trên 500m²", min: 500, max: 500 },
];

const priceQuickOptions: QuickRangeOption[] = [
  { id: "under-0.5", label: "Dưới 500 triệu", min: 0, max: 0.5 },
  { id: "0.5-0.8", label: "500 triệu - 800 triệu", min: 0.5, max: 0.8 },
  { id: "0.8-1", label: "800 triệu - 1 tỷ", min: 0.8, max: 1 },
  { id: "1-3", label: "1-3 tỷ", min: 1, max: 3 },
  { id: "3-5", label: "3-5 tỷ", min: 3, max: 5 },
  { id: "5-10", label: "5-10 tỷ", min: 5, max: 10 },
  { id: "10-20", label: "10-20 tỷ", min: 10, max: 20 },
  { id: "20-40", label: "20-40 tỷ", min: 20, max: 40 },
  { id: "above-60", label: "Trên 60 tỷ", min: 60, max: 60 },
  { id: "deal", label: "Thỏa thuận", special: true },
];

function buildFallbackWards(province: string) {
  return Array.from(
    { length: 8 },
    (_, index) => `${province} ${String(index + 1).padStart(2, "0")}`,
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="text-[11px] font-semibold tracking-[0.18em] text-gray-500 uppercase">
      {children}
    </span>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="ring-primary/10 rounded-[28px] border border-gray-200 bg-white p-4 shadow-[0_18px_60px_-24px_rgba(15,23,42,0.35)] ring-1 sm:p-5">
      {children}
    </div>
  );
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatRangeSummary(
  state: RangeFilterState,
  unit: "m²" | "tỷ",
  decimals: number,
) {
  if (state.specialLabel) {
    return state.specialLabel;
  }

  const from = state.min.toLocaleString("vi-VN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
  const to = state.max.toLocaleString("vi-VN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });

  return `${from} - ${to} ${unit}`;
}

function RangePopoverField({
  label,
  title,
  unit,
  value,
  onApply,
  min,
  max,
  step,
  quickOptions,
  decimalPlaces,
}: {
  label: string;
  title: string;
  unit: "m²" | "tỷ";
  value: RangeFilterState;
  onApply: (nextValue: RangeFilterState) => void;
  min: number;
  max: number;
  step: number;
  quickOptions: QuickRangeOption[];
  decimalPlaces: number;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<RangeFilterState>(value);

  const sliderValue: [number, number] = [draft.min, draft.max];
  const isSpecial = Boolean(draft.specialLabel);
  const canReset =
    draft.min !== min ||
    draft.max !== max ||
    Boolean(draft.specialLabel) ||
    draft.quickId !== undefined;

  const setRange = (nextMin: number, nextMax: number) => {
    const boundedMin = clampValue(nextMin, min, max);
    const boundedMax = clampValue(nextMax, min, max);

    setDraft((prev) => ({
      ...prev,
      min: Math.min(boundedMin, boundedMax),
      max: Math.max(boundedMin, boundedMax),
      specialLabel: undefined,
      quickId: undefined,
    }));
  };

  const handleQuickSelect = (option: QuickRangeOption) => {
    if (option.special) {
      setDraft((prev) => ({
        ...prev,
        quickId: option.id,
        specialLabel: option.label,
      }));
      return;
    }

    const nextMin = option.min ?? min;
    const nextMax = option.max ?? max;

    setDraft({
      min: clampValue(nextMin, min, max),
      max: clampValue(nextMax, min, max),
      quickId: option.id,
      specialLabel: undefined,
    });
  };

  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) {
            setDraft(value);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="hover:border-primary/40 hover:bg-primary/5 h-10 w-full cursor-pointer justify-between rounded-2xl border-gray-200 bg-white px-3 text-sm font-medium whitespace-nowrap text-gray-500 shadow-sm transition-all"
          >
            <span className="truncate">
              {formatRangeSummary(draft, unit, decimalPlaces)}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[min(92vw,28rem)] space-y-4 p-4"
        >
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500">Từ</span>
              <div className="relative">
                <input
                  type="number"
                  value={draft.min}
                  disabled={isSpecial}
                  min={min}
                  max={max}
                  step={step}
                  onChange={(event) =>
                    setRange(Number(event.target.value), draft.max)
                  }
                  className="focus:border-primary/50 focus:ring-primary/10 h-10 w-full [appearance:textfield] rounded-xl border border-gray-200 bg-white px-3 pr-16 text-sm text-gray-500 transition-all outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-gray-100 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500">
                  {unit === "m²" ? "m²" : "Tỷ"}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500">Đến</span>
              <div className="relative">
                <input
                  type="number"
                  value={draft.max}
                  disabled={isSpecial}
                  min={min}
                  max={max}
                  step={step}
                  onChange={(event) =>
                    setRange(draft.min, Number(event.target.value))
                  }
                  className="focus:border-primary/50 focus:ring-primary/10 h-10 w-full [appearance:textfield] rounded-xl border border-gray-200 bg-white px-3 pr-16 text-sm text-gray-500 transition-all outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-gray-100 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500">
                  {unit === "m²" ? "m²" : "Tỷ"}
                </span>
              </div>
            </div>
          </div>

          <Slider
            min={min}
            max={max}
            step={step}
            disabled={isSpecial}
            value={sliderValue}
            onValueChange={(nextValue) =>
              setRange(nextValue[0] ?? min, nextValue[1] ?? max)
            }
            className="py-3"
          />

          <div className="space-y-2">
            <span className="text-xs font-medium text-gray-500">
              Lựa chọn nhanh
            </span>
            <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
              {quickOptions.map((option) => {
                const checked = draft.quickId === option.id;

                return (
                  <label
                    key={option.id}
                    className={
                      "cursor-pointer rounded-xl border px-2 py-2 text-xs transition-all " +
                      (checked
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:border-primary/40 border-gray-200 bg-white text-gray-600")
                    }
                  >
                    <input
                      type="radio"
                      name={`${label}-quick`}
                      className="sr-only"
                      checked={checked}
                      onChange={() => handleQuickSelect(option)}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={!canReset}
              className="hover:border-primary/40 hover:bg-primary/5 h-10 cursor-pointer rounded-xl border-gray-200 bg-white text-gray-600 transition-all hover:text-gray-700 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
              onClick={() =>
                setDraft({
                  min,
                  max,
                  quickId: undefined,
                  specialLabel: undefined,
                })
              }
            >
              Đặt lại
            </Button>

            <Button
              type="button"
              className="bg-primary hover:bg-primary/90 h-10 cursor-pointer rounded-xl px-4 text-white"
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
            >
              Áp dụng
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function SelectField({
  label,
  value,
  placeholder,
  onValueChange,
  options,
  icon,
  disabled = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  onValueChange: (nextValue: string) => void;
  options: string[];
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="hover:border-primary/40 hover:bg-primary/5 h-10 cursor-pointer justify-between rounded-2xl border-gray-200 bg-white px-3 text-sm font-medium whitespace-nowrap text-gray-500 shadow-sm transition-all">
          <span className="flex min-w-0 items-center gap-2">
            {icon ? (
              <span className="text-primary shrink-0">{icon}</span>
            ) : null}
            <SelectValue className="truncate" placeholder={placeholder} />
          </span>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function FilterBar({
  layout = "horizontal",
}: { layout?: "horizontal" | "vertical" } = {}) {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [keyword, setKeyword] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [propertyType, setPropertyType] = useState("");
  const [province, setProvince] = useState("");
  const [ward, setWard] = useState("");
  const [direction, setDirection] = useState("");
  const [areaFilter, setAreaFilter] = useState<RangeFilterState>({
    min: 0,
    max: 500,
    quickId: "all",
  });
  const [priceFilter, setPriceFilter] = useState<RangeFilterState>({
    min: 0,
    max: 60,
  });

  const wardOptions = useMemo(() => {
    if (!province) return [];
    return wardOptionsByProvince[province] ?? buildFallbackWards(province);
  }, [province]);

  const searchSuggestionPool = useMemo(() => {
    const allWards = Object.values(wardOptionsByProvince).flat();
    const entries = [
      ...propertyTypes,
      ...directions,
      ...provinces,
      ...allWards,
    ];

    return Array.from(new Set(entries));
  }, []);

  const keywordSuggestions = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return [];

    const matched = searchSuggestionPool
      .filter((item) => item.toLowerCase().includes(query))
      .slice(0, 7);

    const fallback = `Tìm theo từ khóa: ${keyword.trim()}`;

    if (matched.length === 0) {
      return [fallback];
    }

    return [fallback, ...matched];
  }, [keyword, searchSuggestionPool]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <SectionCard>
      <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
        <div
          className={
            layout === "vertical"
              ? "space-y-3"
              : "grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
          }
        >
          <div className="space-y-2">
            <FieldLabel>Tìm kiếm chính</FieldLabel>
            <div ref={searchRef} className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => {
                  setKeyword(event.target.value);
                  setSearchOpen(true);
                }}
                name="keyword"
                type="search"
                placeholder="Nhập đường phố hoặc từ khóa bất kỳ"
                className="focus:border-primary/50 focus:ring-primary/10 h-10 w-full rounded-2xl border border-gray-200 bg-white px-11 py-3 text-sm text-gray-500 shadow-sm transition-all outline-none placeholder:text-gray-400 focus:ring-4"
              />

              {searchOpen && keyword.trim() ? (
                <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-xl">
                  <div className="max-h-64 overflow-y-auto p-1">
                    {keywordSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="hover:bg-primary/10 w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 transition-colors"
                        onClick={() => {
                          if (suggestion.startsWith("Tìm theo từ khóa:")) {
                            setSearchOpen(false);
                            return;
                          }

                          setKeyword(suggestion);
                          setSearchOpen(false);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <Button
            type="submit"
            className={`bg-primary hover:bg-primary/90 h-10 cursor-pointer rounded-2xl px-6 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-[0_18px_40px_-18px_rgba(251,170,25,0.75)] ${layout === "vertical" ? "w-full" : "md:min-w-40"}`}
          >
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </div>

        <div
          className={
            layout === "vertical"
              ? "grid grid-cols-1 gap-3"
              : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
          }
        >
          <SelectField
            label="Loại bất động sản"
            value={propertyType}
            placeholder="Chọn loại BĐS"
            onValueChange={setPropertyType}
            options={propertyTypes}
          />

          <SelectField
            label="Tỉnh/Thành phố"
            value={province}
            placeholder="Chọn tỉnh/thành phố"
            onValueChange={(nextValue) => {
              setProvince(nextValue);
              setWard("");
            }}
            options={provinces}
          />

          <SelectField
            label="Phường/Xã"
            value={ward}
            placeholder={"Chọn phường/xã"}
            onValueChange={setWard}
            options={wardOptions}
            disabled={!province}
          />

          <div className="sm:col-span-2 xl:col-span-1">
            <RangePopoverField
              label="Diện tích"
              title="Lọc diện tích"
              unit="m²"
              min={0}
              max={500}
              step={1}
              value={areaFilter}
              onApply={setAreaFilter}
              quickOptions={areaQuickOptions}
              decimalPlaces={0}
            />
          </div>

          <div className="sm:col-span-2 xl:col-span-1">
            <RangePopoverField
              label="Mức giá"
              title="Lọc mức giá"
              unit="tỷ"
              min={0}
              max={60}
              step={0.1}
              value={priceFilter}
              onApply={setPriceFilter}
              quickOptions={priceQuickOptions}
              decimalPlaces={1}
            />
          </div>

          <SelectField
            label="Hướng nhà"
            value={direction}
            placeholder="Chọn hướng"
            onValueChange={setDirection}
            options={directions}
          />
        </div>
      </form>
    </SectionCard>
  );
}
