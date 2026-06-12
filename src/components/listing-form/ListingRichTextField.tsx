"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { LightRichTextEditor } from "./LightRichTextEditor";

type ListingRichTextFieldProps = {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
};

export function ListingRichTextField({
  name,
  label,
  description,
  placeholder,
}: ListingRichTextFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <Field className="flex flex-col gap-2">
      <FieldLabel htmlFor={name} className="text-heading font-semibold">
        {label}
      </FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <LightRichTextEditor
            value={String(field.value ?? "")}
            onChange={field.onChange}
            placeholder={placeholder}
          />
        )}
      />
      <FieldError>{error?.message as string | undefined}</FieldError>
    </Field>
  );
}
