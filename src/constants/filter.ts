export type RangeOption = {
  label: string;
  min: string;
  max: string;
  isNegotiable?: boolean;
};

export const FILTER_LIMITS = {
  PRICE_MAX_MILLION: 60_000,
  PRICE_MAX: 60_000_000_000,
  AREA_MAX: 500,
} as const;

export const mockFilterPropertyTypes = [
  "Văn phòng",
  "Mặt bằng",
  "Kho xưởng",
  "Khu công nghiệp",
  "Căn hộ, chung cư",
  "Trung tâm thương mại",
  "Nhà trọ, phòng trọ",
];

export const mockFilterPriceOptions: RangeOption[] = [
  { label: "Tất cả", min: "", max: "" },
  { label: "Thỏa thuận", min: "", max: "", isNegotiable: true },
  { label: "Dưới 500 triệu", min: "0", max: "500000000" },
  { label: "500 triệu - 1 tỷ", min: "500000000", max: "1000000000" },
  { label: "1 - 3 tỷ", min: "1000000000", max: "3000000000" },
  { label: "3 - 10 tỷ", min: "3000000000", max: "10000000000" },
  { label: "Trên 10 tỷ", min: "10000000000", max: "60000000000" },
];

export const mockFilterAreaOptions: RangeOption[] = [
  { label: "Tất cả", min: "", max: "" },
  { label: "Dưới 30 m²", min: "0", max: "30" },
  { label: "30 - 50 m²", min: "30", max: "50" },
  { label: "50 - 100 m²", min: "50", max: "100" },
  { label: "100 - 300 m²", min: "100", max: "300" },
  { label: "Trên 300 m²", min: "300", max: "500" },
];

export const BED_BATH_OPTIONS = ["1", "2", "3", "4", "5+"];

export const DIRECTION_OPTIONS = [
  { id: "BAC", label: "Bắc" },
  { id: "DONG_BAC", label: "Đông Bắc" },
  { id: "DONG", label: "Đông" },
  { id: "DONG_NAM", label: "Đông Nam" },
  { id: "NAM", label: "Nam" },
  { id: "TAY_NAM", label: "Tây Nam" },
  { id: "TAY", label: "Tây" },
  { id: "TAY_BAC", label: "Tây Bắc" },
] as const;
