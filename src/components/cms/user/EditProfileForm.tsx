"use client";

import { type ComponentProps, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Phone, Upload, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import CloudinaryImage from "@/components/common/CloudinaryImage";
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
import { cn } from "@/lib/utils";

const ALLOWED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

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
    label: "H? v� t�n",
    placeholder: "Nh?p h? v� t�n",
    icon: UserRound,
    autoComplete: "name",
  },
  {
    name: "phone",
    label: "S? di?n tho?i",
    placeholder: "Nh?p s? di?n tho?i",
    icon: Phone,
    autoComplete: "tel",
    type: "tel",
  },
  {
    name: "email",
    label: "Email dang nh?p",
    placeholder: "email@example.com",
    icon: Mail,
    autoComplete: "email",
    type: "email",
    readOnly: true,
  },
] as const;

export default function EditProfileForm() {
  const { data: authUser } = useAuthMe();
  const updateMutation = useUpdateMyProfileMutation();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

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
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!authUser) return null;

  const onSubmit = form.handleSubmit(async (values) => {
    if (avatarError) return;

    await updateMutation.mutateAsync({
      fullName: values.fullName,
      phone: values.phone,
      email: values.email,
      avatar: avatarFile || undefined,
    });
    setAvatarFile(null);
  });

  const onAvatarChange: ComponentProps<"input">["onChange"] = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setAvatarFile(null);
      setAvatarError(null);
      return;
    }

    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      setAvatarFile(null);
      setAvatarError(
        "�?nh d?ng ?nh kh�ng h?p l?. Vui l�ng ch?n JPEG, JPG, PNG ho?c WEBP.",
      );
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setAvatarFile(null);
      setAvatarError("?nh vu?t qu� 2MB. Vui l�ng ch?n ?nh nh? hon.");
      return;
    }

    setAvatarFile(file);
    setAvatarError(null);
  };

  const avatarDisplay = previewUrl || authUser.avatarUrl || null;

  return (
    <CmsFormPageShell>
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <section className="surface-panel p-5">
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-3 text-center">
              {avatarDisplay ? (
                <CloudinaryImage
                  src={avatarDisplay}
                  alt={`?nh d?i di?n c?a ${authUser.fullName || "ngu?i d�ng"}`}
                  width={128}
                  height={128}
                  cldQuality="auto:best"
                  className="border-hairline-strong ring-subtle size-32 rounded-full border-2 object-cover ring-4"
                />
              ) : (
                <div className="text-secondary border-hairline-strong bg-subtle ring-surface flex size-32 items-center justify-center rounded-full border-2 border-dashed ring-4">
                  <Upload className="size-8" />
                </div>
              )}
            </div>

            <input
              id="avatar-upload"
              type="file"
              accept=".jpeg,.jpg,.png,.webp,image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              aria-label="T?i ?nh d?i di?n"
              onChange={onAvatarChange}
            />
            <Label
              htmlFor="avatar-upload"
              className="group bg-surface hover:border-primary/50 border-hairline-strong hover:bg-subtle relative flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed px-5 py-6 text-center transition-colors"
            >
              <Upload className="text-secondary group-hover:text-primary size-6" />
              <p className="text-body text-base font-medium">
                Ch?n ?nh ho?c k�o th? v�o d�y
              </p>
              <p className="text-secondary text-sm">
                �?nh d?ng jpeg, jpg, png, webp. T?i da 2MB
              </p>
            </Label>
          </div>

          {avatarError ? (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {avatarError}
            </p>
          ) : null}
        </section>

        <section className="surface-panel p-5">
          <div className="grid gap-4 md:grid-cols-2">
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
                      "text-body focus-visible:ring-primary/20 border-hairline-strong h-11 rounded-xl bg-white px-3 text-sm shadow-none focus-visible:ring-2",
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
                "Kh�ng th? c?p nh?t th�ng tin. Vui l�ng th? l?i.",
              )}
            </div>
          ) : null}

          {updateMutation.isSuccess ? (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              C?p nh?t th�ng tin th�nh c�ng.
            </div>
          ) : null}

          <div className="mt-5 flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={updateMutation.isPending || Boolean(avatarError)}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  �ang luu...
                </>
              ) : (
                "Luu thay d?i"
              )}
            </Button>
          </div>
        </section>
      </form>
    </CmsFormPageShell>
  );
}

