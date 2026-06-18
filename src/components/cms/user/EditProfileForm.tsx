"use client";

import { type ComponentProps, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";

import { ListingImageField } from "@/components/listing-form/ListingImageField";
import CmsFormPageShell from "@/components/cms/shared/CmsFormPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateMyProfileMutation } from "@/hooks/use-user-management";
import { useAuthMe } from "@/hooks/use-auth";
import {
  editProfileSchema,
  type EditProfileFormValues,
} from "@/schemas/user.schema";
import type { UploadedCloudinaryImage } from "@/types/cloudinary";
import { cn } from "@/lib/utils";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

type ProfileFieldConfig = {
  name: keyof EditProfileFormValues;
  label: string;
  placeholder: string;
  icon: typeof UserRound;
  autoComplete: string;
  type?: ComponentProps<"input">["type"];
  readOnly?: boolean;
};

const PROFILE_FIELDS: ProfileFieldConfig[] = [
  {
    name: "fullName",
    label: "Họ và tên",
    placeholder: "Nhập họ và tên",
    icon: UserRound,
    autoComplete: "name",
  },
  {
    name: "phone",
    label: "Số điện thoại",
    placeholder: "Nhập số điện thoại",
    icon: Phone,
    autoComplete: "tel",
    type: "tel",
  },
  {
    name: "email",
    label: "Email đăng nhập",
    placeholder: "email@gmail.com",
    icon: Mail,
    autoComplete: "email",
    type: "email",
    readOnly: true,
  },
] as const;

type EditProfileFormContentProps = {
  authUser: NonNullable<ReturnType<typeof useAuthMe>["data"]>;
  defaultValues: EditProfileFormValues;
  initialAvatar: UploadedCloudinaryImage | null;
};

export default function EditProfileForm() {
  const { data: authUser } = useAuthMe();

  if (!authUser) return null;

  const defaultValues: EditProfileFormValues = {
    fullName: authUser.fullName || "",
    phone: authUser.phone || "",
    email: authUser.email || "",
  };

  const initialAvatar = authUser.avatarUrl
    ? {
        imageUrl: authUser.avatarUrl,
        imagePublicId: authUser.avatarPublicId ?? null,
      }
    : null;

  const formStateKey = [
    authUser.id,
    JSON.stringify(defaultValues),
    initialAvatar?.imagePublicId ?? "null",
    initialAvatar?.imageUrl ?? "null",
  ].join("::");

  return (
    <EditProfileFormContent
      key={formStateKey}
      authUser={authUser}
      defaultValues={defaultValues}
      initialAvatar={initialAvatar}
    />
  );
}

function EditProfileFormContent({
  authUser,
  defaultValues,
  initialAvatar,
}: EditProfileFormContentProps) {
  const updateMutation = useUpdateMyProfileMutation();
  const [avatar, setAvatar] = useState<UploadedCloudinaryImage | null>(
    () => initialAvatar,
  );
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [draftId] = useState(() => crypto.randomUUID());

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (avatarError || avatarBusy) return;

    await updateMutation.mutateAsync({
      fullName: values.fullName,
      phone: values.phone,
      email: values.email,
      avatarUrl: avatar ? avatar.imageUrl : null,
      avatarPublicId: avatar ? avatar.imagePublicId : null,
    });
    setAvatar(null);
  });

  return (
    <CmsFormPageShell>
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <section className="surface-panel p-5">
          <ListingImageField
            value={avatar}
            onChange={setAvatar}
            initialImagePublicId={initialAvatar?.imagePublicId ?? null}
            resourceType="users"
            draftId={draftId}
            resourceId={authUser.id}
            onBusyChange={setAvatarBusy}
            onErrorChange={setAvatarError}
            error={avatarError}
            label="Ảnh đại diện"
            description="Định dạng jpeg, jpg, png, webp. Tối đa 2MB."
            required={false}
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {PROFILE_FIELDS.map((field) => {
              const Icon = field.icon;
              const error = form.formState.errors[field.name];
              const inputId = `profile-${field.name}`;

              return (
                <div
                  key={field.name}
                  className={cn("flex flex-col gap-2", error && "text-red-600")}
                >
                  <Label
                    htmlFor={inputId}
                    className="text-heading flex items-center gap-2 text-sm font-medium"
                  >
                    <Icon className="text-primary size-4" />
                    {field.label}
                  </Label>

                  <Input
                    id={inputId}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    readOnly={field.readOnly}
                    className={cn(
                      "text-body focus-visible:ring-primary/20 border-hairline-strong bg-surface h-11 rounded-xl px-3 text-sm shadow-none focus-visible:ring-2",
                      field.readOnly && "text-secondary bg-subtle",
                    )}
                    {...form.register(field.name)}
                  />

                  {error ? (
                    <p className="text-xs text-red-600">{error.message}</p>
                  ) : null}
                </div>
              );
            })}
          </div>

          {updateMutation.isError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {getErrorMessage(
                updateMutation.error,
                "Không thể cập nhật thông tin. Vui lòng thử lại.",
              )}
            </div>
          ) : null}

          {updateMutation.isSuccess ? (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              Cập nhật thông tin thành công.
            </div>
          ) : null}

          <div className="mt-5 flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={updateMutation.isPending || Boolean(avatarError)}
            >
              {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </section>
      </form>
    </CmsFormPageShell>
  );
}
