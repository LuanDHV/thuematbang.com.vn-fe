"use client";

import { useEffect, useMemo, useState } from "react";
import { BANNER_POSITION_OPTIONS, PAGE_OPTIONS } from "@/constants/enum-options";
import Image from "next/image";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AdminCrudDialog from "@/components/cms/admin/AdminCrudDialog";
import { ListingCheckboxField } from "@/components/listing-form/ListingCheckboxField";
import { ListingNumberField } from "@/components/listing-form/ListingNumberField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { useToast } from "@/components/ui/use-toast";
import {
  bannerFormSchema,
  type BannerFormValues,
} from "@/schemas/admin-crud.schema";
import type { Banner } from "@/types/banner";

const DEFAULT_VALUES: BannerFormValues = {
  title: "",
  targetLink: "",
  page: "home",
  position: "top",
  sortOrder: 1,
  isActive: true,
};

type BannerFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    values: BannerFormValues,
    imageFile?: File | null,
  ) => Promise<Banner>;
  title: string;
  description?: string;
  submitLabel: string;
  defaultValues?: Partial<BannerFormValues>;
  existingImageUrl?: string | null;
  imageRequired?: boolean;
};

export default function BannerFormDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  submitLabel,
  defaultValues,
  existingImageUrl,
  imageRequired = true,
}: BannerFormDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    existingImageUrl ?? null,
  );
  const { toast } = useToast();

  const resolvedDefaults = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...defaultValues,
    }),
    [defaultValues],
  );

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!open) return;
    form.reset(resolvedDefaults);
    setSubmitError(null);
    setIsSubmitting(false);
    setImageFile(null);
    setImagePreview(existingImageUrl ?? null);
  }, [existingImageUrl, form, open, resolvedDefaults]);

  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleSubmit: SubmitHandler<BannerFormValues> = async (values) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      if (imageRequired && !imageFile && !existingImageUrl) {
        throw new Error("Vui lòng chọn ảnh banner.");
      }
      await onSubmit(values, imageFile);
      toast({
        title: "Đã lưu banner",
        description: `Banner ${values.title} đã được lưu thành công.`,
        variant: "success",
      });
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Không thể lưu banner.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminCrudDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={title}
      description={description}
      submitLabel={submitLabel}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ListingTextField name="title" label="Tiêu đề" required />
      <ListingSelectField name="page" label="Trang" options={PAGE_OPTIONS} />
      <ListingSelectField
        name="position"
        label="Vị trí"
        options={BANNER_POSITION_OPTIONS}
      />
      <div className="space-y-2">
        <label
          className="text-heading text-sm font-semibold"
          htmlFor="banner-image"
        >
          Ảnh banner <span className="text-destructive">*</span>
        </label>
        <input
          id="banner-image"
          type="file"
          accept="image/*"
          className="block w-full rounded-xl border border-black/8 bg-white px-3 py-2 text-sm"
          onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
        />
        {imagePreview ? (
          <div className="overflow-hidden rounded-xl border border-black/8">
            <Image
              src={imagePreview}
              alt="Banner preview"
              width={960}
              height={540}
              unoptimized
              className="h-40 w-full object-cover"
            />
          </div>
        ) : null}
      </div>
      <ListingTextField name="targetLink" label="Target link" />
      <ListingNumberField name="sortOrder" label="Thứ tự" min={0} step="1" />
      <ListingCheckboxField name="isActive" label="Đang bật" />
    </AdminCrudDialog>
  );
}
