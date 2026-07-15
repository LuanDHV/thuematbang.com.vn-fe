"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { LightRichTextEditor } from "./LightRichTextEditor";
import type { CloudinaryUploadResourceType } from "@/types/cloudinary";

type ListingRichTextFieldProps = {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  insertLink?: boolean;
  readOnly?: boolean;
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
  insertLink,
  readOnly = false,
  imageUpload,
}: ListingRichTextFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];
  const currentValue = useWatch({ control, name });

  return (
    <Field className="flex flex-col gap-2">
      <FieldLabel htmlFor={name} className="text-heading font-semibold">
        {label}
      </FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {readOnly ? (
        <div
          className="surface-card border-hairline min-h-72 rounded-xl border px-4 py-3 text-sm"
          dangerouslySetInnerHTML={{ __html: String(currentValue ?? "") }}
        />
      ) : (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <LightRichTextEditor
              value={String(field.value ?? "")}
              onChange={field.onChange}
              placeholder={placeholder}
              insertLink={insertLink}
              imageUpload={imageUpload}
            />
          )}
        />
      )}
      <FieldError>{error?.message as string | undefined}</FieldError>
    </Field>
  );
}
