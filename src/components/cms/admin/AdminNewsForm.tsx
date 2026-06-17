"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListingCheckboxField } from "@/components/listing-form/ListingCheckboxField";
import { ListingCreateFormShell } from "@/components/listing-form/ListingCreateFormShell";
import { ListingImageField } from "@/components/listing-form/ListingImageField";
import { ListingRichTextField } from "@/components/listing-form/ListingRichTextField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { ListingTextareaField } from "@/components/listing-form/ListingTextareaField";
import { useToast } from "@/components/ui/use-toast";
import { PUBLISH_STATUS_OPTIONS } from "@/constants/enum-options";
import { buildListingSlug } from "@/lib/listing/listing-slug";
import type { Category } from "@/types/category";
import type { News } from "@/types/news";
import type { UploadedCloudinaryImage } from "@/types/cloudinary";
import {
  newsFormSchema,
  type NewsFormValues,
} from "@/schemas/admin-crud.schema";

const DEFAULT_VALUES: Partial<NewsFormValues> = {
  categoryId: undefined,
  title: "",
  slug: "",
  summary: "",
  content: "",
  status: "DRAFT",
  isFeatured: false,
};

type NewsUpsertPayload = NewsFormValues & {
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

type AdminNewsFormProps = {
  categories: Category[];
  submitAction: (payload: NewsUpsertPayload) => Promise<News>;
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<NewsFormValues>;
  existingImageUrl?: string | null;
  existingImagePublicId?: string | null;
  imageRequired?: boolean;
};

export default function AdminNewsForm({
  categories,
  submitAction,
  title,
  description,
  submitLabel,
  defaultValues,
  existingImageUrl,
  existingImagePublicId,
  imageRequired = true,
}: AdminNewsFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [image, setImage] = useState<UploadedCloudinaryImage | null>(
    existingImageUrl
      ? {
          imageUrl: existingImageUrl,
          imagePublicId: existingImagePublicId ?? null,
        }
      : null,
  );
  const [imageBusy, setImageBusy] = useState(false);
  const [draftId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();

  const resolvedDefaults = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...defaultValues,
    }),
    [defaultValues],
  );

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  const titleValue = useWatch({
    control: form.control,
    name: "title",
  });

  useEffect(() => {
    form.reset(resolvedDefaults);
    setSubmitError(null);
    setSuccessMessage(null);
    setImage(
      existingImageUrl
        ? {
            imageUrl: existingImageUrl,
            imagePublicId: existingImagePublicId ?? null,
          }
        : null,
    );
  }, [existingImagePublicId, existingImageUrl, form, resolvedDefaults]);

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

  const handleSubmit: SubmitHandler<NewsFormValues> = async (values) => {
    setSubmitError(null);
    setSuccessMessage(null);

    if (imageBusy) {
      setSubmitError("Vui lòng đợi ảnh tải xong trước khi lưu.");
      return;
    }

    if (imageRequired && !image) {
      setSubmitError("Vui lòng chọn ảnh đại diện cho bài viết.");
      return;
    }

    try {
      await submitAction({
        ...values,
        slug: buildListingSlug(values.title),
        imageUrl: image ? image.imageUrl : null,
        imagePublicId: image ? image.imagePublicId : null,
      });
      toast({
        title: "Đã lưu tin tức",
        description: "Bài viết đã được cập nhật thành công.",
        variant: "success",
      });
      setSuccessMessage("Đã lưu tin tức thành công.");
      setImage(null);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Không thể lưu tin tức.",
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
      <ListingSelectField
        name="categoryId"
        label="Danh mục"
        required
        options={categoryOptions}
      />
      <ListingTextField name="title" label="Tiêu đề" required />
      <ListingTextField name="slug" label="Slug" required readOnly />

      <ListingImageField
        value={image}
        onChange={setImage}
        initialImagePublicId={existingImagePublicId}
        resourceType="news"
        draftId={draftId}
        onBusyChange={setImageBusy}
        onErrorChange={setSubmitError}
        error={submitError}
        label="Ảnh đại diện"
        description="Ảnh sẽ được upload trực tiếp lên Cloudinary."
        required={imageRequired}
      />

      <ListingTextareaField name="summary" label="Tóm tắt" rows={4} />
      <ListingRichTextField
        name="content"
        label="Nội dung"
        placeholder="Nhập nội dung bài viết..."
      />
      <ListingSelectField
        name="status"
        label="Trạng thái"
        options={PUBLISH_STATUS_OPTIONS}
      />
      <ListingCheckboxField name="isFeatured" label="Bài nổi bật" />

      {successMessage ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}
    </ListingCreateFormShell>
  );
}
