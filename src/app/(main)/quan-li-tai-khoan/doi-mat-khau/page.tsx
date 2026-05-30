"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useChangeMyPasswordMutation,
  useSetMyPasswordMutation,
} from "@/hooks/use-account-management";
import { useAuthMe } from "@/hooks/use-auth";
import { PasswordFormValues, passwordFormSchema } from "@/schemas/password.schema";

function normalizePasswordMessage(message: string) {
  const normalized = message.trim().toLowerCase();

  if (
    normalized.includes("current password") &&
    (normalized.includes("incorrect") || normalized.includes("invalid"))
  ) {
    return "Mật khẩu hiện tại không đúng.";
  }

  if (normalized.includes("password changed successfully")) {
    return "Đổi mật khẩu thành công.";
  }

  if (normalized.includes("password set successfully")) {
    return "Tạo mật khẩu thành công.";
  }

  return message;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return normalizePasswordMessage(error.message);
  }
  return fallback;
}

export default function ChangePasswordPage() {
  const { data: authUser, isLoading } = useAuthMe();
  const changePasswordMutation = useChangeMyPasswordMutation();
  const setPasswordMutation = useSetMyPasswordMutation();

  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const hasPassword = authUser?.hasPassword ?? true;
  const isSubmitting = changePasswordMutation.isPending || setPasswordMutation.isPending;
  const passwordFieldLabel = hasPassword ? "Mật khẩu mới" : "Mật khẩu";

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const title = hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu";
  const description = hasPassword
    ? "Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật bảo mật tài khoản."
    : "Tài khoản của bạn chưa có mật khẩu. Tạo mật khẩu để có thể đăng nhập bằng email và mật khẩu ngoài Google.";

  const submitButtonLabel = useMemo(() => {
    if (isSubmitting) return hasPassword ? "Đang đổi mật khẩu..." : "Đang tạo mật khẩu...";
    return hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu";
  }, [hasPassword, isSubmitting]);

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSuccessMessage(null);

    if (hasPassword && !values.currentPassword) {
      form.setError("currentPassword", { message: "Vui lòng nhập mật khẩu hiện tại." });
      return;
    }

    try {
      if (hasPassword) {
        await changePasswordMutation.mutateAsync({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        setSuccessMessage("Đổi mật khẩu thành công.");
      } else {
        await setPasswordMutation.mutateAsync({
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        });
        setSuccessMessage("Tạo mật khẩu thành công.");
      }

      form.reset();
    } catch (error) {
      const fallback = hasPassword
        ? "Không thể đổi mật khẩu. Vui lòng thử lại."
        : "Không thể tạo mật khẩu. Vui lòng thử lại.";
      setFormError(getErrorMessage(error, fallback));
    }
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <p className="text-sm text-gray-500">Đang tải thông tin bảo mật...</p>
      </div>
    );
  }

  if (!authUser) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div className="flex items-center gap-2">
        <KeyRound className="text-primary h-5 w-5" />
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>

      <p className="mt-2 text-sm text-gray-500">{description}</p>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        {hasPassword ? (
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              {...form.register("currentPassword")}
            />
            {form.formState.errors.currentPassword?.message ? (
              <p className="text-xs text-red-600">{form.formState.errors.currentPassword.message}</p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="newPassword">{passwordFieldLabel}</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...form.register("newPassword")}
          />
          {form.formState.errors.newPassword?.message ? (
            <p className="text-xs text-red-600">{form.formState.errors.newPassword.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword?.message ? (
            <p className="text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p>
          ) : null}
        </div>

        {formError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
            {formError}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600" role="status">
            {successMessage}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {submitButtonLabel}
              </>
            ) : (
              submitButtonLabel
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
