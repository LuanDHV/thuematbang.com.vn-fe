"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthMe, useLogoutMutation } from "@/hooks/use-auth";
import { useUpdateMyProfileMutation } from "@/hooks/use-user-management";
import { cn } from "@/lib/utils";
import { profilePhoneSchema } from "@/schemas/user.schema";

const phoneCompletionSchema = z.object({
  phone: profilePhoneSchema,
});

type PhoneCompletionValues = z.infer<typeof phoneCompletionSchema>;

function isGoogleAccount(authUser: ReturnType<typeof useAuthMe>["data"]) {
  return authUser?.authProvider === "GOOGLE" || Boolean(authUser?.googleId);
}

export default function ProfileCompletionGate() {
  const router = useRouter();
  const { data: authUser } = useAuthMe();
  const updateMutation = useUpdateMyProfileMutation();
  const logoutMutation = useLogoutMutation();

  const shouldCompletePhone =
    Boolean(authUser) && isGoogleAccount(authUser) && !authUser?.phone?.trim();

  const form = useForm<PhoneCompletionValues>({
    resolver: zodResolver(phoneCompletionSchema),
    defaultValues: {
      phone: "",
    },
  });

  useEffect(() => {
    if (shouldCompletePhone) {
      form.reset({ phone: "" });
    }
  }, [form, shouldCompletePhone]);

  if (!authUser || !shouldCompletePhone) return null;

  const isBusy = updateMutation.isPending || logoutMutation.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    await updateMutation.mutateAsync({
      fullName: authUser.fullName || authUser.email,
      email: authUser.email,
      phone: values.phone,
      avatarUrl: authUser.avatarUrl ?? null,
      avatarPublicId: authUser.avatarPublicId ?? null,
    });
    router.refresh();
  });

  async function handleLogout() {
    if (isBusy) return;

    try {
      await logoutMutation.mutateAsync();
    } finally {
      router.refresh();
      router.push("/");
    }
  }

  return (
    <Dialog open>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Bổ sung số điện thoại</DialogTitle>
            <DialogDescription>
              Tài khoản Google chưa có số điện thoại. Vui lòng nhập số điện
              thoại để tiếp tục.
            </DialogDescription>
          </DialogHeader>

          <div
            className={cn(
              "flex flex-col gap-2",
              form.formState.errors.phone && "text-red-600",
            )}
          >
            <Label
              htmlFor="profile-completion-phone"
              className="text-heading flex items-center gap-2 text-sm font-medium"
            >
              <Phone className="text-primary size-4" />
              Số điện thoại
            </Label>
            <Input
              id="profile-completion-phone"
              type="tel"
              autoComplete="tel"
              placeholder="0901234567"
              disabled={isBusy}
              className="text-body focus-visible:ring-primary/20 border-hairline-strong bg-surface h-11 rounded-xl px-3 text-sm shadow-none focus-visible:ring-2"
              {...form.register("phone")}
            />
            {form.formState.errors.phone ? (
              <p className="text-xs text-red-600">
                {form.formState.errors.phone.message}
              </p>
            ) : null}
          </div>

          {updateMutation.isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              Không thể cập nhật số điện thoại. Số điện thoại có thể đã được sử
              dụng hoặc không hợp lệ.
            </div>
          ) : null}

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              disabled={isBusy}
            >
              Đăng xuất
            </Button>
            <Button type="submit" disabled={isBusy}>
              {updateMutation.isPending ? "Đang lưu..." : "Lưu số điện thoại"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
