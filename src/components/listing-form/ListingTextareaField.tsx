"use client";

import { useFormContext } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ListingTextareaFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  rows?: number;
  className?: string;
  required?: boolean;
};

export function ListingTextareaField({
  name,
  label,
  placeholder,
  description,
  rows = 6,
  className,
  required = false,
}: ListingTextareaFieldProps) {
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
      <Textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError>{error?.message as string | undefined}</FieldError>
    </Field>
  );
}
