"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ChangeEventHandler } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type ListingImageFieldProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onErrorChange?: (error: string | null) => void;
  label?: string;
  description?: string;
  error?: string | null;
  required?: boolean;
  maxFiles?: number;
  maxFileSizeBytes?: number;
};

const DEFAULT_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export function ListingImageField({
  files,
  onFilesChange,
  onErrorChange,
  label = "Hình ảnh",
  description = "Tải lên ít nhất 1 ảnh. Có thể chọn nhiều ảnh cùng lúc.",
  error,
  required = false,
  maxFiles = 25,
  maxFileSizeBytes = DEFAULT_MAX_FILE_SIZE_BYTES,
}: ListingImageFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFilesChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (!selectedFiles.length) return;

    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > maxFileSizeBytes,
    );
    const validFiles = selectedFiles.filter(
      (file) => file.size <= maxFileSizeBytes,
    );
    const nextFiles = [...files, ...validFiles].slice(0, maxFiles);

    if (oversizedFiles.length > 0) {
      onErrorChange?.("Kích thước ảnh không được vượt quá 2MB.");
    } else {
      onErrorChange?.(null);
    }

    onFilesChange(nextFiles);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Field className="flex flex-col gap-2">
      <FieldLabel
        htmlFor="listing-images"
        className="text-heading font-semibold"
      >
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </FieldLabel>
      <FieldDescription>{description}</FieldDescription>

      <label className="surface-card hover:border-primary/25 hover:bg-primary/4 flex cursor-pointer flex-col gap-4 border-dashed p-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-subtle text-primary flex size-11 items-center justify-center rounded-full">
            <Upload className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-body text-sm font-medium">
              Chọn ảnh từ máy tính
            </p>
            <p className="text-secondary text-xs">
              Tối đa {maxFiles} ảnh. Kích thước mỗi ảnh không được vượt quá 2MB.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          id="listing-images"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesChange}
        />
      </label>

      {files.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="surface-card overflow-hidden p-3"
            >
              <Image
                src={previewUrls[index]}
                alt={file.name}
                width={640}
                height={360}
                unoptimized
                className="mb-3 h-32 w-full rounded-lg object-cover"
              />
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-body truncate text-sm font-medium">
                    {file.name}
                  </p>
                  <p className="text-secondary text-xs">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    const nextFiles = files.filter(
                      (_, current) => current !== index,
                    );
                    onFilesChange(nextFiles);

                    if (nextFiles.every((file) => file.size <= maxFileSizeBytes)) {
                      onErrorChange?.(null);
                    }
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <FieldError>{error ?? undefined}</FieldError>
    </Field>
  );
}
