"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListingCheckboxField } from "@/components/listing-form/ListingCheckboxField";
import { ListingCreateFormShell } from "@/components/listing-form/ListingCreateFormShell";
import { ListingImageGalleryField } from "@/components/listing-form/ListingImageGalleryField";
import { ListingLocationField } from "@/components/listing-form/ListingLocationField";
import { ListingNumberField } from "@/components/listing-form/ListingNumberField";
import { ListingPriceField } from "@/components/listing-form/ListingPriceField";
import { ListingRichTextField } from "@/components/listing-form/ListingRichTextField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { useToast } from "@/components/ui/use-toast";
import { PUBLISH_STATUS_OPTIONS } from "@/constants/enum-options";
import { buildListingSlug } from "@/lib/listing/listing-slug";
import {
  normalizeGalleryImages,
  normalizeProjectFormDefaults,
} from "@/lib/listing/listing-form";
import type { ExistingGalleryImage } from "@/types/gallery";
import type { Category } from "@/types/category";
import type { Project } from "@/types/project";
import type { Province } from "@/types/location";
import type { UploadedCloudinaryImage } from "@/types/cloudinary";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "@/schemas/admin-crud.schema";

const DEFAULT_VALUES: Partial<ProjectFormValues> = {
  name: "",
  slug: "",
  categoryId: undefined,
  developer: "",
  provinceId: undefined,
  wardId: undefined,
  addressDetail: "",
  longitude: undefined,
  latitude: undefined,
  area: undefined,
  priceAmount: undefined,
  priceUnit: "MILLION",
  price: undefined,
  isNegotiable: false,
  content: "",
  status: "PUBLISHED",
};

const EMPTY_EXISTING_IMAGES: ExistingGalleryImage[] = [];

type ProjectUpsertPayload = ProjectFormValues & {
  removeImageIds?: number[];
  orderedExistingImageIds?: number[];
  images?: UploadedCloudinaryImage[];
};

type AdminProjectFormProps = {
  categories: Category[];
  provinces: Province[];
  submitAction: (payload: ProjectUpsertPayload) => Promise<Project>;
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<ProjectFormValues>;
  existingImages?: ExistingGalleryImage[];
  requireImages?: boolean;
  resourceId?: number | string;
};

export default function AdminProjectForm({
  categories,
  provinces,
  submitAction,
  title,
  description,
  submitLabel,
  defaultValues,
  existingImages,
  requireImages = false,
  resourceId,
}: AdminProjectFormProps) {
  const resolvedDefaults = useMemo(
    () =>
      ({
        ...DEFAULT_VALUES,
        ...normalizeProjectFormDefaults(defaultValues),
      }) as ProjectFormValues,
    [defaultValues],
  );

  const normalizedExistingImages = useMemo(
    () => normalizeGalleryImages(existingImages ?? EMPTY_EXISTING_IMAGES),
    [existingImages],
  );

  const formStateKey = useMemo(() => {
    const defaultsKey = JSON.stringify(resolvedDefaults);
    const imagesKey = normalizedExistingImages
      .map((image) => `${image.id}:${image.sortOrder}:${image.imageUrl}`)
      .join("|");

    return `${defaultsKey}::${imagesKey}`;
  }, [normalizedExistingImages, resolvedDefaults]);

  return (
    <AdminProjectFormContent
      key={formStateKey}
      categories={categories}
      provinces={provinces}
      submitAction={submitAction}
      title={title}
      description={description}
      submitLabel={submitLabel}
      resolvedDefaults={resolvedDefaults}
      initialExistingGalleryImages={normalizedExistingImages}
      requireImages={requireImages}
      resourceId={resourceId}
    />
  );
}

type AdminProjectFormContentProps = AdminProjectFormProps & {
  resolvedDefaults: ProjectFormValues;
  initialExistingGalleryImages: ExistingGalleryImage[];
};

function AdminProjectFormContent({
  categories,
  provinces,
  submitAction,
  title,
  description,
  submitLabel,
  resolvedDefaults,
  initialExistingGalleryImages,
  requireImages = false,
  resourceId,
}: AdminProjectFormContentProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [existingGalleryImages, setExistingGalleryImages] = useState<
    ExistingGalleryImage[]
  >(() => initialExistingGalleryImages);
  const [uploadedImages, setUploadedImages] = useState<
    UploadedCloudinaryImage[]
  >([]);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [draftId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  const nameValue = useWatch({
    control: form.control,
    name: "name",
  });
  const isNegotiableValue = useWatch({
    control: form.control,
    name: "isNegotiable",
  });

  useEffect(() => {
    const nextSlug = buildListingSlug(String(nameValue ?? ""));
    const currentSlug = String(form.getValues("slug") ?? "");
    if (nextSlug !== currentSlug) {
      form.setValue("slug", nextSlug, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [form, nameValue]);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: String(category.id),
        label: category.name,
      })),
    [categories],
  );

  const handleSubmit: SubmitHandler<ProjectFormValues> = async (values) => {
    setSubmitError(null);
    setSuccessMessage(null);

    if (galleryBusy) {
      setSubmitError("Vui lòng đợi ảnh tải xong trước khi lưu.");
      return;
    }

    if (
      requireImages &&
      existingGalleryImages.length + uploadedImages.length < 1
    ) {
      setSubmitError("Vui lòng tải lên ít nhất một ảnh cho dự án.");
      return;
    }

    const removedImageIds = initialExistingGalleryImages
      .filter(
        (image) =>
          !existingGalleryImages.some(
            (currentImage) => currentImage.id === image.id,
          ),
      )
      .map((image) => image.id);

    const basePayload = {
      ...values,
      slug: buildListingSlug(values.name),
      priceAmount: values.isNegotiable ? undefined : values.priceAmount,
      priceUnit: values.isNegotiable ? undefined : values.priceUnit,
      price: values.isNegotiable ? undefined : values.price,
      images: uploadedImages,
    };
    const payload: ProjectUpsertPayload =
      removedImageIds.length > 0 ||
      existingGalleryImages.length !== initialExistingGalleryImages.length
        ? {
            ...basePayload,
            removeImageIds: removedImageIds,
            orderedExistingImageIds: existingGalleryImages.map(
              (image) => image.id,
            ),
          }
        : basePayload;

    try {
      await submitAction(payload);
      toast({
        title: "Đã lưu dự án",
        description: "Dự án đã được cập nhật thành công.",
        variant: "success",
      });
      setSuccessMessage("Đã lưu dự án thành công.");
      setUploadedImages([]);
      setExistingGalleryImages(initialExistingGalleryImages);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Không thể lưu dự án.",
      );
    }
  };

  return (
    <ListingCreateFormShell
      form={form}
      onSubmit={handleSubmit}
      title={title}
      description={description}
      submitLabel={submitLabel}
      submitPendingLabel="Đang lưu..."
      submitError={submitError}
    >
      <ListingTextField name="name" label="Tên dự án" required />
      <ListingTextField name="slug" label="Slug" required readOnly />
      <ListingSelectField
        name="categoryId"
        label="Danh mục"
        required
        options={categoryOptions}
      />
      <ListingTextField name="developer" label="Chủ đầu tư" />
      {isNegotiableValue ? (
        <div className="border-hairline bg-surface text-secondary rounded-xl border px-4 py-3 text-sm shadow-lg">
          Dự án được đánh dấu là thương lượng.
        </div>
      ) : (
        <ListingPriceField
          name="price"
          amountName="priceAmount"
          unitName="priceUnit"
          label="Giá"
          required
          inputMode="numeric"
          step="1"
          format="currency"
        />
      )}
      <ListingCheckboxField name="isNegotiable" label="Thương lượng" />

      <ListingNumberField
        name="area"
        label="Diện tích"
        required
        inputMode="decimal"
        step="0.1"
        format="area"
      />

      <ListingLocationField
        provinceName="provinceId"
        wardName="wardId"
        provinces={provinces}
        requiredProvince
      />
      <ListingTextField name="addressDetail" label="Địa chỉ chi tiết" />
      <div className="grid gap-4 md:grid-cols-2">
        <ListingNumberField
          name="longitude"
          label="Kinh độ"
          inputMode="decimal"
          step="0.000001"
        />
        <ListingNumberField
          name="latitude"
          label="Vĩ độ"
          inputMode="decimal"
          step="0.000001"
        />
      </div>

      <ListingSelectField
        name="status"
        label="Trạng thái"
        options={PUBLISH_STATUS_OPTIONS}
      />

      <ListingRichTextField
        name="content"
        label="Nội dung"
        placeholder="Nhập nội dung dự án..."
      />

      <ListingImageGalleryField
        images={uploadedImages}
        onImagesChange={setUploadedImages}
        existingImages={existingGalleryImages}
        onExistingImagesChange={setExistingGalleryImages}
        onErrorChange={(error) => {
          setSubmitError(error);
        }}
        onBusyChange={setGalleryBusy}
        maxFiles={25}
        maxFileSizeBytes={2 * 1024 * 1024}
        resourceType="projects"
        draftId={draftId}
        resourceId={resourceId}
      />

      {successMessage ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}
    </ListingCreateFormShell>
  );
}
