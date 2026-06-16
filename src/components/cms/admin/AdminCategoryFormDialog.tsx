"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORY_TYPE_OPTIONS } from "@/constants/enum-options";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AdminCrudDialog from "@/components/cms/admin/AdminCrudDialog";
import { ListingCheckboxField } from "@/components/listing-form/ListingCheckboxField";
import { ListingNumberField } from "@/components/listing-form/ListingNumberField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { buildListingSlug } from "@/lib/listing-slug";
import { useToast } from "@/components/ui/use-toast";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/schemas/admin-crud.schema";
import type { Category } from "@/types/category";

const DEFAULT_VALUES: CategoryFormValues = {
  type: "PROPERTY",
  name: "",
  slug: "",
  priority: 1,
  isActive: true,
};

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CategoryFormValues) => Promise<Category>;
  title: string;
  description?: string;
  submitLabel: string;
  defaultValues?: Partial<CategoryFormValues>;
};

export default function CategoryFormDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  submitLabel,
  defaultValues,
}: CategoryFormDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resolvedDefaults = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...defaultValues,
    }),
    [defaultValues],
  );

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  const nameValue = useWatch({
    control: form.control,
    name: "name",
  });

  useEffect(() => {
    if (!open) return;
    form.reset(resolvedDefaults);
  }, [form, open, resolvedDefaults]);

  useEffect(() => {
    const nextSlug = buildListingSlug(String(nameValue ?? ""));
    form.setValue("slug", nextSlug, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [form, nameValue]);


  const handleSubmit: SubmitHandler<CategoryFormValues> = async (values) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast({
        title: "Đã lưu danh mục",
        description: `Danh mục ${values.name} đã được cập nhật thành công.`,
        variant: "success",
      });
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Không thể lưu danh mục.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminCrudDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={title}
      description={description}
      submitLabel={submitLabel}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ListingSelectField
        name="type"
        label="Loại danh mục"
        options={CATEGORY_TYPE_OPTIONS}
      />
      <ListingTextField name="name" label="Tên danh mục" required />
      <ListingTextField name="slug" label="Slug" required readOnly />
      <ListingNumberField name="priority" label="Ưu tiên" min={0} step="1" />
      <ListingCheckboxField
        name="isActive"
        label="Đang bật"
        description="Tắt nếu không muốn hiển thị danh mục này"
      />
    </AdminCrudDialog>
  );
}
