"use client";

import { useEffect, useMemo, useState } from "react";
import { LEAD_STATUS_OPTIONS } from "@/constants/enum-options";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AdminCrudDialog from "@/components/cms/admin/AdminCrudDialog";
import { ListingNumberField } from "@/components/listing-form/ListingNumberField";
import { ListingSelectField } from "@/components/listing-form/ListingSelectField";
import { ListingTextField } from "@/components/listing-form/ListingTextField";
import { useToast } from "@/components/ui/use-toast";
import {
  leadFormSchema,
  type LeadFormValues,
} from "@/schemas/admin-crud.schema";
import type { LeadSourceFilter } from "@/types/lead";
import type { Lead } from "@/types/lead";

const DEFAULT_VALUES: LeadFormValues = {
  fullName: "",
  phone: "",
  status: "NEW",
  userId: undefined,
  propertyId: undefined,
  rentRequestId: undefined,
};

type LeadFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: LeadFormValues) => Promise<Lead>;
  title: string;
  description?: string;
  submitLabel: string;
  source: LeadSourceFilter;
  defaultValues?: Partial<LeadFormValues>;
};

export default function LeadFormDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  submitLabel,
  source,
  defaultValues,
}: LeadFormDialogProps) {
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

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema) as never,
    defaultValues: resolvedDefaults,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!open) return;
    form.reset(resolvedDefaults);
  }, [form, open, resolvedDefaults]);

  const handleSubmit: SubmitHandler<LeadFormValues> = async (values) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast({
        title: "Đã lưu lead",
        description: `${values.fullName} đã được cập nhật thành công.`,
        variant: "success",
      });
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Không thể lưu lead.",
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
      <ListingTextField name="fullName" label="Họ và tên" required />
      <ListingTextField name="phone" label="Điện thoại" required type="tel" />
      <ListingSelectField
        name="status"
        label="Trạng thái"
        options={LEAD_STATUS_OPTIONS}
      />
      <ListingNumberField name="userId" label="User ID" min={0} step="1" />
      {source === "PROPERTY" ? (
        <ListingNumberField
          name="propertyId"
          label="ID Cho thuê"
          min={0}
          step="1"
        />
      ) : null}
      {source === "RENT_REQUEST" ? (
        <ListingNumberField
          name="rentRequestId"
          label="ID Cần thuê"
          min={0}
          step="1"
        />
      ) : null}
    </AdminCrudDialog>
  );
}
