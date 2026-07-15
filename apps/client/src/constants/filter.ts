import { PROPERTY_DIRECTION_OPTIONS } from "@/constants/enum-options";

export type RangeOption = {
  label: string;
  min: string;
  max: string;
  isNegotiable?: boolean;
};

export const FILTER_LIMITS = {
  PRICE_MAX: 10_000_000_000,
  PRICE_MAX_MILLION: 10_000,
  AREA_MAX: 20_000,
} as const;

export const BED_BATH_OPTIONS = ["1", "2", "3", "4", "5+"];

export const DIRECTION_OPTIONS = PROPERTY_DIRECTION_OPTIONS.map((option) => ({
  id: option.value,
  label: option.label,
}));

export const mockFilterPropertyTypes = [
  "Văn phòng",
  "Mặt bằng",
  "Kho xưởng, khu công nghiệp",
  "Căn hộ, chung cư",
  "Biệt thự",
  "Trung tâm thương mại",
  "Nhà trọ, phòng trọ",
];

export const mockFilterPriceOptions = [
  { label: "Tất cả khoảng giá", min: "", max: "" },
  { label: "Dưới 100 triệu", min: "0", max: "100000000" },
  { label: "100 triệu - 200 triệu", min: "100000000", max: "200000000" },
  { label: "200 triệu - 300 triệu", min: "200000000", max: "300000000" },
  { label: "300 triệu - 500 triệu", min: "300000000", max: "500000000" },
  { label: "500 triệu - 700 triệu", min: "500000000", max: "700000000" },
  { label: "700 triệu - 1 tỷ", min: "700000000", max: "1000000000" },
  { label: "1 - 2 tỷ", min: "1000000000", max: "2000000000" },
  { label: "2 - 3 tỷ", min: "2000000000", max: "3000000000" },
  { label: "3 - 5 tỷ", min: "3000000000", max: "5000000000" },
  { label: "5 - 7 tỷ", min: "5000000000", max: "7000000000" },
  { label: "7 - 10 tỷ", min: "7000000000", max: "10000000000" },
  { label: "Thỏa thuận", min: "", max: "", isNegotiable: true },
];

export const mockFilterAreaOptions = [
  { label: "Tất cả diện tích", min: "", max: "" },
  { label: "Dưới 50 m²", min: "0", max: "50" },
  { label: "50 m² - 100 m²", min: "50", max: "100" },
  { label: "100 m² - 200 m²", min: "100", max: "200" },
  { label: "200 m² - 500 m²", min: "200", max: "500" },
  { label: "500 m² - 1.000 m²", min: "500", max: "1000" },
  { label: "1.000 m² - 2.000 m²", min: "1000", max: "2000" },
  { label: "2.000 m² - 5.000 m²", min: "2000", max: "5000" },
  { label: "5.000 m² - 10.000 m²", min: "5000", max: "10000" },
  { label: "10.000 m² - 20.000 m²", min: "10000", max: "20000" },
];
