"use client";

import { useEffect, useMemo, useState } from "react";
import { PAGE_OPTIONS } from "@/constants/enum-options";
import { PAGE_VALUES } from "@/constants/enum-values";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListingCreateFormShell } from "@/components/listing-form/ListingCreateFormShell";
import { ListingRichTextField } from "@/components/listing-form/ListingRichTextField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { useToast } from "@/components/ui/use-toast";
import {
  seoContentFormSchema,
  type SeoContentFormValues,
} from "@/schemas/admin-crud.schema";
import type { SeoContent } from "@/types/seo-content";

const DEFAULT_VALUES: SeoContentFormValues = {
  page: PAGE_VALUES[0],
  seoContent: "",
};

type AdminSeoContentFormProps = {
  submitAction: (payload: SeoContentFormValues) => Promise<SeoContent>;
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<SeoContentFormValues>;
  pageReadOnly?: boolean;
};

export default function AdminSeoContentForm({
  submitAction,
  title,
  description,
  submitLabel,
  defaultValues,
  pageReadOnly = false,
}: AdminSeoContentFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const resolvedDefaults = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...defaultValues,
    }),
    [defaultValues],
  );

  const form = useForm<SeoContentFormValues>({
    resolver: zodResolver(seoContentFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  useEffect(() => {
    form.reset(resolvedDefaults);
  }, [form, resolvedDefaults]);

  const handleSubmit: SubmitHandler<SeoContentFormValues> = async (values) => {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      await submitAction(values);
      toast({
        title: "Đã lưu nội dung SEO",
        description: `Trang ${values.page} đã được cập nhật thành công.`,
        variant: "success",
      });
      setSuccessMessage("Đã lưu nội dung SEO thành công.");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Không thể lưu nội dung SEO.",
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
        name="page"
        label="Trang"
        required
        options={PAGE_OPTIONS}
        disabled={pageReadOnly}
      />

      <ListingRichTextField
        name="seoContent"
        label="SEO content"
        placeholder="Nhập nội dung SEO HTML..."
      />

      {successMessage ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}
    </ListingCreateFormShell>
  );
}
