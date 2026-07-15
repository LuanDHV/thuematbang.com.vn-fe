/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { FormEvent, ReactNode } from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminCrudDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<any>;
  title: string;
  description?: string;
  submitLabel: string;
  submitPendingLabel?: string;
  submitError?: string | null;
  isSubmitting?: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  children: ReactNode;
  className?: string;
};

export default function AdminCrudDialog({
  open,
  onOpenChange,
  form,
  title,
  description,
  submitLabel,
  submitPendingLabel = "Đang lưu...",
  submitError,
  isSubmitting = false,
  onSubmit,
  children,
  className,
}: AdminCrudDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-3xl", className)}>
        <FormProvider {...form}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-4">{children}</div>

            {submitError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </p>
            ) : null}

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? submitPendingLabel : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

