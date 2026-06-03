import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const VI_DATE_FORMATTER = new Intl.DateTimeFormat("vi-VN");
const VI_DAY_DATE_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const VI_VND_CURRENCY_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const VI_VND_NUMBER_FORMATTER = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

type RangeOptions = {
  fallback?: string;
  lowerBoundPrefix?: string;
  upperBoundPrefix?: string;
};

function isDefinedNumber(value?: number | null): value is number {
  return typeof value === "number";
}

function formatDateWith(
  formatter: Intl.DateTimeFormat,
  date?: Date | string | null,
  fallback = "",
) {
  return date ? formatter.format(new Date(date)) : fallback;
}

function formatVndNumber(value: number) {
  return `${VI_VND_NUMBER_FORMATTER.format(value)} đ`;
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

  if (!isDefinedNumber(min) && !isDefinedNumber(max)) {
    return fallback;
  }
  if (isDefinedNumber(min) && isDefinedNumber(max)) {
    return `${unitFormatter(min)} - ${unitFormatter(max)}`;
  }
  if (isDefinedNumber(min)) {
    return `${lowerBoundPrefix} ${unitFormatter(min)}`;
  }

  return `${upperBoundPrefix} ${unitFormatter(max as number)}`;
}

function serializeSearch(search: string | { toString(): string }) {
  return typeof search === "string" ? search : search.toString();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: bigint | number) {
  return VI_VND_CURRENCY_FORMATTER.format(Number(price));
}

export function formatDate(
  date?: Date | string | null,
  fallback = "Vừa đăng",
) {
  return formatDateWith(VI_DATE_FORMATTER, date, fallback);
}

export function formatDateDisplay(
  date?: Date | string | null,
  fallback = "Chưa cập nhật",
) {
  return formatDateWith(VI_DAY_DATE_FORMATTER, date, fallback);
}

export function formatVndAmount(
  value?: number | null,
  fallback = "Chưa cập nhật",
) {
  return isDefinedNumber(value) ? formatVndNumber(value) : fallback;
}

export function formatNegotiablePrice(
  value?: number | null,
  isNegotiable = false,
  options?: {
    fallback?: string;
    negotiableLabel?: string;
  },
) {
  if (isNegotiable) {
    return options?.negotiableLabel ?? "Thỏa thuận";
  }

  return formatVndAmount(value, options?.fallback);
}

export function formatBudgetRange(
  min?: number | null,
  max?: number | null,
  options: RangeOptions = {},
) {
  return formatRange(min, max, formatVndNumber, {
    fallback: options.fallback ?? "Chưa cập nhật",
    lowerBoundPrefix: options.lowerBoundPrefix ?? "Từ",
    upperBoundPrefix: options.upperBoundPrefix ?? "Đến",
  });
}

export function formatAreaRange(
  min?: number | null,
  max?: number | null,
  options: RangeOptions = {},
) {
  return formatRange(min, max, (value) => `${value} m²`, {
    fallback: options.fallback ?? "Đang cập nhật",
    lowerBoundPrefix: options.lowerBoundPrefix ?? "Từ",
    upperBoundPrefix: options.upperBoundPrefix ?? "Dưới",
  });
}

export function formatTextSource(value: string) {
  return value.replace(/_/g, " ");
}

export function formatLocationParts(
  parts: Array<string | null | undefined>,
  fallback = "Chưa cập nhật",
) {
  const normalized = parts.filter(
    (part): part is string => typeof part === "string" && part.length > 0,
  );

  return normalized.length > 0 ? normalized.join(", ") : fallback;
}

export function buildPaginationUrl(
  pathname: string,
  search: string,
  page: number,
) {
  const nextParams = new URLSearchParams(search);

  if (page <= 1) {
    nextParams.delete("page");
  } else {
    nextParams.set("page", String(page));
  }

  const query = nextParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function createPaginationChangeHandler(
  navigate: (href: string) => void,
  pathname: string,
  search: string | { toString(): string },
  totalPages?: number,
) {
  const serializedSearch = serializeSearch(search);

  return (page: number) => {
    if (page < 1 || (typeof totalPages === "number" && page > totalPages)) {
      return;
    }

    navigate(buildPaginationUrl(pathname, serializedSearch, page));
  };
}
