"use client";

import { useMemo, useState } from "react";
import { BANNER_POSITION_OPTIONS, PAGE_OPTIONS } from "@/constants/enum-options";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AdminCrudDialog from "@/components/cms/admin/AdminCrudDialog";
import { ListingCheckboxField } from "@/components/listing-form/ListingCheckboxField";
import { ListingImageField } from "@/components/listing-form/ListingImageField";
import { ListingNumberField } from "@/components/listing-form/ListingNumberField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { useToast } from "@/components/ui/use-toast";
import {
  bannerFormSchema,
  type BannerFormValues,
} from "@/schemas/admin-crud.schema";
import type { Banner } from "@/types/banner";
import type { UploadedCloudinaryImage } from "@/types/cloudinary";

const DEFAULT_VALUES: BannerFormValues = {
  title: "",
  targetLink: "",
  page: "home",
  position: "top",
  sortOrder: 1,
  isActive: true,
};

type BannerUpsertPayload = BannerFormValues & {
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

type BannerFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BannerUpsertPayload) => Promise<Banner>;
  title: string;
  description?: string;
  submitLabel: string;
  defaultValues?: Partial<BannerFormValues>;
  existingImageUrl?: string | null;
  existingImagePublicId?: string | null;
  imageRequired?: boolean;
  resourceId?: number | string;
};

type BannerFormDialogContentProps = BannerFormDialogProps & {
  resolvedDefaults: BannerFormValues;
  initialImage: UploadedCloudinaryImage | null;
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
  existingImagePublicId,
  imageRequired = true,
  resourceId,
}: BannerFormDialogProps) {
  const resolvedDefaults = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...defaultValues,
    }),
    [defaultValues],
  );

  const initialImage = useMemo<UploadedCloudinaryImage | null>(
    () =>
      existingImageUrl
        ? {
            imageUrl: existingImageUrl,
            imagePublicId: existingImagePublicId ?? null,
          }
        : null,
    [existingImagePublicId, existingImageUrl],
  );

  const formStateKey = useMemo(
    () =>
      [
        String(open),
        JSON.stringify(resolvedDefaults),
        initialImage?.imagePublicId ?? "null",
        initialImage?.imageUrl ?? "null",
        String(imageRequired),
        String(resourceId ?? "create"),
      ].join("::"),
    [imageRequired, initialImage, open, resolvedDefaults, resourceId],
  );

  return (
    <BannerFormDialogContent
      key={formStateKey}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      title={title}
      description={description}
      submitLabel={submitLabel}
      imageRequired={imageRequired}
      resourceId={resourceId}
      resolvedDefaults={resolvedDefaults}
      initialImage={initialImage}
    />
  );
}

function BannerFormDialogContent({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  submitLabel,
  imageRequired = true,
  resourceId,
  resolvedDefaults,
  initialImage,
}: BannerFormDialogContentProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<UploadedCloudinaryImage | null>(
    () => initialImage,
  );
  const [imageBusy, setImageBusy] = useState(false);
  const [draftId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  const handleSubmit: SubmitHandler<BannerFormValues> = async (values) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      if (imageRequired && !image) {
        throw new Error("Vui lòng chọn ảnh banner.");
      }

      if (imageBusy) {
        throw new Error("Vui lòng đợi ảnh tải xong trước khi lưu.");
      }

      await onSubmit({
        ...values,
        imageUrl: image ? image.imageUrl : null,
        imagePublicId: image ? image.imagePublicId : null,
      });
      toast({
        title: "Đã lưu banner",
        description: `Banner ${values.title} đã được lưu thành công.`,
        variant: "success",
      });
      setImage(null);
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
      <ListingImageField
        value={image}
        onChange={setImage}
        initialImagePublicId={initialImage?.imagePublicId ?? null}
        resourceType="banners"
        draftId={draftId}
        resourceId={resourceId}
        onBusyChange={setImageBusy}
        onErrorChange={setSubmitError}
        error={submitError}
        label="Ảnh banner"
        description="Ảnh sẽ được upload trực tiếp lên Cloudinary."
        required={imageRequired}
      />
      <ListingTextField name="targetLink" label="Target link" />
      <ListingNumberField name="sortOrder" label="Thứ tự" min={0} step="1" />
      <ListingCheckboxField name="isActive" label="Đang bật" />
    </AdminCrudDialog>
  );
}
