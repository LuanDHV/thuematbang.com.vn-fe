"use client";

import { Controller, useFormContext } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type ListingSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

const EMPTY_OPTION_VALUE = "__empty__";

type ListingSelectFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  options: readonly ListingSelectOption[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  allowEmptySelection?: boolean;
  emptyOptionLabel?: string;
};

export function ListingSelectField({
  name,
  label,
  placeholder = "Chọn một mục",
  description,
  options,
  className,
  disabled,
  required = false,
  allowEmptySelection = false,
  emptyOptionLabel = "Không chọn",
}: ListingSelectFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

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
          <Select
            value={
              allowEmptySelection && (field.value === null || field.value === undefined)
                ? EMPTY_OPTION_VALUE
                : field.value
                  ? String(field.value)
                  : ""
            }
            onValueChange={(value) => {
              field.onChange(
                allowEmptySelection && value === EMPTY_OPTION_VALUE ? null : value,
              );
            }}
            disabled={disabled}
          >
            <SelectTrigger id={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {allowEmptySelection ? (
                <SelectItem value={EMPTY_OPTION_VALUE}>{emptyOptionLabel}</SelectItem>
              ) : null}
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError>{error?.message as string | undefined}</FieldError>
    </Field>
  );
}

