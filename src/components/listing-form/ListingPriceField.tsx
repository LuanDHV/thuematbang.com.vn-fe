"use client";

import { useState } from "react";
import type React from "react";
import { Controller, useFormContext } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { normalizeNumberInput } from "@/lib/form/number-input";
import { cn } from "@/lib/utils";

const LISTING_PRICE_UNIT_OPTIONS = [
  { value: "MILLION", label: "Triệu" },
  { value: "BILLION", label: "Tỷ" },
  { value: "THOUSAND_PER_M2", label: "Nghìn/m²" },
  { value: "MILLION_PER_M2", label: "Triệu/m²" },
] as const;

type ListingPriceFieldProps = {
  name: string;
  amountName?: string;
  unitName?: string;
  label: string;
  placeholder?: string;
  description?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  inputMode?: React.ComponentProps<"input">["inputMode"];
  min?: number;
  max?: number;
  step?: string;
  format?: string;
  amountStep?: string;
  amountMin?: number;
  amountMax?: number;
};

export function ListingPriceField({
  name,
  amountName,
  unitName,
  label,
  placeholder = "Nhập giá",
  description,
  className,
  required = false,
  disabled = false,
  inputMode = "decimal",
  min,
  max,
  step,
  amountStep,
  amountMin,
  amountMax,
}: ListingPriceFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const resolvedAmountName = amountName ?? `${name}Amount`;
  const resolvedUnitName = unitName ?? `${name}Unit`;

  const resolvedAmountMin = amountMin ?? min;
  const resolvedAmountMax = amountMax ?? max;
  const resolvedAmountStep = amountStep ?? step ?? "0.1";
  const amountError = errors[resolvedAmountName];
  const unitError = errors[resolvedUnitName];

  return (
    <Field className={cn("flex flex-col gap-2", className)}>
      <FieldLabel
        htmlFor={resolvedAmountName}
        className="text-heading font-semibold"
      >
        <span>{label}</span>
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </FieldLabel>

      <div className="grid gap-3 md:grid-cols-2">
        <Controller
          control={control}
          name={resolvedAmountName}
          render={({ field }) => (
            <PriceAmountInput
              id={resolvedAmountName}
              value={field.value as number | undefined}
              inputMode={inputMode}
              min={resolvedAmountMin}
              max={resolvedAmountMax}
              step={resolvedAmountStep}
              placeholder={placeholder}
              disabled={disabled}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        <Controller
          control={control}
          name={resolvedUnitName}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={resolvedUnitName}
                aria-label={`${label} - đơn vị`}
              >
                <SelectValue placeholder="Chọn đơn vị" />
              </SelectTrigger>
              <SelectContent>
                {LISTING_PRICE_UNIT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={[amountError, unitError]} />
    </Field>
  );
}

type PriceAmountInputProps = Pick<
  React.ComponentProps<typeof Input>,
  "id" | "inputMode" | "min" | "max" | "step" | "placeholder" | "disabled"
> & {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur: () => void;
};

function PriceAmountInput({
  id,
  value,
  inputMode,
  min,
  max,
  step,
  placeholder,
  disabled,
  onChange,
  onBlur,
}: PriceAmountInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [draftValue, setDraftValue] = useState("");

  const displayValue = isFocused
    ? draftValue
    : typeof value === "number"
      ? value.toString()
      : "";

  return (
    <Input
      id={id}
      type="text"
      inputMode={inputMode}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      value={displayValue}
      onFocus={() => {
        setIsFocused(true);
        setDraftValue(typeof value === "number" ? value.toString() : "");
      }}
      onChange={(event) => {
        setDraftValue(event.target.value);
      }}
      onBlur={(event) => {
        const nextValue = normalizeNumberInput(draftValue);
        onChange(nextValue);
        setIsFocused(false);
        onBlur();
        event.currentTarget.value = nextValue?.toString() ?? "";
      }}
    />
  );
}
