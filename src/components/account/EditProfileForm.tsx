"use client";

import { type ComponentProps, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateMyProfileMutation } from "@/hooks/use-account-management";
import { useAuthMe } from "@/hooks/use-auth";
import {
  editProfileSchema,
  type EditProfileFormValues,
} from "@/schemas/account.schema";
import { cn } from "@/lib/utils";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

type ProfileFieldConfig = {
  name: keyof EditProfileFormValues;
  label: string;
  placeholder: string;
  icon: typeof UserRound;
  description: string;
  autoComplete: string;
  type?: ComponentProps<"input">["type"];
  disabled?: boolean;
  readOnly?: boolean;
};

const PROFILE_FIELDS: ProfileFieldConfig[] = [
  {
    name: "fullName",
    label: "Họ và tên",
    placeholder: "Nhập họ và tên",
    icon: UserRound,
    description: "Tên hiển thị trong hồ sơ tài khoản của bạn.",
    autoComplete: "name",
  },
  {
    name: "phone",
    label: "Số điện thoại",
    placeholder: "Nhập số điện thoại",
    icon: Phone,
    description: "Khách hàng và đội ngũ hỗ trợ có thể dùng để liên hệ.",
    autoComplete: "tel",
    type: "tel",
  },
  {
    name: "email",
    label: "Email đăng nhập",
    placeholder: "email@example.com",
    icon: Mail,
    description: "Email được khóa để đảm bảo an toàn đăng nhập.",
    autoComplete: "email",
    type: "email",
    disabled: true,
    readOnly: true,
  },
] as const;

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
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-linear-to-br from-white via-white to-primary/10">
        <div className="flex flex-col gap-4 px-5 py-6 md:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Hồ sơ tài khoản
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs text-secondary">
              <ShieldCheck className="size-4 text-primary" />
              Cập nhật để tăng độ tin cậy khi khách liên hệ
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-heading">
              Chỉnh sửa thông tin cá nhân
            </h1>
            <p className="max-w-2xl text-sm text-body">
              Tối ưu hồ sơ để tài khoản của bạn trông chuyên nghiệp hơn trên
              nền tảng bất động sản, đồng thời giúp việc liên hệ và xác thực
              thông tin rõ ràng hơn.
            </p>
          </div>
        </div>
      </div>

      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,320px)_1fr]">
          <section className="flex h-full flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-heading">
                Ảnh đại diện
              </h2>
              <p className="text-sm text-secondary">
                Ảnh rõ ràng giúp hồ sơ của bạn tạo cảm giác chuyên nghiệp và dễ
                nhận diện hơn.
              </p>
            </div>

            <label
              htmlFor="avatar-upload"
              className="group flex cursor-pointer flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-center transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 focus-within:border-primary/60 focus-within:bg-primary/5"
            >
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                aria-label="Tải ảnh đại diện"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setAvatarFile(file);
                }}
              />

              <div className="relative">
                {avatarDisplay ? (
                  <CloudinaryImage
                    src={avatarDisplay}
                    alt={`Ảnh đại diện của ${authUser.fullName || "người dùng"}`}
                    width={112}
                    height={112}
                    cldQuality="auto:best"
                    className="size-28 rounded-full border-4 border-white object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex size-28 items-center justify-center rounded-full border-4 border-white bg-white shadow-sm transition-colors group-hover:text-primary">
                    <Upload className="size-8 text-secondary transition-colors group-hover:text-primary" />
                  </div>
                )}

                <span className="absolute -bottom-1 right-0 inline-flex size-9 items-center justify-center rounded-full border border-white bg-primary text-primary-foreground shadow-sm">
                  <Camera className="size-4" />
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-heading">
                  {avatarFile ? "Ảnh mới đã sẵn sàng" : "Tải ảnh đại diện"}
                </span>
                <span className="text-xs text-secondary">
                  Kéo thả hoặc nhấn để chọn ảnh từ thiết bị của bạn.
                </span>
              </div>
            </label>

            <div className="grid gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-heading">
                    Gợi ý tối ưu hồ sơ
                  </p>
                  <p className="text-sm text-secondary">
                    Dùng ảnh chân dung sáng, rõ mặt để tăng độ tin cậy cho hồ sơ
                    khi người xem quan tâm đến tin đăng.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-heading">
                Thông tin liên hệ
              </h2>
              <p className="text-sm text-secondary">
                Cập nhật dữ liệu chính xác để trải nghiệm quản lý tài khoản và
                trao đổi với khách hàng được liền mạch hơn.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {PROFILE_FIELDS.map((field) => {
                const Icon = field.icon;
                const error = form.formState.errors[field.name];
                const inputId = `profile-${field.name}`;

                return (
                  <div
                    key={field.name}
                    className={cn(
                      "flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-colors",
                      field.name === "fullName" && "md:col-span-2",
                      error && "border-red-200",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label
                          htmlFor={inputId}
                          className="text-sm font-semibold text-heading"
                        >
                          {field.label}
                        </Label>
                        <p className="text-xs text-secondary">
                          {field.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Input
                        id={inputId}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        readOnly={field.readOnly}
                        className={cn(
                          "h-11 rounded-xl border-gray-200 px-3 text-sm text-body shadow-none focus-visible:ring-3 focus-visible:ring-primary/15",
                          field.disabled && "bg-gray-50 text-secondary",
                        )}
                        {...form.register(field.name)}
                      />
                      {error ? (
                        <p className="text-xs text-red-600">{error.message}</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {updateMutation.isError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {getErrorMessage(
                  updateMutation.error,
                  "Không thể cập nhật thông tin. Vui lòng thử lại.",
                )}
              </div>
            ) : null}

            {updateMutation.isSuccess ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                Cập nhật thông tin thành công.
              </div>
            ) : null}

            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-heading">
                  Lưu thay đổi hồ sơ
                </p>
                <p className="text-sm text-secondary">
                  Mọi cập nhật sẽ được áp dụng ngay sau khi lưu.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={updateMutation.isPending}
                className="w-full md:w-auto"
              >
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
          </section>
        </div>
      </form>
    </div>
  );
}
