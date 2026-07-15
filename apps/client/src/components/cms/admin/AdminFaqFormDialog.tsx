"use client";

import { useEffect, useMemo, useState } from "react";
import { PAGE_OPTIONS } from "@/constants/enum-options";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AdminCrudDialog from "@/components/cms/admin/AdminCrudDialog";
import { ListingNumberField } from "@/components/listing-form/ListingNumberField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { ListingTextareaField } from "@/components/listing-form/ListingTextareaField";
import { useToast } from "@/components/ui/use-toast";
import { faqFormSchema, type FaqFormValues } from "@/schemas/admin-crud.schema";
import type { FaqItem } from "@/types/faq";

const DEFAULT_VALUES: FaqFormValues = {
  page: "home",
  question: "",
  answer: "",
  sortOrder: 1,
};

type FaqFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FaqFormValues) => Promise<FaqItem>;
  title: string;
  description?: string;
  submitLabel: string;
  defaultValues?: Partial<FaqFormValues>;
};

export default function FaqFormDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  submitLabel,
  defaultValues,
}: FaqFormDialogProps) {
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

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!open) return;
    form.reset(resolvedDefaults);
  }, [form, open, resolvedDefaults]);

  const handleSubmit: SubmitHandler<FaqFormValues> = async (values) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast({
        title: "Đã lưu FAQ",
        description: `Câu hỏi "${values.question}" đã được cập nhật.`,
        variant: "success",
      });
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Không thể lưu FAQ.",
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
      <ListingSelectField name="page" label="Trang" options={PAGE_OPTIONS} />
      <ListingTextField name="question" label="Câu hỏi" required />
      <ListingTextareaField name="answer" label="Trả lời" required rows={5} />
      <ListingNumberField name="sortOrder" label="Thứ tự" min={0} step="1" />
    </AdminCrudDialog>
  );
}
