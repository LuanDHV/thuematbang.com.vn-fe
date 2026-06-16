"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ChangeEventHandler } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

export type ExistingGalleryImage = {
  id: number;
  imageUrl: string;
  sortOrder?: number;
  imagePublicId?: string | null;
};

type ListingImageGalleryFieldProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  existingImages: ExistingGalleryImage[];
  onExistingImagesChange: (images: ExistingGalleryImage[]) => void;
  onErrorChange?: (error: string | null) => void;
  label?: string;
  description?: string;
  error?: string | null;
  required?: boolean;
  maxFiles?: number;
  maxFileSizeBytes?: number;
  className?: string;
};

const DEFAULT_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

function isOversized(file: File, maxFileSizeBytes: number) {
  return file.size > maxFileSizeBytes;
}

export function ListingImageGalleryField({
  files,
  onFilesChange,
  existingImages,
  onExistingImagesChange,
  onErrorChange,
  label = "Hình ảnh",
  description = "Quản lý ảnh cũ và tải thêm ảnh mới.",
  error,
  required = false,
  maxFiles = 25,
  maxFileSizeBytes = DEFAULT_MAX_FILE_SIZE_BYTES,
  className,
}: ListingImageGalleryFieldProps) {
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

    const availableSlots = Math.max(maxFiles - existingImages.length - files.length, 0);
    const oversizedFiles = selectedFiles.filter((file) =>
      isOversized(file, maxFileSizeBytes),
    );
    const validFiles = selectedFiles.filter(
      (file) => !isOversized(file, maxFileSizeBytes),
    );
    const acceptedFiles = validFiles.slice(0, availableSlots);
    const nextFiles = [...files, ...acceptedFiles];
    const hasOverflow = validFiles.length > acceptedFiles.length;
    const maxFileSizeInMb = Math.floor(maxFileSizeBytes / 1024 / 1024);

    if (oversizedFiles.length > 0 && hasOverflow) {
      onErrorChange?.(
        `Chỉ được chọn tối đa ${maxFiles} ảnh và mỗi ảnh không vượt quá ${maxFileSizeInMb}MB.`,
      );
    } else if (oversizedFiles.length > 0) {
      onErrorChange?.(
        `Kích thước ảnh không được vượt quá ${maxFileSizeInMb}MB.`,
      );
    } else if (hasOverflow) {
      onErrorChange?.(`Chỉ được chọn tối đa ${maxFiles} ảnh.`);
    } else {
      onErrorChange?.(null);
    }

    onFilesChange(nextFiles);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveExisting = (id: number) => {
    const nextImages = existingImages.filter((image) => image.id !== id);
    onExistingImagesChange(nextImages);
    onErrorChange?.(null);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= existingImages.length) return;

    const nextImages = [...existingImages];
    const [removed] = nextImages.splice(index, 1);
    nextImages.splice(nextIndex, 0, removed);
    onExistingImagesChange(nextImages);
    onErrorChange?.(null);
  };

  return (
    <Field className={cn("flex flex-col gap-2", className)}>
      <FieldLabel
        htmlFor="listing-gallery-images"
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
            <p className="text-body text-sm font-medium">Chọn ảnh từ máy tính</p>
            <p className="text-secondary text-xs">
              Đã có {existingImages.length} ảnh cũ và {files.length} ảnh mới.
              Tối đa {maxFiles} ảnh.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          id="listing-gallery-images"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesChange}
        />
      </label>

      {existingImages.length > 0 ? (
        <div className="space-y-2">
          <p className="text-heading text-sm font-semibold">Ảnh hiện có</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {existingImages.map((image, index) => (
              <div
                key={image.id}
                className="surface-card overflow-hidden p-3"
              >
                <Image
                  src={image.imageUrl}
                  alt={`Ảnh ${image.id}`}
                  width={640}
                  height={360}
                  unoptimized
                  className="mb-3 h-32 w-full rounded-lg object-cover"
                />
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-body truncate text-sm font-medium">
                      Ảnh #{image.id}
                    </p>
                    <p className="text-secondary text-xs">
                      Vị trí {index + 1}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                    >
                      <ArrowLeft className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === existingImages.length - 1}
                      onClick={() => handleMove(index, 1)}
                    >
                      <ArrowRight className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemoveExisting(image.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {files.length > 0 ? (
        <div className="space-y-2">
          <p className="text-heading text-sm font-semibold">Ảnh mới</p>
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
                      onFilesChange(files.filter((_, current) => current !== index));
                      onErrorChange?.(null);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <FieldError>{error ?? undefined}</FieldError>
    </Field>
  );
}
