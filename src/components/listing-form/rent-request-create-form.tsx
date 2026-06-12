"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListingLocationField } from "@/components/listing-form/listing-location-field";
import { ListingNumberField } from "@/components/listing-form/listing-number-field";
import { ListingCreateFormShell } from "@/components/listing-form/listing-create-form-shell";
import { ListingCreateSuccessDialog } from "@/components/listing-form/listing-create-success-dialog";
import { ListingSelectField } from "@/components/listing-form/listing-select-field";
import { ListingTextField } from "@/components/listing-form/listing-text-field";
import { ListingTextareaField } from "@/components/listing-form/listing-textarea-field";
import { DIRECTION_OPTIONS } from "@/constants/filter";
import { buildListingSlug } from "@/lib/listing-slug";
import type { Category } from "@/types/category";
import type { Province } from "@/types/location";
import type { RentRequest } from "@/types/rent-request";
import {
  rentRequestCreateFormSchema,
  type RentRequestCreateFormValues,
} from "@/schemas/listing-create.schema";

type RentRequestCreateFormProps = {
  categories: Category[];
  provinces: Province[];
  submitAction: (payload: FormData) => Promise<RentRequest>;
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<RentRequestCreateFormValues>;
};

const DEFAULT_VALUES: Partial<RentRequestCreateFormValues> = {
  title: "",
  slug: "",
  categoryId: undefined,
  budget: undefined,
  desiredArea: undefined,
  desiredDirection: null,
  desiredProvinceId: undefined,
  desiredWardId: undefined,
  contactName: "",
  contactPhone: "",
  requirementText: "",
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

export function RentRequestCreateForm({
  categories,
  provinces,
  submitAction,
  title,
  description,
  submitLabel,
  defaultValues,
}: RentRequestCreateFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const resolvedDefaults = useMemo(
    () =>
      ({
        ...DEFAULT_VALUES,
        ...defaultValues,
      }) as RentRequestCreateFormValues,
    [defaultValues],
  );

  const form = useForm<RentRequestCreateFormValues>({
    resolver: zodResolver(rentRequestCreateFormSchema) as never,
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

  const onSubmit: SubmitHandler<RentRequestCreateFormValues> = async (
    values,
  ) => {
    setSubmitError(null);
    setSuccessOpen(false);
    setCreatedSlug(null);

    const payload = new FormData();
    appendString(payload, "title", values.title);
    appendString(payload, "slug", buildListingSlug(values.title));
    appendNumber(payload, "categoryId", values.categoryId);
    appendNumber(payload, "budget", values.budget);
    appendNumber(payload, "desiredArea", values.desiredArea);
    appendString(payload, "desiredDirection", values.desiredDirection);
    appendNumber(payload, "desiredProvinceId", values.desiredProvinceId);
    appendNumber(payload, "desiredWardId", values.desiredWardId);
    appendString(payload, "contactName", values.contactName);
    appendString(payload, "contactPhone", values.contactPhone);
    appendString(payload, "requirementText", values.requirementText);

    try {
      const createdRentRequest = await submitAction(payload);
      form.reset(resolvedDefaults);
      setCreatedSlug(createdRentRequest.slug);
      setSuccessOpen(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Không thể tạo yêu cầu thuê. Vui lòng thử lại.",
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
        submitPendingLabel="Đang tạo yêu cầu..."
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
          placeholder="Ví dụ: Cần thuê mặt bằng quận 3"
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
            name="budget"
            label="Ngân sách"
            required
            placeholder="Nhập ngân sách"
            inputMode="numeric"
            min={0}
            step="1"
            format="currency"
          />
          <ListingNumberField
            name="desiredArea"
            label="Diện tích mong muốn"
            required
            placeholder="Nhập diện tích mong muốn"
            inputMode="decimal"
            min={0}
            step="0.1"
            format="area"
          />
        </div>

        <ListingSelectField
          name="desiredDirection"
          label="Hướng mong muốn"
          placeholder="Chọn hướng"
          options={directionOptions}
          allowEmptySelection
        />

        <ListingLocationField
          provinceName="desiredProvinceId"
          wardName="desiredWardId"
          provinces={provinces}
          labelProvince="Khu vực mong muốn"
          labelWard="Phường/xã mong muốn"
          requiredProvince
          requiredWard
        />

        <ListingTextareaField
          name="requirementText"
          label="Mô tả thêm"
          placeholder="Mô tả rõ hơn nhu cầu cần thuê..."
        />
      </ListingCreateFormShell>

      <ListingCreateSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Đã đăng tin thành công"
        description="Bạn có muốn xem các tin đăng không?"
        primaryActionLabel="Xem bài đăng của tôi"
        primaryActionHref={createdSlug ? `/can-thue/${createdSlug}` : "/can-thue"}
        secondaryActionLabel="Trang cho thuê"
        secondaryActionHref="/cho-thue"
      />
    </>
  );
}
