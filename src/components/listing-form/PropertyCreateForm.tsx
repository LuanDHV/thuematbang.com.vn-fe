"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListingCheckboxField } from "@/components/listing-form/ListingCheckboxField";
import { ListingCreateFormShell } from "@/components/listing-form/ListingCreateFormShell";
import { ListingCreateSuccessDialog } from "@/components/listing-form/ListingCreateSuccessDialog";
import { ListingImageGalleryField } from "@/components/listing-form/ListingImageGalleryField";
import { ListingLocationField } from "@/components/listing-form/ListingLocationField";
import { ListingNumberField } from "@/components/listing-form/ListingNumberField";
import { ListingPriceField } from "@/components/listing-form/ListingPriceField";
import { ListingRichTextField } from "@/components/listing-form/ListingRichTextField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { ListingTextareaField } from "@/components/listing-form/ListingTextareaField";
import { useToast } from "@/components/ui/use-toast";
import { DIRECTION_OPTIONS } from "@/constants/filter";
import {
  PROPERTY_PRIORITY_OPTIONS,
  PUBLISH_SOURCE_OPTIONS,
  PUBLISH_STATUS_OPTIONS,
} from "@/constants/enum-options";
import {
  MAX_IMAGE_FILE_COUNT,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from "@/constants/upload";
import { buildListingSlug } from "@/lib/listing/listing-slug";
import {
  normalizeGalleryImages,
  normalizePropertyCreateDefaults,
} from "@/lib/listing/listing-form";
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
  | "admin-edit-full"
  | "user-edit-limited";

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
  status: "PUBLISHED",
  isFeatured: false,
  userId: undefined,
};

function getVisibleModeFields(mode: PropertyCreateFormMode) {
  return {
    showAdminOnly: mode === "admin-edit-full",
  };
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
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [draftId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();

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

  useEffect(() => {
    const nextSlug = buildListingSlug(String(titleValue ?? ""));
    if (nextSlug !== slugValue) {
      form.setValue("slug", nextSlug, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [form, slugValue, titleValue]);

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

  const { showAdminOnly } = getVisibleModeFields(mode);

  const onSubmit: SubmitHandler<PropertyCreateFormValues> = async (values) => {
    setSubmitError(null);
    setImagesError(null);
    setSuccessOpen(false);
    setCreatedSlug(null);

    const totalImageCount =
      existingGalleryImages.length + uploadedImages.length;
    if (mode === "public-create" && totalImageCount < 1) {
      setImagesError("Vui lòng chọn ít nhất 1 ảnh cho tin đăng.");
      return;
    }

    if (galleryBusy) {
      setImagesError("Vui lòng đợi ảnh tải xong trước khi lưu.");
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
      slug: buildListingSlug(values.title),
      priorityStatus: showAdminOnly ? values.priorityStatus : undefined,
      publishSource: showAdminOnly ? values.publishSource : undefined,
      isBoosted: showAdminOnly ? Boolean(values.isBoosted) : undefined,
      boostCount: showAdminOnly ? values.boostCount : undefined,
      status: showAdminOnly ? values.status : undefined,
      isFeatured: showAdminOnly ? Boolean(values.isFeatured) : undefined,
      longitude: showAdminOnly ? values.longitude : undefined,
      latitude: showAdminOnly ? values.latitude : undefined,
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
      const createdProperty = await submitAction(payload);
      form.reset(normalizedDefaults);
      setUploadedImages([]);
      setExistingGalleryImages(initialExistingGalleryImages);

      if (showSuccessDialog) {
        setCreatedSlug(createdProperty.slug);
        setSuccessOpen(true);
      } else {
        toast({
          title: "Đã đăng tin thành công",
          description: "Tin đăng đã được lưu thành công.",
          variant: "success",
        });
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Không thể lưu tin đăng.",
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
        submitPendingLabel="Đang lưu..."
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

        {showAdminOnly ? (
          <ListingTextField name="slug" label="Slug" required readOnly />
        ) : null}

        <ListingSelectField
          name="categoryId"
          label="Danh mục"
          required
          placeholder="Chọn danh mục"
          options={categoryOptions}
        />

        {isNegotiableValue ? (
          <div className="border-hairline bg-surface text-secondary rounded-xl border px-4 py-3 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
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
            inputMode="numeric"
            min={0}
            step="1"
            format="currency"
          />
        )}
        <ListingCheckboxField name="isNegotiable" label="Thương lượng" />

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
          />
          <ListingSelectField
            name="direction"
            label="Hướng"
            placeholder="Chọn hướng"
            options={directionOptions}
            allowEmptySelection
          />
        </div>
        <ListingLocationField
          provinceName="provinceId"
          wardName="wardId"
          provinces={provinces}
          requiredProvince
        />

        <ListingTextField
          name="addressDetail"
          label="Địa chỉ chi tiết"
          placeholder="Số nhà, tên tòa nhà, hẻm..."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <ListingNumberField
            name="bedrooms"
            label="Số phòng ngủ"
            placeholder="Ví dụ: 2"
            inputMode="numeric"
            min={0}
            step="1"
          />
          <ListingNumberField
            name="bathrooms"
            label="Số phòng tắm"
            placeholder="Ví dụ: 1"
            inputMode="numeric"
            min={0}
            step="1"
          />
          <ListingNumberField
            name="floors"
            label="Số tầng"
            placeholder="Ví dụ: 3"
            inputMode="numeric"
            min={0}
            step="1"
          />
        </div>

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

        {showAdminOnly ? (
          <ListingRichTextField
            name="content"
            label="Mô tả thêm"
            placeholder="Mô tả chi tiết về tin đăng..."
          />
        ) : (
          <ListingTextareaField
            name="content"
            label="Mô tả thêm"
            placeholder="Mô tả chi tiết về tin đăng..."
            rows={8}
          />
        )}

        {showAdminOnly ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <ListingSelectField
                name="priorityStatus"
                label="Loại tin"
                options={PROPERTY_PRIORITY_OPTIONS}
              />
              <ListingSelectField
                name="publishSource"
                label="Nguồn xuất bản"
                options={PUBLISH_SOURCE_OPTIONS}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ListingSelectField
                name="status"
                label="Trạng thái"
                options={PUBLISH_STATUS_OPTIONS}
              />

              <ListingNumberField
                name="boostCount"
                label="Số lần boost"
                min={0}
                step="1"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ListingCheckboxField name="isFeatured" label="Nổi bật" />
              <ListingCheckboxField name="isBoosted" label="Đã boost" />
            </div>
          </>
        ) : null}

        <ListingImageGalleryField
          images={uploadedImages}
          onImagesChange={setUploadedImages}
          existingImages={existingGalleryImages}
          onExistingImagesChange={setExistingGalleryImages}
          label="Hình ảnh"
          description={
            mode === "public-create"
              ? "Tải lên ít nhất 1 ảnh. Ảnh sẽ được upload trực tiếp lên Cloudinary."
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
        />
      </ListingCreateFormShell>

      {showSuccessDialog ? (
        <ListingCreateSuccessDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          title="Đã đăng tin thành công"
          description="Bạn có muốn xem các nhu cầu thuê không?"
          primaryActionLabel="Xem bài đăng của tôi"
          primaryActionHref={
            createdSlug ? `/cho-thue/${createdSlug}` : "/cho-thue"
          }
          secondaryActionLabel="Trang cần thuê"
          secondaryActionHref="/can-thue"
        />
      ) : null}
    </>
  );
}
