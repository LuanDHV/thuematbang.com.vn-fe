"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListingCheckboxField } from "@/components/listing-form/ListingCheckboxField";
import { ListingCreateFormShell } from "@/components/listing-form/ListingCreateFormShell";
import { ListingRichTextField } from "@/components/listing-form/ListingRichTextField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { useToast } from "@/components/ui/use-toast";
import {
  staticPageFormSchema,
  type StaticPageFormValues,
} from "@/schemas/admin-crud.schema";
import type { StaticPage } from "@/types/static-page";

const DEFAULT_VALUES: StaticPageFormValues = {
  siteCode: "",
  content: "",
  isPublished: true,
};

type AdminStaticPageFormProps = {
  submitAction: (payload: StaticPageFormValues) => Promise<StaticPage>;
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<StaticPageFormValues>;
  siteCodeReadOnly?: boolean;
};

export default function AdminStaticPageForm({
  submitAction,
  title,
  description,
  submitLabel,
  defaultValues,
  siteCodeReadOnly = false,
}: AdminStaticPageFormProps) {
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

  const form = useForm<StaticPageFormValues>({
    resolver: zodResolver(staticPageFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  useEffect(() => {
    form.reset(resolvedDefaults);
  }, [form, resolvedDefaults]);

  const handleSubmit: SubmitHandler<StaticPageFormValues> = async (values) => {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      await submitAction(values);
      toast({
        title: "Đã lưu trang tĩnh",
        description: `Trang ${values.siteCode} đã được cập nhật thành công.`,
        variant: "success",
      });
      setSuccessMessage("Đã lưu trang tĩnh thành công.");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Không thể lưu trang tĩnh.",
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
      <ListingTextField
        name="siteCode"
        label="Site code"
        required
        readOnly={siteCodeReadOnly}
        description="Dùng site code này để gọi trang từ API và route public."
      />
      <ListingRichTextField
        name="content"
        label="Nội dung HTML"
        placeholder="Nhập nội dung HTML cho trang tĩnh..."
      />
      <ListingCheckboxField name="isPublished" label="Đăng công khai" />

      {successMessage ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}
    </ListingCreateFormShell>
  );
}
