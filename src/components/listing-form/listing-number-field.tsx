"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ListingNumberFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  className?: string;
  required?: boolean;
  inputMode?: React.ComponentProps<"input">["inputMode"];
  min?: number;
  max?: number;
  step?: string;
  suffix?: string;
  format?: "currency" | "area" | "number";
};

function normalizeNumberInput(value: string) {
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

function formatDisplayNumber(
  value: number | undefined,
  format: ListingNumberFieldProps["format"],
) {
  if (typeof value !== "number" || Number.isNaN(value)) return "";

  const maximumFractionDigits = format === "area" ? 2 : 0;
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits,
  }).format(value);
}

function toRawNumberString(
  value: number | undefined,
  format: ListingNumberFieldProps["format"],
) {
  if (typeof value !== "number" || Number.isNaN(value)) return "";

  const maximumFractionDigits = format === "area" ? 2 : 0;
  return value.toLocaleString("en-US", {
    useGrouping: false,
    maximumFractionDigits,
  });
}

export function ListingNumberField({
  name,
  label,
  placeholder,
  description,
  className,
  required = false,
  inputMode,
  min,
  max,
  step,
  suffix,
  format = "number",
}: ListingNumberFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  const suffixText = useMemo(() => {
    if (suffix) return suffix;
    if (format === "currency") return "VND";
    if (format === "area") return "m²";
    return "";
  }, [format, suffix]);

  return (
    <Field className={cn("flex flex-col gap-2", className)}>
      <FieldLabel htmlFor={name} className="text-heading font-semibold">
        <span>{label}</span>
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </FieldLabel>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <NumberInputControl
            name={name}
            inputMode={inputMode}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            suffixText={suffixText}
            value={field.value as number | undefined}
            format={format}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError>{error?.message as string | undefined}</FieldError>
    </Field>
  );
}

type NumberInputControlProps = Pick<
  ListingNumberFieldProps,
  "name" | "inputMode" | "min" | "max" | "step" | "placeholder" | "format"
> & {
  value: number | undefined;
  suffixText: string;
  onChange: (value: number | undefined) => void;
  onBlur: () => void;
};

function NumberInputControl({
  name,
  inputMode,
  min,
  max,
  step,
  placeholder,
  format,
  suffixText,
  value,
  onChange,
  onBlur,
}: NumberInputControlProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(
        value === undefined
          ? ""
          : format === "currency" || format === "area"
            ? formatDisplayNumber(value, format)
            : toRawNumberString(value, format),
      );
    }
  }, [format, isFocused, value]);

  return (
    <div className="relative">
      <Input
        id={name}
        type="text"
        inputMode={inputMode}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className={suffixText ? "pr-20" : undefined}
        value={displayValue}
        onFocus={() => {
          setIsFocused(true);
          setDisplayValue(
            value === undefined ? "" : toRawNumberString(value, format),
          );
        }}
        onChange={(event) => {
          const nextText = event.target.value;
          setDisplayValue(nextText);
          onChange(normalizeNumberInput(nextText));
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
      />
      {suffixText ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary">
          {suffixText}
        </span>
      ) : null}
    </div>
  );
}
