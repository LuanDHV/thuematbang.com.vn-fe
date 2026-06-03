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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type NumericLike = bigint | number | string;

function toNumber(value?: NumericLike | null) {
  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) return undefined;

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function hasNumber(value?: number | null) {
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

  if (!hasNumber(min) && !hasNumber(max)) {
    return fallback;
  }
  if (hasNumber(min) && hasNumber(max)) {
    return `${unitFormatter(min)} - ${unitFormatter(max)}`;
  }
  if (hasNumber(min)) {
    return `${lowerBoundPrefix} ${unitFormatter(min)}`;
  }

  return `${upperBoundPrefix} ${unitFormatter(max as number)}`;
}

function serializeSearch(search: string | { toString(): string }) {
  return typeof search === "string" ? search : search.toString();
}

export function formatPrice(price: NumericLike) {
  return VI_VND_CURRENCY_FORMATTER.format(toNumber(price) ?? 0);
}

export function formatDate(date?: Date | string | null, fallback = "Vừa đăng") {
  return formatDateWith(VI_DATE_FORMATTER, date, fallback);
}

export function formatDateDisplay(
  date?: Date | string | null,
  fallback = "Chưa cập nhật",
) {
  return formatDateWith(VI_DAY_DATE_FORMATTER, date, fallback);
}

export function formatVndAmount(
  value?: NumericLike | null,
  fallback = "Chưa cập nhật",
) {
  const normalizedValue = toNumber(value);
  return typeof normalizedValue === "number"
    ? formatVndNumber(normalizedValue)
    : fallback;
}

export function formatNegotiablePrice(
  value?: NumericLike | null,
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
