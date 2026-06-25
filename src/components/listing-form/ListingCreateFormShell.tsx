"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

import { useAuthMe } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

type ListingCreateFormShellProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  title: string;
  description: string;
  submitLabel: string;
  submitPendingLabel?: string;
  submitError?: string | null;
  children: ReactNode;
  className?: string;
};

export function ListingCreateFormShell<TFormValues extends FieldValues>({
  form,
  onSubmit,
  title,
  description,
  submitLabel,
  submitPendingLabel = "Đang gửi...",
  submitError,
  children,
  className,
}: ListingCreateFormShellProps<TFormValues>) {
  const { data: authUser, isLoading } = useAuthMe();

  if (isLoading) {
      return (
        <section
        className={cn("surface-panel mx-auto w-full max-w-4xl p-5 lg:p-6", className)}
      >
        <div className="space-y-3">
          <div className="bg-subtle h-6 w-1/3 animate-pulse rounded-full" />
          <div className="bg-subtle h-4 w-2/3 animate-pulse rounded-full" />
          <div className="bg-subtle h-4 w-1/2 animate-pulse rounded-full" />
        </div>
      </section>
    );
  }

  if (!authUser) {
    return (
      <section
        className={cn("surface-panel mx-auto w-full max-w-4xl p-5 lg:p-6", className)}
      >
        <div className="flex flex-col gap-4 text-center md:items-center">
          <div className="space-y-2">
            <h2 className="text-heading text-2xl font-semibold tracking-[-0.03em]">
              {title}
            </h2>
            <p className="text-secondary max-w-2xl text-sm leading-7 md:text-base">
              {description}
            </p>
          </div>
          <div className="surface-card border-primary/10 max-w-xl px-5 py-4 text-left">
            <p className="text-body text-sm leading-7">
              Bạn cần đăng nhập trước khi đăng tin.
            </p>
            <div className="mt-5 flex justify-center">
              <Button asChild>
                <Link href="/dang-nhap">
                  Đăng nhập
                  <User className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <FormProvider {...form}>
      <section
        className={cn("surface-panel mx-auto w-full max-w-4xl p-5 lg:p-6", className)}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-heading text-2xl font-semibold tracking-[-0.03em]">
              {title}
            </CardTitle>
            <CardDescription className="text-secondary max-w-2xl text-sm leading-7 md:text-base">
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0">
            <div className="space-y-4">{children}</div>
          </CardContent>

          {submitError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </p>
          ) : null}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="min-w-36"
            >
              {form.formState.isSubmitting ? submitPendingLabel : submitLabel}
            </Button>
          </div>
        </form>
      </section>
    </FormProvider>
  );
}

