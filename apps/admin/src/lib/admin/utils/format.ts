import {
  formatAreaValue,
  formatDateDisplay,
  formatListingPrice,
  formatLocationParts,
  formatNumber,
  formatVndAmount,
  PRICE_UNIT_LABELS,
  type PriceUnit,
} from "@thuematbang/contracts";

export { formatAreaValue, formatDateDisplay, formatLocationParts, formatNumber };

export function formatAdminCurrency(value?: number | string | null) {
  return formatVndAmount(value ?? null, "-");
}

export function formatAdminListingPrice(options: {
  value?: number | string | null;
  amount?: number | string | null;
  unit?: PriceUnit | null;
  negotiable?: boolean;
}) {
  return formatListingPrice(options.value ?? null, {
    amount: options.amount ?? null,
    unit: options.unit ?? null,
    negotiable: options.negotiable ?? false,
    fallback: "-",
  });
}

export function formatMetaDate(value?: string | Date | null) {
  return formatDateDisplay(value, "-");
}

export function formatBooleanLabel(value?: boolean | null, labels?: {
  trueLabel?: string;
  falseLabel?: string;
}) {
  if (value) return labels?.trueLabel ?? "Co";
  return labels?.falseLabel ?? "Khong";
}

export function formatPriceUnitLabel(value?: string | PriceUnit | null) {
  if (!value) {
    return "-";
  }

  return PRICE_UNIT_LABELS[value as PriceUnit] ?? String(value);
}
