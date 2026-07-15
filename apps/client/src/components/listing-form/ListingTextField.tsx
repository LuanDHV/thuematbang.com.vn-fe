"use client";

import { useFormContext } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ListingTextFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.ComponentProps<"input">["inputMode"];
  step?: string;
  min?: string | number;
  max?: string | number;
  autoComplete?: string;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
};

export function ListingTextField({
  name,
  label,
  placeholder,
  description,
  required = false,
  type = "text",
  inputMode,
  step,
  min,
  max,
  autoComplete,
  className,
  readOnly,
  disabled,
}: ListingTextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <Field className={cn("flex flex-col gap-2", className)}>
      <FieldLabel htmlFor={name} className="text-heading font-semibold">
        <span>{label}</span>
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </FieldLabel>
      <Input
        id={name}
        type={type}
        inputMode={inputMode}
        step={step}
        min={min}
        max={max}
        autoComplete={autoComplete}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        {...register(name)}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError>{error?.message as string | undefined}</FieldError>
    </Field>
  );
}
