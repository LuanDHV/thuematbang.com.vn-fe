"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { LightRichTextEditor } from "./LightRichTextEditor";
import type { CloudinaryUploadResourceType } from "@/types/cloudinary";

type ListingRichTextFieldProps = {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  imageUpload?: {
    resourceType: CloudinaryUploadResourceType;
    draftId: string;
    resourceId?: number | string;
  };
};

export function ListingRichTextField({
  name,
  label,
  description,
  placeholder,
  imageUpload,
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
            imageUpload={imageUpload}
          />
        )}
      />
      <FieldError>{error?.message as string | undefined}</FieldError>
    </Field>
  );
}
