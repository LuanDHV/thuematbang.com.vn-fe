"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { buildListingSlug } from "@/lib/listing-slug";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ListingSlugFieldProps = {
  titleName: string;
  slugName: string;
  label?: string;
  placeholder?: string;
  description?: string;
};

export function ListingSlugField({
  titleName,
  slugName,
  label = "Slug",
  placeholder = "Vi-du-tin-dang-cua-ban",
  description = "Hệ thống tự gợi ý slug từ tiêu đề. Bạn có thể chỉnh tay nếu muốn.",
}: ListingSlugFieldProps) {
  const { control, setValue, formState } = useFormContext();
  const titleValue = useWatch({ control, name: titleName });
  const slugValue = useWatch({ control, name: slugName });
  const [isManual, setIsManual] = useState(false);
  const generatedSlug = useMemo(
    () => buildListingSlug(String(titleValue ?? "")),
    [titleValue],
  );
  const initialSyncDone = useRef(false);
  const error = formState.errors[slugName];

  useEffect(() => {
    if (!generatedSlug) {
      return;
    }

    if (!initialSyncDone.current) {
      initialSyncDone.current = true;
      if (!slugValue) {
        setValue(slugName, generatedSlug, {
          shouldDirty: false,
          shouldValidate: true,
        });
      }
      return;
    }

    if (!isManual) {
      setValue(slugName, generatedSlug, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [generatedSlug, isManual, setValue, slugName, slugValue]);

  return (
    <Field className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <FieldLabel htmlFor={slugName} className="text-heading font-semibold">
          {label}
        </FieldLabel>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsManual(false);
            setValue(slugName, generatedSlug, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          disabled={!generatedSlug}
        >
          Tự động
        </Button>
      </div>
      <Input
        id={slugName}
        placeholder={placeholder}
        value={slugValue ?? ""}
        onChange={(event) => {
          setIsManual(true);
          setValue(slugName, event.target.value, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
      <FieldDescription>{description}</FieldDescription>
      <FieldError>{error?.message as string | undefined}</FieldError>
    </Field>
  );
}
