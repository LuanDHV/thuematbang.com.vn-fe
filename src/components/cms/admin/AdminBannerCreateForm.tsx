"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useForm,
  type SubmitHandler,
} from "react-hook-form";

import CmsFormPageShell from "@/components/cms/shared/CmsFormPageShell";
import { ListingCheckboxField } from "@/components/listing-form/ListingCheckboxField";
import { ListingImageField } from "@/components/listing-form/ListingImageField";
import { ListingNumberField } from "@/components/listing-form/ListingNumberField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  BANNER_POSITION_OPTIONS,
  PAGE_OPTIONS,
} from "@/constants/enum-options";
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

type AdminBannerCreateFormProps = {
  submitAction: (values: BannerUpsertPayload) => Promise<Banner>;
  title: string;
  description?: string;
  submitLabel: string;
  defaultValues?: Partial<BannerFormValues>;
  existingImageUrl?: string | null;
  existingImagePublicId?: string | null;
  imageRequired?: boolean;
  resourceId?: number | string;
};

export default function AdminBannerCreateForm({
  submitAction,
  title,
  description,
  submitLabel,
  defaultValues,
  existingImageUrl,
  existingImagePublicId,
  imageRequired = true,
  resourceId,
}: AdminBannerCreateFormProps) {
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
        JSON.stringify(resolvedDefaults),
        initialImage?.imagePublicId ?? "null",
        initialImage?.imageUrl ?? "null",
        String(imageRequired),
        String(resourceId ?? "create"),
      ].join("::"),
    [imageRequired, initialImage, resolvedDefaults, resourceId],
  );

  return (
    <AdminBannerCreateFormContent
      key={formStateKey}
      submitAction={submitAction}
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

type AdminBannerCreateFormContentProps = AdminBannerCreateFormProps & {
  resolvedDefaults: BannerFormValues;
  initialImage: UploadedCloudinaryImage | null;
};

function AdminBannerCreateFormContent({
  submitAction,
  title,
  description,
  submitLabel,
  imageRequired = true,
  resourceId,
  resolvedDefaults,
  initialImage,
}: AdminBannerCreateFormContentProps) {
  const { toast } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [image, setImage] = useState<UploadedCloudinaryImage | null>(
    () => initialImage,
  );
  const [imageBusy, setImageBusy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftId] = useState(() => crypto.randomUUID());

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  const handleSubmit: SubmitHandler<BannerFormValues> = async (values) => {
    setSubmitError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (imageRequired && !image) {
        throw new Error("Vui lòng chọn ảnh banner.");
      }

      if (imageBusy) {
        throw new Error("Vui lòng đợi ảnh tải xong trước khi lưu.");
      }

      await submitAction({
        ...values,
        imageUrl: image ? image.imageUrl : null,
        imagePublicId: image ? image.imagePublicId : null,
      });

      toast({
        title: "Đã lưu banner",
        description: `Banner ${values.title} đã được lưu thành công.`,
        variant: "success",
      });

      setSuccessMessage("Đã lưu banner thành công.");
      setImage(null);
      form.reset(resolvedDefaults);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Không thể lưu banner.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CmsFormPageShell>
      <FormProvider {...form}>
        <section className="surface-panel p-5">
          <div className="space-y-1">
            <h1 className="text-heading text-xl font-semibold">{title}</h1>
            {description ? (
              <p className="text-secondary text-sm">{description}</p>
            ) : null}
          </div>

          <form
            className="mt-5 space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <ListingTextField name="title" label="Tiêu đề" required />
            <ListingSelectField name="page" label="Trang" options={PAGE_OPTIONS} />
            <ListingSelectField
              name="position"
              label="Vị trí"
              options={BANNER_POSITION_OPTIONS}
            />

            <ListingTextField name="targetLink" label="Target link" />
            <ListingNumberField name="sortOrder" label="Thứ tự" min={0} step="1" />
            <ListingCheckboxField name="isActive" label="Đang bật" />

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
              required={imageRequired}
            />

            {submitError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </p>
            ) : null}

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : submitLabel}
              </Button>
            </div>
          </form>
        </section>
      </FormProvider>
    </CmsFormPageShell>
  );
}
