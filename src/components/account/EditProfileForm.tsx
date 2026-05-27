"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthMe } from "@/hooks/use-auth";
import { useUpdateMyProfileMutation } from "@/hooks/use-account-management";
import {
  editProfileSchema,
  type EditProfileFormValues,
} from "@/schemas/account.schema";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export default function EditProfileForm() {
  const { data: authUser } = useAuthMe();
  const updateMutation = useUpdateMyProfileMutation();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const defaultValues = useMemo<EditProfileFormValues>(
    () => ({
      fullName: authUser?.fullName || "",
      phone: authUser?.phone || "",
      email: authUser?.email || "",
    }),
    [authUser],
  );

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const previewUrl = useMemo(() => {
    if (!avatarFile) return null;
    return URL.createObjectURL(avatarFile);
  }, [avatarFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!authUser) {
    return null;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    await updateMutation.mutateAsync({
      fullName: values.fullName,
      phone: values.phone,
      email: values.email,
      avatar: avatarFile || undefined,
    });
    setAvatarFile(null);
  });

  const avatarDisplay = previewUrl || authUser.avatarUrl || null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-heading">
          Chỉnh sửa thông tin
        </h1>
        <p className="mt-1 text-sm text-secondary">
          Cập nhật hồ sơ cá nhân của bạn.
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="flex justify-center">
          <label className="group block w-full max-w-sm cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setAvatarFile(file);
              }}
            />
            <span className="group-hover:border-primary/60 group-hover:bg-primary/5 flex min-h-45 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition-colors">
              {avatarDisplay ? (
                <Image
                  src={avatarDisplay}
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="h-24 w-24 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div className="group-hover:text-primary flex h-24 w-24 items-center justify-center rounded-full transition-colors">
                  <Upload className="h-8 w-8" />
                </div>
              )}
              <span className="text-sm font-medium text-body">
                Tải ảnh đại diện
              </span>
              <span className="text-xs text-secondary">
                Nhấn để chọn ảnh từ thiết bị
              </span>
            </span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-body">
              Họ và tên
            </label>
            <Input {...form.register("fullName")} />
            {form.formState.errors.fullName ? (
              <p className="text-xs text-red-600">
                {form.formState.errors.fullName.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-body">
              Số điện thoại
            </label>
            <Input {...form.register("phone")} />
            {form.formState.errors.phone ? (
              <p className="text-xs text-red-600">
                {form.formState.errors.phone.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-body">Email</label>
            <Input {...form.register("email")} disabled readOnly />
            {form.formState.errors.email ? (
              <p className="text-xs text-red-600">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>
        </div>

        {updateMutation.isError ? (
          <p className="text-sm text-red-600">
            {getErrorMessage(
              updateMutation.error,
              "Không thể cập nhật thông tin. Vui lòng thử lại.",
            )}
          </p>
        ) : null}

        {updateMutation.isSuccess ? (
          <p className="text-sm text-green-600">
            Cập nhật thông tin thành công.
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
