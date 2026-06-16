"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListingCreateFormShell } from "@/components/listing-form/ListingCreateFormShell";
import {
  ListingImageGalleryField,
} from "@/components/listing-form/ListingImageGalleryField";
import { ListingLocationField } from "@/components/listing-form/ListingLocationField";
import { ListingNumberField } from "@/components/listing-form/ListingNumberField";
import { ListingRichTextField } from "@/components/listing-form/ListingRichTextField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import {
  appendNumber,
  appendNumberArray,
  appendString,
} from "@/lib/form/form-payload";
import {
  normalizeGalleryImages,
  normalizeProjectFormDefaults,
} from "@/lib/listing/listing-form";
import { buildListingSlug } from "@/lib/listing/listing-slug";
import { useToast } from "@/components/ui/use-toast";
import { PUBLISH_STATUS_OPTIONS } from "@/constants/enum-options";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "@/schemas/admin-crud.schema";
import type { ExistingGalleryImage } from "@/types/gallery";
import type { Category } from "@/types/category";
import type { Project } from "@/types/project";
import type { Province } from "@/types/location";

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
  price: undefined,
  content: "",
  status: "DRAFT",
};

const EMPTY_EXISTING_IMAGES: ExistingGalleryImage[] = [];

type AdminProjectFormProps = {
  categories: Category[];
  provinces: Province[];
  submitAction: (payload: FormData) => Promise<Project>;
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<ProjectFormValues>;
  existingImages?: ExistingGalleryImage[];
  requireImages?: boolean;
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
  requireImages = true,
}: AdminProjectFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<ExistingGalleryImage[]>(
    normalizeGalleryImages(existingImages ?? EMPTY_EXISTING_IMAGES),
  );
  const { toast } = useToast();
  const stableExistingImages = useMemo(
    () => normalizeGalleryImages(existingImages ?? EMPTY_EXISTING_IMAGES),
    [existingImages],
  );

  const resolvedDefaults = useMemo(
    () =>
      ({
        ...DEFAULT_VALUES,
        ...normalizeProjectFormDefaults(defaultValues),
      }) as ProjectFormValues,
    [defaultValues],
  );

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  const nameValue = useWatch({
    control: form.control,
    name: "name",
  });

  useEffect(() => {
    form.reset(resolvedDefaults);
  }, [form, resolvedDefaults]);

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

    if (requireImages && files.length + galleryImages.length < 1) {
      setSubmitError("Vui lòng tải lên ít nhất một ảnh cho dự án.");
      return;
    }

    const payload = new FormData();
    appendString(payload, "name", values.name);
    appendString(payload, "slug", buildListingSlug(values.name));
    appendNumber(payload, "categoryId", values.categoryId);
    appendString(payload, "developer", values.developer);
    appendNumber(payload, "provinceId", values.provinceId);
    appendNumber(payload, "wardId", values.wardId);
    appendString(payload, "addressDetail", values.addressDetail);
    appendNumber(payload, "longitude", values.longitude);
    appendNumber(payload, "latitude", values.latitude);
    appendNumber(payload, "area", values.area);
    appendNumber(payload, "price", values.price);
    appendString(payload, "content", values.content);
    appendString(payload, "status", values.status);

    const removedImageIds = stableExistingImages
      .filter(
        (image) =>
          !galleryImages.some((currentImage) => currentImage.id === image.id),
      )
      .map((image) => image.id);

    appendNumberArray(
      payload,
      "orderedExistingImageIds",
      galleryImages.map((image) => image.id),
    );
    appendNumberArray(payload, "removeImageIds", removedImageIds);

    files.forEach((file) => payload.append("images", file));

    try {
      await submitAction(payload);
      toast({
        title: "Đã lưu dự án",
        description: "Dự án đã được cập nhật thành công.",
        variant: "success",
      });
      setSuccessMessage("Đã lưu dự án thành công.");
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
      <div className="grid gap-4 md:grid-cols-2">
        <ListingNumberField
          name="area"
          label="Diện tích"
          required
          inputMode="decimal"
          step="0.1"
          format="area"
        />
        <ListingNumberField
          name="price"
          label="Giá"
          required
          inputMode="numeric"
          step="1"
          format="currency"
        />
      </div>
      <ListingLocationField
        provinceName="provinceId"
        wardName="wardId"
        provinces={provinces}
        requiredProvince
        requiredWard
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

      <ListingRichTextField
        name="content"
        label="Nội dung"
        placeholder="Nhập nội dung dự án..."
      />
      <ListingSelectField
        name="status"
        label="Trạng thái"
        options={PUBLISH_STATUS_OPTIONS}
      />
      <ListingImageGalleryField
        files={files}
        onFilesChange={setFiles}
        existingImages={galleryImages}
        onExistingImagesChange={setGalleryImages}
        onErrorChange={(error) => {
          setSubmitError(error);
        }}
        maxFiles={25}
        maxFileSizeBytes={2 * 1024 * 1024}
      />

      {successMessage ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}
    </ListingCreateFormShell>
  );
}

