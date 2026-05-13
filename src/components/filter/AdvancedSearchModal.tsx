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

type FilterState = {
  propertyTypes: string[];
  city: string;
  ward: string;
  street: string;
  priceMin: string;
  priceMax: string;
  priceRange: [number, number];
  priceOptions: string[];
  negotiable: boolean;
  areaMin: string;
  areaMax: string;
  areaRange: [number, number];
  areaOptions: string[];
  bedrooms: string[];
  bathrooms: string[];
  directions: string[];
};

const PROPERTY_TYPES = [
  "Căn hộ",
  "Nhà phố",
  "Mặt bằng",
  "Văn phòng",
  "Kho xưởng",
];
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
  { id: "bac", label: "Bắc" },
  { id: "dong-bac", label: "Đông Bắc" },
  { id: "dong", label: "Đông" },
  { id: "dong-nam", label: "Đông Nam" },
  { id: "nam", label: "Nam" },
  { id: "tay-nam", label: "Tây Nam" },
  { id: "tay", label: "Tây" },
  { id: "tay-bac", label: "Tây Bắc" },
];

const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  "TP. Hồ Chí Minh": {
    "Phường Bến Nghé": ["Nguyễn Huệ", "Lê Lợi", "Đồng Khởi"],
    "Phường Thảo Điền": ["Xuân Thủy", "Quốc Hương", "Nguyễn Văn Hưởng"],
    "Phường Tân Phú": [
      "Nguyễn Lương Bằng",
      "Hoàng Quốc Việt",
      "Trần Trọng Cung",
    ],
  },
  "Hà Nội": {
    "Phường Hàng Bài": ["Tràng Tiền", "Hai Bà Trưng", "Lý Thường Kiệt"],
    "Phường Cống Vị": ["Đội Cấn", "Liễu Giai", "Ngọc Khánh"],
    "Phường Mỹ Đình": ["Hàm Nghi", "Lê Đức Thọ", "Phạm Hùng"],
  },
  "Đà Nẵng": {
    "Phường Hải Châu": ["Bạch Đằng", "Nguyễn Văn Linh", "2 Tháng 9"],
    "Phường An Hải": ["Phạm Văn Đồng", "Ngô Quyền", "Trần Hưng Đạo"],
    "Phường Hòa Xuân": ["Nam Kỳ Khởi Nghĩa", "Đa Mặn", "Lê Quảng Chí"],
  },
};

const initialFilterState: FilterState = {
  propertyTypes: [],
  city: "",
  ward: "",
  street: "",
  priceMin: "",
  priceMax: "",
  priceRange: [0, 100],
  priceOptions: [],
  negotiable: false,
  areaMin: "",
  areaMax: "",
  areaRange: [0, 300],
  areaOptions: [],
  bedrooms: [],
  bathrooms: [],
  directions: [],
};

export function AdvancedSearchModal({
  filterCount = 0,
}: {
  filterCount?: number;
}) {
  const [demandTab, setDemandTab] = useState<DemandTab>("cho-thue");
  const [detailTab, setDetailTab] = useState<DetailTab>("main");
  const [formState, setFormState] = useState<Record<DemandTab, FilterState>>({
    "cho-thue": { ...initialFilterState },
    "can-thue": { ...initialFilterState },
  });

  const current = formState[demandTab];

  const wards = current.city
    ? Object.keys(LOCATION_DATA[current.city] ?? {})
    : [];
  const streets =
    current.city && current.ward
      ? (LOCATION_DATA[current.city]?.[current.ward] ?? [])
      : [];

  const activeCount = useMemo(() => {
    const data = current;
    return [
      data.propertyTypes.length,
      data.city || data.ward || data.street ? 1 : 0,
      data.priceMin ||
      data.priceMax ||
      data.priceOptions.length ||
      data.negotiable
        ? 1
        : 0,
      data.areaMin || data.areaMax || data.areaOptions.length ? 1 : 0,
      data.bedrooms.length,
      data.bathrooms.length,
      data.directions.length,
    ].reduce((sum, value) => sum + (value > 0 ? 1 : 0), 0);
  }, [current]);

  const updateCurrent = (updater: (prev: FilterState) => FilterState) => {
    setFormState((prev) => ({
      ...prev,
      [demandTab]: updater(prev[demandTab]),
    }));
  };

  const toggleFromList = (
    key:
      | "propertyTypes"
      | "priceOptions"
      | "areaOptions"
      | "bedrooms"
      | "bathrooms"
      | "directions",
    value: string,
  ) => {
    updateCurrent((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const resetCurrent = () => {
    setFormState((prev) => ({
      ...prev,
      [demandTab]: { ...initialFilterState },
    }));
    setDetailTab("main");
  };

  const quickCellClass =
    "hover:border-primary mt-2 hover:text-primary cursor-pointer rounded-xl border border-gray-200 px-4 py-1 text-sm font-medium text-gray-600 transition-colors";
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
            onValueChange={(value) => {
              setDemandTab(value as DemandTab);
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
              <div className="flex flex-col items-start justify-center space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Loại bất động sản
                </label>
                <Button
                  variant="ghost"
                  onClick={() => setDetailTab("propertyType")}
                  className="text-primary hover:bg-primary/10 h-9 cursor-pointer rounded-full px-4"
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
                  <label className="text-sm font-semibold text-gray-800">
                    {item.label}
                  </label>
                  <button
                    type="button"
                    onClick={() => setDetailTab(item.key as DetailTab)}
                    className="mt-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 hover:bg-gray-50"
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
                <label className="text-sm font-semibold text-gray-800">
                  Số phòng ngủ
                </label>
                <div className="flex flex-wrap gap-2">
                  {BED_BATH_OPTIONS.map((value) => (
                    <button
                      key={`bed-${value}`}
                      type="button"
                      onClick={() => toggleFromList("bedrooms", value)}
                      className={`${quickCellClass} ${
                        current.bedrooms.includes(value)
                          ? selectedQuickCellClass
                          : ""
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Số phòng tắm, vệ sinh
                </label>
                <div className="flex flex-wrap gap-2">
                  {BED_BATH_OPTIONS.map((value) => (
                    <button
                      key={`bath-${value}`}
                      type="button"
                      onClick={() => toggleFromList("bathrooms", value)}
                      className={`${quickCellClass} ${
                        current.bathrooms.includes(value)
                          ? selectedQuickCellClass
                          : ""
                      }`}
                    >
                      {value}
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
                            className={`stroke-white stroke-[2.5px] transition-colors duration-200 ${
                              isSelected
                                ? "fill-primary"
                                : "fill-[#f4f4f4] group-hover:fill-gray-200"
                            }`}
                          />
                          <text
                            x={textX}
                            y={textY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`pointer-events-none text-[10px] transition-colors duration-200 ${
                              isSelected
                                ? "fill-white font-bold"
                                : "fill-gray-600 font-medium"
                            }`}
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
              {PROPERTY_TYPES.map((type) => (
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
                onValueChange={(value) =>
                  updateCurrent((prev) => ({
                    ...prev,
                    city: value,
                    ward: "",
                    street: "",
                  }))
                }
              >
                <SelectTrigger className="h-11 cursor-pointer rounded-xl border-gray-200">
                  <SelectValue placeholder="Chọn tỉnh / thành phố" />
                </SelectTrigger>
                <SelectContent className="[&::-webkit-scrollbar-thumb]:bg-primary/35 max-h-60 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {Object.keys(LOCATION_DATA).map((city) => (
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
                onValueChange={(value) =>
                  updateCurrent((prev) => ({
                    ...prev,
                    ward: value,
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
                onValueChange={(value) =>
                  updateCurrent((prev) => ({ ...prev, street: value }))
                }
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
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  value={current.priceMin}
                  onChange={(e) =>
                    updateCurrent((prev) => ({
                      ...prev,
                      priceMin: e.target.value,
                    }))
                  }
                  placeholder="Từ"
                  className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
                />
                <input
                  value={current.priceMax}
                  onChange={(e) =>
                    updateCurrent((prev) => ({
                      ...prev,
                      priceMax: e.target.value,
                    }))
                  }
                  placeholder="Đến"
                  className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
                />
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={current.priceRange}
                onValueChange={(value) =>
                  updateCurrent((prev) => ({
                    ...prev,
                    priceRange: [value[0], value[1]],
                  }))
                }
                className="cursor-pointer"
              />
              <label className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-50">
                <span className="text-sm text-gray-700">Thỏa thuận</span>
                <input
                  type="checkbox"
                  checked={current.negotiable}
                  onChange={() =>
                    updateCurrent((prev) => ({
                      ...prev,
                      negotiable: !prev.negotiable,
                    }))
                  }
                  className="accent-primary h-4 w-4 cursor-pointer"
                />
              </label>
              {PRICE_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">{option}</span>
                  <input
                    type="checkbox"
                    checked={current.priceOptions.includes(option)}
                    onChange={() => toggleFromList("priceOptions", option)}
                    className="accent-primary h-4 w-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          )}

          {detailTab === "area" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  value={current.areaMin}
                  onChange={(e) =>
                    updateCurrent((prev) => ({
                      ...prev,
                      areaMin: e.target.value,
                    }))
                  }
                  placeholder="Từ"
                  className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
                />
                <input
                  value={current.areaMax}
                  onChange={(e) =>
                    updateCurrent((prev) => ({
                      ...prev,
                      areaMax: e.target.value,
                    }))
                  }
                  placeholder="Đến"
                  className="focus:ring-primary h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-1"
                />
              </div>
              <Slider
                min={0}
                max={300}
                step={1}
                value={current.areaRange}
                onValueChange={(value) =>
                  updateCurrent((prev) => ({
                    ...prev,
                    areaRange: [value[0], value[1]],
                  }))
                }
                className="cursor-pointer"
              />
              {AREA_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">{option}</span>
                  <input
                    type="checkbox"
                    checked={current.areaOptions.includes(option)}
                    onChange={() => toggleFromList("areaOptions", option)}
                    className="accent-primary h-4 w-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>
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
            <Button className="bg-primary hover:bg-primary/90 h-11 flex-1 cursor-pointer rounded-xl text-white">
              Xem kết quả
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
