import type { PriceUnit } from "../enums/index.js";

type NumericLike = bigint | number | string;

const VI_LOCALE = "vi-VN";
const DEFAULT_DAY_MONTH_YEAR_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};
const DEFAULT_VND_NUMBER_FORMAT: Intl.NumberFormatOptions = {
  maximumFractionDigits: 0,
};
const DEFAULT_VND_CURRENCY_FORMAT: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "VND",
};

const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();
const numberFormatterCache = new Map<string, Intl.NumberFormat>();

type RangeOptions = {
  fallback?: string;
  lowerBoundPrefix?: string;
  upperBoundPrefix?: string;
};

export const PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  MILLION: "Triệu",
  BILLION: "Tỷ",
  THOUSAND_PER_M2: "Nghìn/m²",
  MILLION_PER_M2: "Triệu/m²",
};

const LISTING_PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  MILLION: "Triệu",
  BILLION: "Tỷ",
  THOUSAND_PER_M2: "Nghìn/m²",
  MILLION_PER_M2: "Triệu/m²",
};

function toNumber(value?: NumericLike | null) {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) return undefined;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function hasNumber(value?: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function getDateFormatter(options?: Intl.DateTimeFormatOptions) {
  const cacheKey = JSON.stringify(options ?? {});
  const cachedFormatter = dateFormatterCache.get(cacheKey);
  if (cachedFormatter) return cachedFormatter;
  const formatter = new Intl.DateTimeFormat(VI_LOCALE, options);
  dateFormatterCache.set(cacheKey, formatter);
  return formatter;
}

function getNumberFormatter(options?: Intl.NumberFormatOptions) {
  const cacheKey = JSON.stringify(options ?? {});
  const cachedFormatter = numberFormatterCache.get(cacheKey);
  if (cachedFormatter) return cachedFormatter;
  const formatter = new Intl.NumberFormat(VI_LOCALE, options);
  numberFormatterCache.set(cacheKey, formatter);
  return formatter;
}

function toValidDate(value?: Date | string | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateValue(
  value: Date | string | null | undefined,
  formatterOptions?: Intl.DateTimeFormatOptions,
  fallback: string | null = "",
) {
  const date = toValidDate(value);
  if (!date) return fallback;
  return getDateFormatter(formatterOptions).format(date);
}

function formatNumberValue(
  value: number | null | undefined,
  formatterOptions?: Intl.NumberFormatOptions,
) {
  if (!hasNumber(value)) return null;
  return getNumberFormatter(formatterOptions).format(value);
}

function formatVndNumber(value: number) {
  const formatted = formatNumberValue(value, DEFAULT_VND_NUMBER_FORMAT);
  return formatted ? `${formatted} đ` : "";
}

function formatPriceAmount(value: number) {
  const formatted = formatNumberValue(value, { maximumFractionDigits: 2 });
  return formatted ?? "";
}

export function formatPriceAmountWithUnit(
  amount: NumericLike | null,
  unit: PriceUnit,
  options?: { fallback?: string },
) {
  const normalizedAmount = toNumber(amount);
  if (typeof normalizedAmount !== "number") return options?.fallback ?? "";
  const formattedAmount = formatPriceAmount(normalizedAmount);
  if (!formattedAmount) return options?.fallback ?? "";
  return `${formattedAmount} ${LISTING_PRICE_UNIT_LABELS[unit] ?? PRICE_UNIT_LABELS[unit]}`;
}

function formatRange(
  min: number | null | undefined,
  max: number | null | undefined,
  unitFormatter: (value: number) => string,
  options: RangeOptions,
) {
  const fallback = options.fallback ?? "";
  const lowerBoundPrefix = options.lowerBoundPrefix ?? "Từ";
  const upperBoundPrefix = options.upperBoundPrefix ?? "Đến";
  if (!hasNumber(min) && !hasNumber(max)) return fallback;
  if (hasNumber(min) && hasNumber(max)) return `${unitFormatter(min)} - ${unitFormatter(max)}`;
  if (hasNumber(min)) return `${lowerBoundPrefix} ${unitFormatter(min)}`;
  return `${upperBoundPrefix} ${unitFormatter(max as number)}`;
}

export function formatPrice(price: NumericLike) {
  return getNumberFormatter(DEFAULT_VND_CURRENCY_FORMAT).format(toNumber(price) ?? 0);
}

export function formatNumber(
  value?: NumericLike | null,
  options: { fallback?: string; numberFormatOptions?: Intl.NumberFormatOptions } = {},
) {
  const normalizedValue = toNumber(value);
  const formatted = formatNumberValue(normalizedValue, options.numberFormatOptions);
  return formatted ?? options.fallback ?? "";
}

export function formatDate(date?: Date | string | null, fallback = "Vừa đăng") {
  return formatDateValue(date, undefined, fallback);
}

export function formatDateDisplay(date?: Date | string | null, fallback = "Chưa cập nhật") {
  return formatDateValue(date, DEFAULT_DAY_MONTH_YEAR_FORMAT, fallback);
}

export function formatTableDate(
  value?: Date | string | null,
  options: { formatOptions?: Intl.DateTimeFormatOptions } = {},
) {
  return formatDateValue(value, { ...DEFAULT_DAY_MONTH_YEAR_FORMAT, ...options.formatOptions }, null);
}

export function formatTableNumber(
  value?: number | null,
  options: { numberFormatOptions?: Intl.NumberFormatOptions } = {},
) {
  return formatNumberValue(value, options.numberFormatOptions);
}

export function formatVndAmount(value?: NumericLike | null, fallback = "Chưa cập nhật") {
  const normalizedValue = toNumber(value);
  return typeof normalizedValue === "number" ? formatVndNumber(normalizedValue) : fallback;
}

export function formatNegotiablePrice(
  value?: NumericLike | null,
  isNegotiable = false,
  options?: {
    fallback?: string;
    negotiableLabel?: string;
    amount?: NumericLike | null;
    unit?: PriceUnit | null;
  },
) {
  if (isNegotiable) return options?.negotiableLabel ?? "Thỏa thuận";
  if (typeof options?.amount !== "undefined" && options?.unit) {
    return formatPriceAmountWithUnit(options.amount, options.unit, { fallback: options?.fallback });
  }
  return formatVndAmount(value, options?.fallback);
}

export function formatListingPrice(
  value?: NumericLike | null,
  options?: {
    fallback?: string;
    amount?: NumericLike | null;
    unit?: PriceUnit | null;
    negotiable?: boolean;
    negotiableLabel?: string;
  },
) {
  if (options?.negotiable) return options.negotiableLabel ?? "Thỏa thuận";
  if (typeof options?.amount !== "undefined" && options?.unit) {
    return formatPriceAmountWithUnit(options.amount, options.unit, { fallback: options?.fallback });
  }
  return formatVndAmount(value, options?.fallback);
}

export function formatBudgetRange(
  min?: NumericLike | null,
  max?: NumericLike | null,
  options: RangeOptions = {},
) {
  return formatRange(toNumber(min), toNumber(max), formatVndNumber, {
    fallback: options.fallback ?? "Chưa cập nhật",
    lowerBoundPrefix: options.lowerBoundPrefix ?? "Từ",
    upperBoundPrefix: options.upperBoundPrefix ?? "Đến",
  });
}

export function formatAreaRange(
  min?: NumericLike | null,
  max?: NumericLike | null,
  options: RangeOptions = {},
) {
  return formatRange(toNumber(min), toNumber(max), (value) => `${value} m²`, {
    fallback: options.fallback ?? "Đang cập nhật",
    lowerBoundPrefix: options.lowerBoundPrefix ?? "Từ",
    upperBoundPrefix: options.upperBoundPrefix ?? "Dưới",
  });
}

export function formatAreaValue(value?: NumericLike | null, fallback = "Đang cập nhật") {
  const normalizedValue = toNumber(value);
  return typeof normalizedValue === "number" ? `${formatNumber(normalizedValue)} m²` : fallback;
}

export function formatTextSource(value: string) {
  return value
    .split("_")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

export function formatLocationParts(
  parts: Array<string | null | undefined>,
  fallback = "Chưa cập nhật",
) {
  const normalized = parts.filter(
    (part): part is string => typeof part === "string" && part.trim().length > 0,
  );
  return normalized.length > 0 ? normalized.map((part) => part.trim()).join(", ") : fallback;
}
