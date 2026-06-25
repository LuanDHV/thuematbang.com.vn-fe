export type NumberFieldFormat = "currency" | "area" | "number";

export function normalizeNumberInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const withoutSpaces = trimmed.replace(/\s+/g, "");
  const unsigned = withoutSpaces.startsWith("-")
    ? withoutSpaces.slice(1)
    : withoutSpaces;
  const lastComma = unsigned.lastIndexOf(",");
  const lastDot = unsigned.lastIndexOf(".");
  const lastSeparator = Math.max(lastComma, lastDot);

  let integerPart = unsigned;
  let decimalPart = "";

  if (lastSeparator >= 0) {
    integerPart = unsigned.slice(0, lastSeparator);
    decimalPart = unsigned.slice(lastSeparator + 1);
  }

  integerPart = integerPart.replace(/[.,]/g, "");
  decimalPart = decimalPart.replace(/[.,]/g, "");

  const composed =
    decimalPart.length > 0 ? `${integerPart}.${decimalPart}` : integerPart;
  const sign = withoutSpaces.startsWith("-") ? "-" : "";
  const numericValue = Number(`${sign}${composed}`);

  return Number.isFinite(numericValue) ? numericValue : undefined;
}

export function formatDisplayNumber(
  value: number | undefined,
  format: NumberFieldFormat,
) {
  if (typeof value !== "number" || Number.isNaN(value)) return "";

  const maximumFractionDigits = format === "area" ? 2 : 0;
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits,
  }).format(value);
}

export function toRawNumberString(
  value: number | undefined,
  format: NumberFieldFormat,
) {
  if (typeof value !== "number" || Number.isNaN(value)) return "";

  if (format === "area") {
    return value.toLocaleString("en-US", {
      useGrouping: false,
      maximumFractionDigits: 2,
    });
  }

  return value.toString();
}
