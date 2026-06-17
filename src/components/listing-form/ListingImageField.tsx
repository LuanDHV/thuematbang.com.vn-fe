"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  deleteCloudinaryImages,
  uploadCloudinaryImage,
} from "@/lib/cloudinary-upload";
import { cn } from "@/lib/utils";
import type {
  CloudinaryUploadResourceType,
  UploadedCloudinaryImage,
} from "@/types/cloudinary";

type ListingImageFieldProps = {
  value: UploadedCloudinaryImage | null;
  onChange: (image: UploadedCloudinaryImage | null) => void;
  onErrorChange?: (error: string | null) => void;
  onBusyChange?: (busy: boolean) => void;
  label?: string;
  description?: string;
  error?: string | null;
  required?: boolean;
  maxFileSizeBytes?: number;
  resourceType: CloudinaryUploadResourceType;
  draftId: string;
  initialImagePublicId?: string | null;
  className?: string;
};

const DEFAULT_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function getFileError(file: File, maxFileSizeBytes: number) {
  const maxFileSizeInMb = Math.floor(maxFileSizeBytes / 1024 / 1024);

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Định dạng ảnh không hợp lệ. Vui lòng chọn JPEG, JPG, PNG hoặc WEBP.";
  }

  if (file.size > maxFileSizeBytes) {
    return `Ảnh vượt quá ${maxFileSizeInMb}MB.`;
  }

  return null;
}

export function ListingImageField({
  value,
  onChange,
  onErrorChange,
  onBusyChange,
  label = "Hình ảnh",
  description = "Tải lên ít nhất 1 ảnh. Ảnh sẽ được upload trực tiếp lên Cloudinary.",
  error,
  required = false,
  maxFileSizeBytes = DEFAULT_MAX_FILE_SIZE_BYTES,
  resourceType,
  draftId,
  initialImagePublicId = null,
  className,
}: ListingImageFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const currentValueRef = useRef<UploadedCloudinaryImage | null>(value);
  const initialPublicIdRef = useRef<string | null>(initialImagePublicId);
  const localPreviewUrlRef = useRef<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    currentValueRef.current = value;
  }, [value]);

  useEffect(() => {
    initialPublicIdRef.current = initialImagePublicId;
  }, [initialImagePublicId]);

  useEffect(() => {
    onBusyChange?.(isUploading);
  }, [isUploading, onBusyChange]);

  useEffect(() => {
    return () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }

      const currentValue = currentValueRef.current;
      if (
        currentValue?.imagePublicId &&
        currentValue.imagePublicId !== initialPublicIdRef.current
      ) {
        void deleteCloudinaryImages([currentValue.imagePublicId]);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilesChange: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const file = event.target.files?.[0] ?? null;
    if (!file || isUploading) {
      return;
    }

    const fileError = getFileError(file, maxFileSizeBytes);
    if (fileError) {
      setUploadProgress(0);
      onErrorChange?.(fileError);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    onErrorChange?.(null);

    const previewUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(previewUrl);
    localPreviewUrlRef.current = previewUrl;

    const previousValue = currentValueRef.current;
    try {
      const uploadedImage = await uploadCloudinaryImage(
        file,
        { resourceType, draftId },
        setUploadProgress,
      );

      onChange(uploadedImage);
      onErrorChange?.(null);

      if (
        previousValue?.imagePublicId &&
        previousValue.imagePublicId !== initialPublicIdRef.current
      ) {
        void deleteCloudinaryImages([previousValue.imagePublicId]);
      }
    } catch (error) {
      onErrorChange?.(
        error instanceof Error ? error.message : "Không thể tải ảnh lên.",
      );
    } finally {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setLocalPreviewUrl(null);
      localPreviewUrlRef.current = null;
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    const currentValue = currentValueRef.current;
    if (
      currentValue?.imagePublicId &&
      currentValue.imagePublicId !== initialPublicIdRef.current
    ) {
      await deleteCloudinaryImages([currentValue.imagePublicId]);
    }

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
      localPreviewUrlRef.current = null;
    }

    onChange(null);
    onErrorChange?.(null);
  };

  const displayUrl = localPreviewUrl ?? value?.imageUrl ?? null;

  return (
    <Field className={cn("flex flex-col gap-2", className)}>
      <FieldLabel
        htmlFor="listing-image"
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
              {isUploading ? "Đang tải ảnh lên..." : "Chọn ảnh từ máy tính"}
            </p>
            <p className="text-secondary text-xs">
              Định dạng JPEG, JPG, PNG hoặc WEBP. Tối đa 2MB.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          id="listing-image"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFilesChange}
        />
      </label>

      {displayUrl ? (
        <div className="surface-card overflow-hidden p-3">
          <Image
            src={displayUrl}
            alt={value?.imagePublicId ?? "Image preview"}
            width={960}
            height={540}
            unoptimized
            className="mb-3 h-40 w-full rounded-lg object-cover"
          />
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-body truncate text-sm font-medium">
                {value?.imagePublicId
                  ? value.imagePublicId.split("/").pop()
                  : "Ảnh đã chọn"}
              </p>
              {isUploading ? (
                <p className="text-secondary text-xs">
                  Đang tải lên {uploadProgress}%
                </p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => void handleRemove()}
              disabled={isUploading}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <FieldError>{error ?? undefined}</FieldError>
    </Field>
  );
}
