"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEventHandler } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CloudUpload, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  deleteCloudinaryImages,
  uploadCloudinaryImagesSettled,
} from "@/lib/cloudinary-upload";

import { cn } from "@/lib/utils";
import type {
  CloudinaryUploadResourceType,
  UploadedCloudinaryImage,
} from "@/types/cloudinary";
import type { ExistingGalleryImage } from "@/types/gallery";

type ListingImageGalleryFieldProps = {
  images: UploadedCloudinaryImage[];
  onImagesChange: (images: UploadedCloudinaryImage[]) => void;
  existingImages: ExistingGalleryImage[];
  onExistingImagesChange: (images: ExistingGalleryImage[]) => void;
  onErrorChange?: (error: string | null) => void;
  onBusyChange?: (busy: boolean) => void;
  label?: string;
  description?: string;
  error?: string | null;
  required?: boolean;
  maxFiles?: number;
  maxFileSizeBytes?: number;
  concurrency?: number;
  resourceType: CloudinaryUploadResourceType;
  draftId: string;
  resourceId?: number | string;
  className?: string;
  disabled?: boolean;
};

const DEFAULT_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function getOverallUploadProgress(
  totalFiles: number,
  progressByIndex: Map<number, number>,
) {
  if (totalFiles <= 0) return 0;

  let progressSum = 0;
  for (let index = 0; index < totalFiles; index += 1) {
    progressSum += progressByIndex.get(index) ?? 0;
  }

  return Math.min(100, Math.round(progressSum / totalFiles));
}

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

export function ListingImageGalleryField({
  images,
  onImagesChange,
  existingImages,
  onExistingImagesChange,
  onErrorChange,
  onBusyChange,
  label = "Hình ảnh",
  description = "Tải lên ít nhất một ảnh.",
  error,
  required = false,
  maxFiles = 25,
  maxFileSizeBytes = DEFAULT_MAX_FILE_SIZE_BYTES,
  concurrency = 5,
  resourceType,
  draftId,
  resourceId,
  className,
  disabled = false,
}: ListingImageGalleryFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const currentImagesRef = useRef<UploadedCloudinaryImage[]>(images);
  const uploadProgressRef = useRef<Map<number, number>>(new Map());
  const uploadFileCountRef = useRef(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    currentImagesRef.current = images;
  }, [images]);

  useEffect(() => {
    onBusyChange?.(isUploading);
  }, [isUploading, onBusyChange]);

  useEffect(() => {
    return () => {
      const publicIds = currentImagesRef.current
        .map((image) => image.imagePublicId)
        .filter((publicId): publicId is string => Boolean(publicId));

      if (publicIds.length > 0) {
        void deleteCloudinaryImages(publicIds);
      }
    };
  }, []);

  const handleFilesChange: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (!selectedFiles.length || isUploading) {
      return;
    }

    const remainingSlots = Math.max(
      maxFiles - existingImages.length - images.length,
      0,
    );
    const oversizedFiles = selectedFiles.filter(
      (file) => getFileError(file, maxFileSizeBytes) !== null,
    );
    const validFiles = selectedFiles.filter(
      (file) => getFileError(file, maxFileSizeBytes) === null,
    );
    const acceptedFiles = validFiles.slice(0, remainingSlots);

    if (!acceptedFiles.length) {
      if (oversizedFiles.length > 0) {
        onErrorChange?.("Ảnh vượt quá dung lượng cho phép.");
      } else {
        onErrorChange?.(`Chỉ được chọn tối đa ${maxFiles} ảnh.`);
      }
      return;
    }

    setIsUploading(true);
    uploadProgressRef.current.clear();
    uploadFileCountRef.current = acceptedFiles.length;
    setUploadProgress(0);
    onErrorChange?.(null);

    try {
      const settledResults = await uploadCloudinaryImagesSettled(
        acceptedFiles,
        {
          resourceType,
          draftId,
          resourceId,
          concurrency,
        },
        (index, progress) => {
          uploadProgressRef.current.set(index, progress);
          setUploadProgress(
            getOverallUploadProgress(
              uploadFileCountRef.current,
              uploadProgressRef.current,
            ),
          );
        },
      );

      const nextImages = [...images];
      let successCount = 0;
      let failureCount = 0;

      settledResults.forEach((result) => {
        if (result.status === "fulfilled") {
          nextImages.push(result.value);
          successCount += 1;
        } else {
          failureCount += 1;
        }
      });

      onImagesChange(nextImages);

      if (failureCount > 0) {
        onErrorChange?.(
          successCount > 0
            ? `${failureCount} ảnh không thể tải lên.`
            : "Không thể tải ảnh lên.",
        );
      } else {
        onErrorChange?.(null);
      }
    } catch (error) {
      onErrorChange?.(
        error instanceof Error ? error.message : "Không thể tải ảnh lên.",
      );
    } finally {
      setIsUploading(false);
      uploadProgressRef.current.clear();
      uploadFileCountRef.current = 0;
      setUploadProgress(0);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
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

  const handleRemoveUploaded = async (index: number) => {
    const image = images[index];
    if (image?.imagePublicId) {
      await deleteCloudinaryImages([image.imagePublicId]);
    }

    onImagesChange(images.filter((_, current) => current !== index));
    onErrorChange?.(null);
  };

  return (
    <Field className={cn("flex flex-col gap-2", className)}>
      <FieldLabel
        htmlFor="listing-gallery-images"
        className="text-heading font-semibold"
      >
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </FieldLabel>
      <FieldDescription>{description}</FieldDescription>
      <label
        className={cn(
          "surface-card flex flex-col gap-4 border-dashed p-4 transition-colors",
          disabled
            ? "cursor-not-allowed opacity-70"
            : "hover:border-primary/25 hover:bg-primary/4 cursor-pointer",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="border-border-subtle text-primary flex size-11 items-center justify-center rounded-full border">
            <CloudUpload className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-body text-sm font-medium">
              {disabled
                ? "Chỉ xem ảnh"
                : isUploading
                  ? "Đang tải ảnh lên..."
                  : "Tải ảnh lên"}
            </p>
            {disabled ? (
              <p className="text-secondary text-xs">
                Tin đang ở chế độ chỉ xem.
              </p>
            ) : (
              <p className="text-secondary text-xs">
                Hỗ trợ các định dạng JPG, JPEG, PNG, WEBP. <br />
                Tối đa 25 ảnh, kích thước mỗi ảnh không vượt quá 2MB. <br />
                Hình ảnh không đính kèm logo, watermark hoặc số điện thoại
              </p>
            )}

            {isUploading ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-secondary">Đang upload...</span>
                  <span className="text-primary font-medium">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="bg-subtle h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-[width] duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {disabled ? null : (
          <input
            ref={inputRef}
            id="listing-gallery-images"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFilesChange}
          />
        )}
      </label>

      {existingImages.length > 0 ? (
        <div className="space-y-2">
          <p className="text-heading text-sm font-semibold">Ảnh hiện có</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {existingImages.map((image, index) => (
              <div key={image.id} className="surface-card overflow-hidden p-3">
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
                    <p className="text-secondary text-xs">Vị trí {index + 1}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={disabled || index === 0}
                      onClick={() => handleMove(index, -1)}
                    >
                      <ArrowLeft className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={disabled || index === existingImages.length - 1}
                      onClick={() => handleMove(index, 1)}
                    >
                      <ArrowRight className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={disabled}
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

      {images.length > 0 ? (
        <div className="space-y-2">
          <p className="text-heading text-sm font-semibold">Ảnh mới</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={image.imagePublicId ?? index}
                className="surface-card overflow-hidden p-3"
              >
                <Image
                  src={image.imageUrl}
                  alt={image.imagePublicId ?? "Ảnh mới"}
                  width={640}
                  height={360}
                  unoptimized
                  className="mb-3 h-32 w-full rounded-lg object-cover"
                />
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-body truncate text-sm font-medium">
                      {image.imagePublicId?.split("/").pop() ?? "Ảnh mới"}
                    </p>
                    <p className="text-secondary text-xs">Vị trí {index + 1}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={disabled || isUploading}
                    onClick={() => void handleRemoveUploaded(index)}
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
