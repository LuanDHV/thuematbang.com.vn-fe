"use client";

import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  formatDisplayNumber,
  normalizeNumberInput,
  toRawNumberString,
  type NumberFieldFormat,
} from "@/lib/form/number-input";
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
  format?: NumberFieldFormat;
  disabled?: boolean;
};

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
  disabled,
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
            disabled={disabled}
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
  | "name"
  | "inputMode"
  | "min"
  | "max"
  | "step"
  | "placeholder"
  | "format"
  | "disabled"
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
  disabled,
}: NumberInputControlProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [draftValue, setDraftValue] = useState("");
  const resolvedFormat = format ?? "number";

  const displayValue = isFocused
    ? draftValue
    : value === undefined
      ? ""
      : resolvedFormat === "currency" || resolvedFormat === "area"
        ? formatDisplayNumber(value, resolvedFormat)
        : toRawNumberString(value, resolvedFormat);

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
        disabled={disabled}
        value={displayValue}
        onFocus={() => {
          setIsFocused(true);
          setDraftValue(
            value === undefined ? "" : toRawNumberString(value, resolvedFormat),
          );
        }}
        onChange={(event) => {
          const nextText = event.target.value;
          setDraftValue(nextText);
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
