import { FILTER_LIMITS } from "@/mocks/filter";

type RangeOption = {
  label: string;
  min: string;
  max: string;
  isNegotiable?: boolean;
};

type FilterValueLike = {
  priceMin: string;
  priceMax: string;
  negotiable: boolean;
  areaMin: string;
  areaMax: string;
};

export const parseNumericInput = (value: string) =>
  Number((value || "").replace(/[^\d]/g, ""));

export const millionToVnd = (million: number) => million * 1_000_000;

export const vndToMillion = (vnd: number) => Math.round(vnd / 1_000_000);

export const formatCurrencyShort = (value: number) => {
  if (!value) return "0";
  if (value >= 1_000_000_000) {
    const billion = value / 1_000_000_000;
    return `${Number.isInteger(billion) ? billion : billion.toFixed(1)} tỷ`;
  }
  const million = value / 1_000_000;
  return `${Number.isInteger(million) ? million : million.toFixed(1)} triệu`;
};

export const formatArea = (value: number) => `${value.toLocaleString("vi-VN")} m²`;

export const resolvePriceSummary = (
  value: FilterValueLike,
  options: RangeOption[],
) => {
  const selectedOption = options.find(
    (option) =>
      value.priceMin === option.min &&
      value.priceMax === option.max &&
      Boolean(option.isNegotiable) === value.negotiable,
  );

  if (selectedOption) return selectedOption.label;
  if (value.negotiable) return "Thỏa thuận";
  if (value.priceMin || value.priceMax) {
    const min = parseNumericInput(value.priceMin) || 0;
    const max = parseNumericInput(value.priceMax);
    return `${formatCurrencyShort(min)} - ${max ? formatCurrencyShort(max) : "max"}`;
  }
  return "Tất cả";
};

export const resolveAreaSummary = (
  value: FilterValueLike,
  options: RangeOption[],
) => {
  const selectedOption = options.find(
    (option) => value.areaMin === option.min && value.areaMax === option.max,
  );

  if (selectedOption) return selectedOption.label;
  if (value.areaMin || value.areaMax) {
    return `${value.areaMin ? formatArea(Number(value.areaMin)) : "0 m²"} - ${
      value.areaMax ? formatArea(Number(value.areaMax)) : "max"
    }`;
  }
  return "Tất cả";
};

export const toPriceRange = (
  priceMin: string,
  priceMax: string,
): [number, number] => {
  const minPrice = parseNumericInput(priceMin);
  const maxPrice = parseNumericInput(priceMax);
  return [
    minPrice > 0 ? vndToMillion(minPrice) : 0,
    maxPrice > 0 ? vndToMillion(maxPrice) : FILTER_LIMITS.PRICE_MAX_MILLION,
  ];
};

export const toAreaRange = (
  areaMin: string,
  areaMax: string,
): [number, number] => {
  const minArea = Number(areaMin || 0);
  const maxArea = Number(areaMax || 0);
  return [
    minArea > 0 ? minArea : 0,
    maxArea > 0 ? maxArea : FILTER_LIMITS.AREA_MAX,
  ];
};
