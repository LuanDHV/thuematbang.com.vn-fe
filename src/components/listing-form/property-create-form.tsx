"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListingCheckboxField } from "@/components/listing-form/listing-checkbox-field";
import { ListingImageField } from "@/components/listing-form/listing-image-field";
import { ListingLocationField } from "@/components/listing-form/listing-location-field";
import { ListingNumberField } from "@/components/listing-form/listing-number-field";
import { ListingCreateFormShell } from "@/components/listing-form/listing-create-form-shell";
import { ListingCreateSuccessDialog } from "@/components/listing-form/listing-create-success-dialog";
import { ListingSelectField } from "@/components/listing-form/listing-select-field";
import { ListingTextField } from "@/components/listing-form/listing-text-field";
import { ListingTextareaField } from "@/components/listing-form/listing-textarea-field";
import { DIRECTION_OPTIONS } from "@/constants/filter";
import { MAX_IMAGE_FILE_SIZE_BYTES } from "@/constants/upload";
import { buildListingSlug } from "@/lib/listing-slug";
import type { Category } from "@/types/category";
import type { Province } from "@/types/location";
import type { Property } from "@/types/property";
import {
  propertyCreateFormSchema,
  type PropertyCreateFormValues,
} from "@/schemas/listing-create.schema";

type PropertyCreateFormProps = {
  categories: Category[];
  provinces: Province[];
  submitAction: (payload: FormData) => Promise<Property>;
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<PropertyCreateFormValues>;
};

const DEFAULT_VALUES: Partial<PropertyCreateFormValues> = {
  title: "",
  slug: "",
  categoryId: undefined,
  price: undefined,
  isNegotiable: false,
  area: undefined,
  direction: null,
  provinceId: undefined,
  wardId: undefined,
  contactName: "",
  contactPhone: "",
  addressDetail: "",
  content: "",
};

function appendString(
  formData: FormData,
  key: string,
  value?: string | null,
) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) return;
  formData.set(key, normalizedValue);
}

function appendNumber(formData: FormData, key: string, value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return;
  formData.set(key, String(value));
}

function isOversizedImage(file: File) {
  return file.size > MAX_IMAGE_FILE_SIZE_BYTES;
}

export function PropertyCreateForm({
  categories,
  provinces,
  submitAction,
  title,
  description,
  submitLabel,
  defaultValues,
}: PropertyCreateFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const resolvedDefaults = useMemo(
    () =>
      ({
        ...DEFAULT_VALUES,
        ...defaultValues,
      }) as PropertyCreateFormValues,
    [defaultValues],
  );

  const form = useForm<PropertyCreateFormValues>({
    resolver: zodResolver(propertyCreateFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  const titleValue = useWatch({
    control: form.control,
    name: "title",
  });

  useEffect(() => {
    form.reset(resolvedDefaults);
  }, [form, resolvedDefaults]);

  useEffect(() => {
    const nextSlug = buildListingSlug(String(titleValue ?? ""));
    form.setValue("slug", nextSlug, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [form, titleValue]);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: String(category.id),
        label: category.name,
      })),
    [categories],
  );

  const directionOptions = useMemo(
    () =>
      DIRECTION_OPTIONS.map((option) => ({
        value: option.id,
        label: option.label,
      })),
    [],
  );

  const onSubmit: SubmitHandler<PropertyCreateFormValues> = async (values) => {
    setSubmitError(null);
    setImagesError(null);
    setSuccessOpen(false);
    setCreatedSlug(null);

    if (!images.length) {
      setImagesError("Vui lòng chọn ít nhất 1 ảnh cho tin đăng.");
      return;
    }

    if (images.some(isOversizedImage)) {
      setImagesError("Kích thước ảnh không được vượt quá 2MB.");
      return;
    }

    const payload = new FormData();
    appendString(payload, "title", values.title);
    appendString(payload, "slug", buildListingSlug(values.title));
    appendNumber(payload, "categoryId", values.categoryId);
    appendNumber(payload, "price", values.price);
    appendString(
      payload,
      "isNegotiable",
      values.isNegotiable ? "true" : "false",
    );
    appendNumber(payload, "area", values.area);
    appendString(payload, "direction", values.direction);
    appendNumber(payload, "provinceId", values.provinceId);
    appendNumber(payload, "wardId", values.wardId);
    appendString(payload, "contactName", values.contactName);
    appendString(payload, "contactPhone", values.contactPhone);
    appendString(payload, "addressDetail", values.addressDetail);
    appendString(payload, "content", values.content);

    images.forEach((image) => payload.append("images", image));

    try {
      const createdProperty = await submitAction(payload);
      form.reset(resolvedDefaults);
      setImages([]);
      setCreatedSlug(createdProperty.slug);
      setSuccessOpen(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Không thể tạo tin đăng. Vui lòng thử lại.",
      );
    }
  };

  return (
    <>
      <ListingCreateFormShell
        form={form}
        onSubmit={onSubmit}
        title={title}
        description={description}
        submitLabel={submitLabel}
        submitPendingLabel="Đang tạo tin..."
        submitError={submitError}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ListingTextField
            name="contactName"
            label="Họ và tên"
            required
            placeholder="Nguyễn Văn A"
            autoComplete="name"
          />
          <ListingTextField
            name="contactPhone"
            label="Số điện thoại"
            required
            placeholder="0901234567"
            autoComplete="tel"
            type="tel"
            inputMode="tel"
          />
        </div>

      <ListingTextField
        name="title"
        label="Tiêu đề"
        required
        placeholder="Ví dụ: Mặt bằng kinh doanh quận 1"
        autoComplete="off"
      />

      <ListingSelectField
        name="categoryId"
        label="Danh mục"
        required
        placeholder="Chọn danh mục"
        options={categoryOptions}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ListingNumberField
          name="price"
          label="Giá"
          required
          placeholder="Nhập giá"
          inputMode="numeric"
          min={0}
          step="1"
          format="currency"
        />
        <ListingNumberField
          name="area"
          label="Diện tích"
          required
          placeholder="Nhập diện tích"
          inputMode="decimal"
          min={0}
          step="0.1"
          format="area"
        />
      </div>

      <ListingCheckboxField
        name="isNegotiable"
        label="Thương lượng"
        description="Đánh dấu nếu bạn muốn người xem hiểu rằng mức giá có thể trao đổi thêm"
      />

      <ListingSelectField
        name="direction"
        label="Hướng"
        placeholder="Chọn hướng"
        options={directionOptions}
        allowEmptySelection
      />

      <ListingLocationField
        provinceName="provinceId"
        wardName="wardId"
        provinces={provinces}
        requiredProvince
        requiredWard
      />

      <ListingTextField
        name="addressDetail"
        label="Địa chỉ chi tiết"
        placeholder="Số nhà, tên tòa nhà, hẻm..."
      />

      <ListingTextareaField
        name="content"
        label="Mô tả thêm"
        placeholder="Mô tả chi tiết về tin đăng..."
      />

        <ListingImageField
          files={images}
          onFilesChange={setImages}
          onErrorChange={setImagesError}
          required
          error={imagesError}
          maxFileSizeBytes={MAX_IMAGE_FILE_SIZE_BYTES}
        />
      </ListingCreateFormShell>

      <ListingCreateSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Đã đăng tin thành công"
        description="Bạn có muốn xem các nhu cầu thuê không?"
        primaryActionLabel="Xem bài đăng của tôi"
        primaryActionHref={createdSlug ? `/cho-thue/${createdSlug}` : "/cho-thue"}
        secondaryActionLabel="Trang cần thuê"
        secondaryActionHref="/can-thue"
      />
    </>
  );
}
