"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListingCreateFormShell } from "@/components/listing-form/ListingCreateFormShell";
import { ListingCreateSuccessDialog } from "@/components/listing-form/ListingCreateSuccessDialog";
import { ListingCheckboxField } from "@/components/listing-form/ListingCheckboxField";
import { ListingLocationField } from "@/components/listing-form/ListingLocationField";
import { ListingNumberField } from "@/components/listing-form/ListingNumberField";
import { ListingPriceField } from "@/components/listing-form/ListingPriceField";
import { ListingRichTextField } from "@/components/listing-form/ListingRichTextField";
import { ListingTextareaField } from "@/components/listing-form/ListingTextareaField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { useToast } from "@/components/ui/use-toast";
import { DIRECTION_OPTIONS } from "@/constants/filter";
import { RENT_REQUEST_STATUS_OPTIONS } from "@/constants/enum-options";
import { buildListingSlug } from "@/lib/listing/listing-slug";
import { normalizeRentRequestFormDefaults } from "@/lib/listing/listing-form";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track-event";
import { useAuthMe } from "@/hooks/use-auth";
import type { Category } from "@/types/category";
import type { Province } from "@/types/location";
import type { RentRequest } from "@/types/rent-request";
import {
  rentRequestCreateFormSchema,
  type RentRequestCreateFormValues,
} from "@/schemas/listing-create.schema";
import type { RentRequestUpsertPayload } from "@/services/rent-request.service";

type RentRequestCreateFormMode =
  | "public-create"
  | "admin-edit-full"
  | "user-edit-limited"
  | "view-only";

type RentRequestCreateFormProps = {
  categories: Category[];
  provinces: Province[];
  submitAction: (payload: RentRequestUpsertPayload) => Promise<RentRequest>;
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<RentRequestCreateFormValues>;
  mode?: RentRequestCreateFormMode;
  showSuccessDialog?: boolean;
  headerAddon?: ReactNode;
};

const DEFAULT_VALUES: Partial<RentRequestCreateFormValues> = {
  title: "",
  slug: "",
  categoryId: undefined,
  budgetAmount: undefined,
  budgetUnit: "MILLION",
  budget: undefined,
  isNegotiable: false,
  desiredArea: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  floors: undefined,
  desiredDirection: null,
  desiredProvinceId: undefined,
  desiredWardId: undefined,
  contactName: "",
  contactPhone: "",
  requirementText: "",
  userId: undefined,
  status: "PENDING",
  isMatched: false,
};

function getVisibleModeFields(mode: RentRequestCreateFormMode) {
  return {
    showAdminOnly: mode === "admin-edit-full",
    isViewOnly: mode === "view-only",
  };
}

export function RentRequestCreateForm({
  categories,
  provinces,
  submitAction,
  title,
  description,
  submitLabel,
  defaultValues,
  mode = "public-create",
  showSuccessDialog = true,
  headerAddon,
}: RentRequestCreateFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const trackedStartedRef = useRef(false);
  const { toast } = useToast();
  const { data: authUser } = useAuthMe();

  const resolvedDefaults = useMemo(
    () =>
      ({
        ...DEFAULT_VALUES,
        ...normalizeRentRequestFormDefaults(defaultValues),
      }) as RentRequestCreateFormValues,
    [defaultValues],
  );

  const normalizedDefaults = useMemo(
    () => ({
      ...resolvedDefaults,
      status: resolvedDefaults.status ?? DEFAULT_VALUES.status,
    }),
    [resolvedDefaults],
  );

  const form = useForm<RentRequestCreateFormValues>({
    resolver: zodResolver(rentRequestCreateFormSchema) as never,
    defaultValues: normalizedDefaults,
    mode: "onSubmit",
  });

  const titleValue = useWatch({
    control: form.control,
    name: "title",
  });
  const statusValue = useWatch({
    control: form.control,
    name: "status",
  });
  const slugValue = useWatch({
    control: form.control,
    name: "slug",
  });
  const isNegotiableValue = useWatch({
    control: form.control,
    name: "isNegotiable",
  });
  const watchedValues = useWatch({
    control: form.control,
  });

  useEffect(() => {
    form.reset(normalizedDefaults);
  }, [form, normalizedDefaults]);

  useEffect(() => {
    const nextSlug = buildListingSlug(String(titleValue ?? ""));
    if (nextSlug !== slugValue) {
      form.setValue("slug", nextSlug, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [form, slugValue, titleValue]);

  useEffect(() => {
    if (mode !== "public-create" || !authUser) {
      return;
    }

    const currentName = String(form.getValues("contactName") ?? "").trim();
    const currentPhone = String(form.getValues("contactPhone") ?? "").trim();

    if (!currentName && authUser.fullName) {
      form.setValue("contactName", authUser.fullName, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }

    if (!currentPhone && authUser.phone) {
      form.setValue("contactPhone", authUser.phone, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [authUser, form, mode]);

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

  const { showAdminOnly, isViewOnly } = getVisibleModeFields(mode);
  const trackingEnabled = mode === "public-create";

  const getTrackingParams = (
    values?: Partial<RentRequestCreateFormValues>,
  ) => ({
    listing_type: "rent_request",
    listing_title: values?.title ?? form.getValues("title"),
    category_id: values?.categoryId ?? form.getValues("categoryId"),
    province_id:
      values?.desiredProvinceId ?? form.getValues("desiredProvinceId"),
    ward_id: values?.desiredWardId ?? form.getValues("desiredWardId"),
    budget_amount: values?.budgetAmount ?? form.getValues("budgetAmount"),
    budget_unit: values?.budgetUnit ?? form.getValues("budgetUnit"),
    is_negotiable: values?.isNegotiable ?? form.getValues("isNegotiable"),
  });

  useEffect(() => {
    if (
      !trackingEnabled ||
      trackedStartedRef.current ||
      !Object.values(watchedValues ?? {}).some((value) => {
        if (typeof value === "string") return value.trim().length > 0;
        return value != null && value !== false;
      })
    ) {
      return;
    }

    trackedStartedRef.current = true;
    trackEvent(ANALYTICS_EVENTS.rentRequestFormStarted, getTrackingParams());
  }, [trackingEnabled, watchedValues]);

  const onSubmit: SubmitHandler<RentRequestCreateFormValues> = async (
    values,
  ) => {
    setSubmitError(null);
    setSuccessOpen(false);

    if (trackingEnabled) {
      trackEvent(
        ANALYTICS_EVENTS.rentRequestFormSubmitClicked,
        getTrackingParams(values),
      );
    }

    const resolvedStatus =
      mode === "user-edit-limited" ? "PENDING" : values.status;

    const payload: RentRequestUpsertPayload = {
      ...values,
      slug: buildListingSlug(values.title),
      budgetAmount: values.isNegotiable ? undefined : values.budgetAmount,
      budgetUnit: values.isNegotiable ? undefined : values.budgetUnit,
      budget: values.isNegotiable ? undefined : values.budget,
      isNegotiable: values.isNegotiable,
      status: resolvedStatus,
    };

    try {
      await submitAction(payload);
      if (trackingEnabled) {
        trackEvent(
          ANALYTICS_EVENTS.rentRequestFormCompleted,
          getTrackingParams(values),
        );
      }
      if (showSuccessDialog) {
        form.reset(normalizedDefaults);
        setSuccessOpen(true);
      } else {
        toast({
          title: showAdminOnly ? "Đã lưu tin thành công" : "Tin đã được gửi",
          description: showAdminOnly
            ? "Tin đăng đã được lưu thành công."
            : "Tin đăng đang đợi duyệt trước khi hiển thị công khai.",
          variant: "success",
        });
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Không thể tạo yêu cầu thuê. Vui lòng thử lại.",
      );
      if (trackingEnabled) {
        trackEvent(ANALYTICS_EVENTS.rentRequestFormFailed, {
          ...getTrackingParams(values),
          reason: "api_error",
        });
      }
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
        submitPendingLabel="Đang lưu..."
        submitError={submitError}
        submitHidden={isViewOnly}
        headerAddon={headerAddon}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ListingTextField
            name="contactName"
            label="Họ và tên"
            required
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            disabled={isViewOnly}
          />
          <ListingTextField
            name="contactPhone"
            label="Số điện thoại"
            required
            placeholder="Nhập SĐT"
            autoComplete="tel"
            type="tel"
            inputMode="tel"
            disabled={isViewOnly}
          />
        </div>

        <ListingTextField
          name="title"
          label="Tiêu đề"
          required
          placeholder="Ví dụ: Cần thuê mặt bằng quận 3"
          autoComplete="off"
          disabled={isViewOnly}
        />

        {showAdminOnly ? (
          <ListingTextField
            name="slug"
            label="Slug"
            required
            readOnly
            disabled={isViewOnly}
          />
        ) : null}

        <ListingSelectField
          name="categoryId"
          label="Danh mục"
          required
          placeholder="Chọn danh mục"
          options={categoryOptions}
          disabled={isViewOnly}
        />

        {isNegotiableValue ? (
          <div className="border-hairline bg-surface text-secondary rounded-xl border px-4 py-3 text-sm shadow-lg">
            Tin đăng được đánh dấu là thương lượng.
          </div>
        ) : (
          <ListingPriceField
            name="budget"
            amountName="budgetAmount"
            unitName="budgetUnit"
            label="Ngân sách"
            required
            placeholder="Nhập ngân sách"
            inputMode="decimal"
            min={0}
            step="0.1"
            format="currency"
            disabled={isViewOnly}
          />
        )}
        <ListingCheckboxField
          name="isNegotiable"
          label="Thương lượng"
          disabled={isViewOnly}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <ListingNumberField
            name="desiredArea"
            label="Diện tích mong muốn"
            required
            placeholder="Nhập diện tích mong muốn"
            inputMode="decimal"
            min={0}
            step="0.1"
            format="area"
            disabled={isViewOnly}
          />

          <ListingSelectField
            name="desiredDirection"
            label="Hướng mong muốn"
            placeholder="Chọn hướng"
            options={directionOptions}
            allowEmptySelection
            disabled={isViewOnly}
          />
        </div>

        <ListingLocationField
          provinceName="desiredProvinceId"
          wardName="desiredWardId"
          provinces={provinces}
          labelProvince="Khu vực mong muốn"
          labelWard="Phường/xã mong muốn"
          requiredProvince
          disabled={isViewOnly}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <ListingNumberField
            name="bedrooms"
            label="Phòng ngủ"
            placeholder="Nhập số phòng ngủ"
            inputMode="numeric"
            min={0}
            step="1"
            disabled={isViewOnly}
          />
          <ListingNumberField
            name="bathrooms"
            label="Phòng tắm"
            placeholder="Nhập số phòng tắm"
            inputMode="numeric"
            min={0}
            step="1"
            disabled={isViewOnly}
          />
          <ListingNumberField
            name="floors"
            label="Số tầng"
            placeholder="Nhập số tầng"
            inputMode="numeric"
            min={0}
            step="1"
            disabled={isViewOnly}
          />
        </div>

        {showAdminOnly ? (
          <div className="grid items-end gap-4 md:grid-cols-2">
            <ListingSelectField
              name="status"
              label="Trạng thái"
              options={RENT_REQUEST_STATUS_OPTIONS}
              disabled={isViewOnly}
            />
            <ListingCheckboxField
              name="isMatched"
              label="Đã khớp nhu cầu"
              disabled={isViewOnly}
            />
          </div>
        ) : null}

        {showAdminOnly && statusValue === "REJECTED" ? (
          <ListingTextareaField
            name="rejectReason"
            label="Lý do từ chối"
            required
            placeholder="Nhập lý do từ chối để người đăng biết cần chỉnh sửa gì"
            disabled={isViewOnly}
          />
        ) : null}

        {mode === "public-create" ? (
          <ListingTextareaField
            name="requirementText"
            label="Mô tả thêm"
            placeholder="Mô tả rõ hơn nhu cầu cần thuê..."
            disabled={isViewOnly}
          />
        ) : (
          <ListingRichTextField
            name="requirementText"
            label="Mô tả thêm"
            placeholder="Mô tả rõ hơn nhu cầu cần thuê..."
            readOnly={isViewOnly}
          />
        )}
      </ListingCreateFormShell>

      {showSuccessDialog ? (
        <ListingCreateSuccessDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          title="Tin đã được gửi"
          description="Tin đăng đang đợi duyệt trước khi hiển thị công khai."
          primaryActionLabel="Theo dõi trạng thái"
          primaryActionHref="/quan-li-tai-khoan/can-thue"
          secondaryActionLabel="Xem tin cho thuê"
          secondaryActionHref="/dang-tin/cho-thue"
        />
      ) : null}
    </>
  );
}
