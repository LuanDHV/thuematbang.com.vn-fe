"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import { ListingCheckboxField } from "@/components/listing-form/ListingCheckboxField";
import { ListingCreateFormShell } from "@/components/listing-form/ListingCreateFormShell";
import { ListingCreateSuccessDialog } from "@/components/listing-form/ListingCreateSuccessDialog";
import { ListingImageGalleryField } from "@/components/listing-form/ListingImageGalleryField";
import { ListingLocationField } from "@/components/listing-form/ListingLocationField";
import { ListingNumberField } from "@/components/listing-form/ListingNumberField";
import { ListingPriceField } from "@/components/listing-form/ListingPriceField";
import { ListingRichTextField } from "@/components/listing-form/ListingRichTextField";
import { ListingTextareaField } from "@/components/listing-form/ListingTextareaField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { useToast } from "@/components/ui/use-toast";
import { DIRECTION_OPTIONS } from "@/constants/filter";
import {
  MAX_IMAGE_FILE_COUNT,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from "@/constants/upload";
import { buildListingSlug } from "@/lib/listing/listing-slug";
import {
  normalizeGalleryImages,
  normalizePropertyCreateDefaults,
} from "@/lib/listing/listing-form";
import { useAuthMe } from "@/hooks/use-auth";
import {
  buildGoogleMapEmbedSrc,
  buildGoogleMapQuery,
  hasGoogleMapPreviewInput,
} from "@/lib/location/google-map";
import { getProvinceWardsAction } from "@/actions/location.actions";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track-event";
import type { Category } from "@/types/category";
import type { ExistingGalleryImage } from "@/types/gallery";
import type { Province } from "@/types/location";
import type { UploadedCloudinaryImage } from "@/types/cloudinary";
import type { Property } from "@/types/property";
import {
  propertyCreateFormSchema,
  type PropertyCreateFormValues,
} from "@/schemas/listing-create.schema";

type PropertyCreateFormMode =
  | "public-create"
  | "user-edit-limited"
  | "view-only";

type PropertyUpsertPayload = PropertyCreateFormValues & {
  removeImageIds?: number[];
  orderedExistingImageIds?: number[];
  images?: UploadedCloudinaryImage[];
};

type PropertyCreateFormProps = {
  categories: Category[];
  provinces: Province[];
  submitAction: (payload: PropertyUpsertPayload) => Promise<Property>;
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<PropertyCreateFormValues>;
  mode?: PropertyCreateFormMode;
  existingImages?: ExistingGalleryImage[];
  resourceId?: number | string;
  showSuccessDialog?: boolean;
  headerAddon?: ReactNode;
};

const EMPTY_EXISTING_IMAGES: ExistingGalleryImage[] = [];

const DEFAULT_VALUES: Partial<PropertyCreateFormValues> = {
  title: "",
  slug: "",
  categoryId: undefined,
  priceAmount: undefined,
  priceUnit: "MILLION",
  price: undefined,
  isNegotiable: false,
  area: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  floors: undefined,
  direction: null,
  provinceId: undefined,
  wardId: undefined,
  contactName: "",
  contactPhone: "",
  addressDetail: "",
  longitude: undefined,
  latitude: undefined,
  content: "",
  priorityStatus: "FREE",
  publishSource: "FREE_QUOTA",
  isBoosted: false,
  boostCount: 0,
  isMatched: false,
  status: "PENDING",
  userId: undefined,
};

function getVisibleModeFields(mode: PropertyCreateFormMode) {
  return {
    isViewOnly: mode === "view-only",
  };
}

function resolvePropertyCreateErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("slug tin cho thuê đã tồn tại")) {
    return "Slug tin cho thuê đã tồn tại.";
  }

  if (normalizedMessage.includes("invalid userid")) {
    return "Tài khoản đăng tin không hợp lệ.";
  }

  if (normalizedMessage.includes("failed to create property")) {
    return "Không thể lưu tin đăng. Vui lòng thử lại.";
  }

  return message || "Không thể lưu tin đăng. Vui lòng thử lại.";
}

export function PropertyCreateForm({
  categories,
  provinces,
  submitAction,
  title,
  description,
  submitLabel,
  defaultValues,
  mode = "public-create",
  existingImages,
  resourceId,
  showSuccessDialog = true,
  headerAddon,
}: PropertyCreateFormProps) {
  const resolvedDefaults = useMemo(
    () =>
      ({
        ...DEFAULT_VALUES,
        ...normalizePropertyCreateDefaults(defaultValues),
      }) as PropertyCreateFormValues,
    [defaultValues],
  );

  const normalizedDefaults = useMemo(
    () => ({
      ...resolvedDefaults,
      priorityStatus:
        resolvedDefaults.priorityStatus ?? DEFAULT_VALUES.priorityStatus,
      publishSource:
        resolvedDefaults.publishSource ?? DEFAULT_VALUES.publishSource,
      status: resolvedDefaults.status ?? DEFAULT_VALUES.status,
    }),
    [resolvedDefaults],
  );

  const normalizedExistingImages = useMemo(
    () => normalizeGalleryImages(existingImages ?? EMPTY_EXISTING_IMAGES),
    [existingImages],
  );

  const formStateKey = useMemo(() => {
    const defaultsKey = JSON.stringify(normalizedDefaults);
    const imagesKey = normalizedExistingImages
      .map((image) => `${image.id}:${image.sortOrder}:${image.imageUrl}`)
      .join("|");

    return `${defaultsKey}::${imagesKey}`;
  }, [normalizedDefaults, normalizedExistingImages]);

  return (
    <PropertyCreateFormContent
      key={formStateKey}
      categories={categories}
      provinces={provinces}
      submitAction={submitAction}
      title={title}
      description={description}
      submitLabel={submitLabel}
      normalizedDefaults={normalizedDefaults}
      initialExistingGalleryImages={normalizedExistingImages}
      resourceId={resourceId}
      mode={mode}
      showSuccessDialog={showSuccessDialog}
      headerAddon={headerAddon}
    />
  );
}

type PropertyCreateFormContentProps = PropertyCreateFormProps & {
  normalizedDefaults: PropertyCreateFormValues;
  initialExistingGalleryImages: ExistingGalleryImage[];
};

function PropertyCreateFormContent({
  categories,
  provinces,
  submitAction,
  title,
  description,
  submitLabel,
  normalizedDefaults,
  initialExistingGalleryImages,
  resourceId,
  mode = "public-create",
  showSuccessDialog = true,
  headerAddon,
}: PropertyCreateFormContentProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [existingGalleryImages, setExistingGalleryImages] = useState<
    ExistingGalleryImage[]
  >(() => initialExistingGalleryImages);
  const [uploadedImages, setUploadedImages] = useState<
    UploadedCloudinaryImage[]
  >([]);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [draftId] = useState(() => crypto.randomUUID());
  const trackedStartedRef = useRef(false);
  const { toast } = useToast();
  const { data: authUser } = useAuthMe();

  const form = useForm<PropertyCreateFormValues>({
    resolver: zodResolver(propertyCreateFormSchema) as never,
    defaultValues: normalizedDefaults,
    mode: "onSubmit",
  });

  const titleValue = useWatch({
    control: form.control,
    name: "title",
  });
  const slugValue = useWatch({
    control: form.control,
    name: "slug",
  });
  const isNegotiableValue = useWatch({
    control: form.control,
    name: "isNegotiable",
  });
  const selectedProvinceId = useWatch({
    control: form.control,
    name: "provinceId",
  });
  const selectedWardId = useWatch({
    control: form.control,
    name: "wardId",
  });
  const addressDetailValue = useWatch({
    control: form.control,
    name: "addressDetail",
  });
  const longitudeValue = useWatch({
    control: form.control,
    name: "longitude",
  });
  const latitudeValue = useWatch({
    control: form.control,
    name: "latitude",
  });
  const watchedValues = useWatch({
    control: form.control,
  });
  const provinceIdNumber = Number(selectedProvinceId || 0);
  const { data: wards = [] } = useQuery({
    queryKey: ["form-wards", provinceIdNumber],
    queryFn: async () => {
      if (!provinceIdNumber) return [];
      return await getProvinceWardsAction(provinceIdNumber);
    },
    enabled: Boolean(provinceIdNumber),
    staleTime: 5 * 60 * 1000,
  });

  const mapPreviewSrc = useMemo(() => {
    const province = provinces.find(
      (item) => String(item.id) === String(selectedProvinceId ?? ""),
    );
    const ward = wards.find(
      (item) => String(item.id) === String(selectedWardId ?? ""),
    );

    return buildGoogleMapEmbedSrc({
      latitude: latitudeValue,
      longitude: longitudeValue,
      query: buildGoogleMapQuery([
        addressDetailValue,
        ward?.name,
        province?.name,
        "Vietnam",
      ]),
    });
  }, [
    addressDetailValue,
    latitudeValue,
    longitudeValue,
    provinces,
    selectedProvinceId,
    selectedWardId,
    wards,
  ]);
  const showMapPreview = hasGoogleMapPreviewInput([
    addressDetailValue,
    selectedProvinceId,
    selectedWardId,
    latitudeValue,
    longitudeValue,
  ]);

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

  const { isViewOnly } = getVisibleModeFields(mode);
  const trackingEnabled = mode === "public-create";

  const getTrackingParams = (values?: Partial<PropertyCreateFormValues>) => ({
    listing_type: "property",
    listing_title: values?.title ?? form.getValues("title"),
    category_id: values?.categoryId ?? form.getValues("categoryId"),
    province_id: values?.provinceId ?? form.getValues("provinceId"),
    ward_id: values?.wardId ?? form.getValues("wardId"),
    price_amount: values?.priceAmount ?? form.getValues("priceAmount"),
    price_unit: values?.priceUnit ?? form.getValues("priceUnit"),
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
    trackEvent(ANALYTICS_EVENTS.propertyFormStarted, getTrackingParams());
  }, [trackingEnabled, watchedValues]);

  const onSubmit: SubmitHandler<PropertyCreateFormValues> = async (values) => {
    setSubmitError(null);
    setImagesError(null);
    setSuccessOpen(false);

    if (trackingEnabled) {
      trackEvent(
        ANALYTICS_EVENTS.propertyFormSubmitClicked,
        getTrackingParams(values),
      );
    }

    const totalImageCount =
      existingGalleryImages.length + uploadedImages.length;
    if (mode === "public-create" && totalImageCount < 1) {
      setImagesError("Vui lòng chọn ít nhất 1 ảnh cho tin đăng.");
      if (trackingEnabled) {
        trackEvent(ANALYTICS_EVENTS.propertyFormFailed, {
          ...getTrackingParams(values),
          reason: "missing_images",
        });
      }
      return;
    }

    if (galleryBusy) {
      setImagesError("Vui lòng đợi ảnh tải xong trước khi lưu.");
      if (trackingEnabled) {
        trackEvent(ANALYTICS_EVENTS.propertyFormFailed, {
          ...getTrackingParams(values),
          reason: "gallery_busy",
        });
      }
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

    const resolvedStatus =
      mode === "user-edit-limited" ? "PENDING" : values.status;

    const basePayload = {
      ...values,
      slug: buildListingSlug(values.title),
      priorityStatus: undefined,
      publishSource: undefined,
      isBoosted: undefined,
      boostCount: undefined,
      status: resolvedStatus,
      longitude: undefined,
      latitude: undefined,
      userId: values.userId,
      images: uploadedImages,
    };
    const payload: PropertyUpsertPayload =
      initialExistingGalleryImages.length > 0
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
      if (trackingEnabled) {
        trackEvent(
          ANALYTICS_EVENTS.propertyFormCompleted,
          getTrackingParams(values),
        );
      }

      if (showSuccessDialog) {
        setSuccessOpen(true);
      } else {
        const isUserEditResubmit = mode === "user-edit-limited";
        toast({
          title: isUserEditResubmit
            ? "Tin đã được gửi lại duyệt"
            : "Tin đã được gửi",
          description: "Tin đăng đang đợi duyệt trước khi hiển thị công khai.",
          variant: "success",
        });
      }

      form.reset(normalizedDefaults);
      setUploadedImages([]);
      setExistingGalleryImages(initialExistingGalleryImages);
    } catch (error) {
      setSubmitError(resolvePropertyCreateErrorMessage(error));
      if (trackingEnabled) {
        trackEvent(ANALYTICS_EVENTS.propertyFormFailed, {
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
            placeholder="0901234567"
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
          placeholder="Ví dụ: Mặt bằng kinh doanh quận 1"
          autoComplete="off"
          disabled={isViewOnly}
        />

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
            name="price"
            amountName="priceAmount"
            unitName="priceUnit"
            label="Giá"
            required
            placeholder="Nhập giá"
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
        <div className="grid gap-4 md:grid-cols-3">
          <ListingNumberField
            name="bedrooms"
            label="Số phòng ngủ"
            placeholder="Ví dụ: 2"
            inputMode="numeric"
            min={0}
            step="1"
            disabled={isViewOnly}
          />
          <ListingNumberField
            name="bathrooms"
            label="Số phòng tắm"
            placeholder="Ví dụ: 1"
            inputMode="numeric"
            min={0}
            step="1"
            disabled={isViewOnly}
          />
          <ListingNumberField
            name="floors"
            label="Số tầng"
            placeholder="Ví dụ: 3"
            inputMode="numeric"
            min={0}
            step="1"
            disabled={isViewOnly}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ListingNumberField
            name="area"
            label="Diện tích"
            required
            placeholder="Nhập diện tích"
            inputMode="decimal"
            min={0}
            step="0.1"
            format="area"
            disabled={isViewOnly}
          />
          <ListingSelectField
            name="direction"
            label="Hướng"
            placeholder="Chọn hướng"
            options={directionOptions}
            allowEmptySelection
            disabled={isViewOnly}
          />
        </div>

        <ListingLocationField
          provinceName="provinceId"
          wardName="wardId"
          provinces={provinces}
          requiredProvince
          disabled={isViewOnly}
        />

        <ListingTextField
          name="addressDetail"
          label="Địa chỉ chi tiết"
          placeholder="Số nhà, tên tòa nhà, hẻm..."
          disabled={isViewOnly}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <ListingNumberField
            name="latitude"
            label="Vĩ độ"
            inputMode="decimal"
            step="0.000001"
            disabled={isViewOnly}
          />
          <ListingNumberField
            name="longitude"
            label="Kinh độ"
            inputMode="decimal"
            step="0.000001"
            disabled={isViewOnly}
          />
        </div>

        {showMapPreview && mapPreviewSrc ? (
          <section className="space-y-3">
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-heading text-sm font-semibold">
                Xem trước bản đồ
              </h2>
            </div>
            <p className="text-secondary text-sm">
              Bản đồ được hiển thị gợi ý từ địa chỉ, phường/xã và tỉnh/thành.
              Nếu bạn nhập tọa độ, hệ thống sẽ ưu tiên để hiển thị chính xác
              hơn.
            </p>
            <iframe
              title="Xem trước vị trí trên bản đồ"
              src={mapPreviewSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-hairline h-80 w-full rounded-2xl border"
            />
          </section>
        ) : null}

        {mode === "public-create" ? (
          <ListingTextareaField
            name="content"
            label="Mô tả thêm"
            placeholder="Mô tả chi tiết về tin đăng..."
            disabled={isViewOnly}
          />
        ) : (
          <ListingRichTextField
            name="content"
            label="Mô tả thêm"
            placeholder="Mô tả chi tiết về tin đăng..."
            readOnly={isViewOnly}
          />
        )}

        <ListingImageGalleryField
          images={uploadedImages}
          onImagesChange={setUploadedImages}
          existingImages={existingGalleryImages}
          onExistingImagesChange={setExistingGalleryImages}
          label="Hình ảnh"
          description={
            mode === "public-create"
              ? "Tải lên ít nhất 1 ảnh."
              : "Quản lý ảnh cũ và tải thêm ảnh mới."
          }
          required={mode === "public-create"}
          error={imagesError}
          onErrorChange={setImagesError}
          onBusyChange={setGalleryBusy}
          maxFiles={MAX_IMAGE_FILE_COUNT}
          maxFileSizeBytes={MAX_IMAGE_FILE_SIZE_BYTES}
          resourceType="properties"
          draftId={draftId}
          resourceId={resourceId}
          disabled={isViewOnly}
        />
      </ListingCreateFormShell>

      {showSuccessDialog ? (
        <ListingCreateSuccessDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          title="Tin đã được gửi"
          description="Tin đăng đang đợi duyệt trước khi hiển thị công khai."
          primaryActionLabel="Theo dõi trạng thái"
          primaryActionHref="/quan-li-tai-khoan/cho-thue"
          secondaryActionLabel="Xem nhu cầu thuê"
          secondaryActionHref="/can-thue"
        />
      ) : null}
    </>
  );
}
