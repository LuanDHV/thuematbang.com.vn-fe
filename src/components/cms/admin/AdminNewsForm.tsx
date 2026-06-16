"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListingCheckboxField } from "@/components/listing-form/ListingCheckboxField";
import { ListingCreateFormShell } from "@/components/listing-form/ListingCreateFormShell";
import { ListingRichTextField } from "@/components/listing-form/ListingRichTextField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { ListingTextareaField } from "@/components/listing-form/ListingTextareaField";
import { appendBoolean, appendString } from "@/lib/form/form-payload";
import { buildListingSlug } from "@/lib/listing/listing-slug";
import { useToast } from "@/components/ui/use-toast";
import { PUBLISH_STATUS_OPTIONS } from "@/constants/enum-options";
import {
  newsFormSchema,
  type NewsFormValues,
} from "@/schemas/admin-crud.schema";
import type { Category } from "@/types/category";
import type { News } from "@/types/news";

const DEFAULT_VALUES: Partial<NewsFormValues> = {
  categoryId: undefined,
  title: "",
  slug: "",
  summary: "",
  content: "",
  status: "DRAFT",
  isFeatured: false,
};

type AdminNewsFormProps = {
  categories: Category[];
  submitAction: (payload: FormData) => Promise<News>;
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<NewsFormValues>;
  existingImageUrl?: string | null;
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
  imageRequired = true,
}: AdminNewsFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    existingImageUrl ?? null,
  );
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
    setImageFile(null);
    setImagePreview(existingImageUrl ?? null);
  }, [existingImageUrl, form, resolvedDefaults]);

  useEffect(() => {
    const nextSlug = buildListingSlug(String(titleValue ?? ""));
    form.setValue("slug", nextSlug, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [form, titleValue]);

  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

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

    if (imageRequired && !existingImageUrl && !imageFile) {
      setSubmitError("Vui lòng chọn ảnh đại diện cho bài viết.");
      return;
    }

    const payload = new FormData();
    appendString(payload, "categoryId", String(values.categoryId));
    appendString(payload, "title", values.title);
    appendString(payload, "slug", buildListingSlug(values.title));
    appendString(payload, "summary", values.summary);
    appendString(payload, "content", values.content);
    appendString(payload, "status", values.status);
    appendBoolean(payload, "isFeatured", values.isFeatured);
    if (imageFile) payload.set("image", imageFile);

    try {
      await submitAction(payload);
      toast({
        title: "Đã lưu tin tức",
        description: "Bài viết đã được cập nhật thành công.",
        variant: "success",
      });
      setSuccessMessage("Đã lưu tin tức thành công.");
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

      <div className="space-y-2">
        <label className="text-heading text-sm font-semibold" htmlFor="news-image">
          Ảnh đại diện {imageRequired ? <span className="text-destructive">*</span> : null}
        </label>
        <input
          id="news-image"
          type="file"
          accept="image/*"
          className="block w-full rounded-xl border border-black/8 bg-white px-3 py-2 text-sm"
          onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
        />
        {imagePreview ? (
          <div className="overflow-hidden rounded-xl border border-black/8">
            <Image
              src={imagePreview}
              alt="News preview"
              width={960}
              height={540}
              unoptimized
              className="h-40 w-full object-cover"
            />
          </div>
        ) : null}
      </div>

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

