"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getCurrentUserAction } from "@/actions/user.actions";
import PasswordInput from "@/components/common/PasswordInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AUTH_ME_QUERY_KEY, useLoginMutation } from "@/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";

type LoginFormProps = React.ComponentProps<"div"> & {
  variant?: "user" | "admin";
  redirectTo?: string;
};

export function LoginForm({
  className,
  variant = "user",
  redirectTo,
  ...props
}: LoginFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values);

    let currentUser: Awaited<ReturnType<typeof getCurrentUserAction>> = null;
    try {
      currentUser = await queryClient.fetchQuery({
        queryKey: AUTH_ME_QUERY_KEY,
        queryFn: getCurrentUserAction,
      });
    } catch {
      currentUser = null;
    }

    if (variant === "admin" && currentUser?.role !== "ADMIN") {
      router.push("/");
      router.refresh();
      return;
    }

    router.push(redirectTo || (variant === "admin" ? "/admin" : "/"));
    router.refresh();
  });

  const isAdminVariant = variant === "admin";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-black/6 p-0 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="bg-surface relative hidden md:block">
            <Image
              src="/imgs/wallpaper-2.jpg"
              alt="H�nh n?n dang nh?p"
              fill
              sizes="(min-width: 768px) 50vw, 0px"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/38 via-black/10 to-transparent" />
          </div>

          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center bg-white p-8 md:p-12"
          >
            <FieldGroup className="flex flex-col gap-5">
              <div className="mb-4 flex flex-col items-center gap-2 text-center">
                <h1 className="text-heading text-2xl font-semibold tracking-[-0.03em]">
                  {isAdminVariant ? "�ang nh?p qu?n tr?" : "Ch�o m?ng tr? l?i"}
                </h1>
                <p className="text-secondary text-sm leading-7">
                  {isAdminVariant
                    ? "Ch? t�i kho?n qu?n tr? m?i c� th? v�o khu v?c admin."
                    : "Vui l�ng nh?p th�ng tin d? dang nh?p v�o t�i kho?n"}
                </p>
              </div>

              <Field className="flex flex-col gap-2">
                <FieldLabel
                  htmlFor="identifier"
                  className="text-heading font-semibold"
                >
                  S�T ho?c email
                </FieldLabel>
                <Input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="S�T ho?c email"
                  {...register("identifier")}
                />
                {errors.identifier?.message ? (
                  <p className="text-sm text-red-500">
                    {errors.identifier.message}
                  </p>
                ) : null}
              </Field>

              <Field className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="password"
                    className="text-heading font-semibold"
                  >
                    M?t kh?u
                  </FieldLabel>
                  {/*
                  <Link
                    href="/quen-mat-khau"
                    className="text-secondary hover:text-primary text-sm font-medium underline-offset-4 transition-colors duration-200 hover:underline"
                  >
                    Qu�n m?t kh?u?
                  </Link>
                  */}
                </div>
                <PasswordInput
                  id="password"
                  placeholder="M?t kh?u"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password?.message ? (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                ) : null}
              </Field>

              <Field className="mt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || loginMutation.isPending}
                  className="h-11 w-full"
                >
                  {isSubmitting || loginMutation.isPending
                    ? "�ang dang nh?p..."
                    : "�ang nh?p"}
                </Button>
              </Field>

              {loginMutation.error ? (
                <p className="text-center text-sm text-red-500">
                  �ang nh?p th?t b?i. Vui l�ng ki?m tra l?i th�ng tin.
                </p>
              ) : null}

              {isAdminVariant ? null : (
                <>
                  <FieldSeparator className="text-secondary *:data-[slot=field-separator-content]:text-secondary mb-1 py-2 *:data-[slot=field-separator-content]:bg-white *:data-[slot=field-separator-content]:px-3 *:data-[slot=field-separator-content]:text-xs *:data-[slot=field-separator-content]:font-medium *:data-[slot=field-separator-content]:uppercase">
                    Ho?c
                  </FieldSeparator>

                  <Field>
                    <Button
                      asChild
                      variant="outline"
                      type="button"
                      className="h-11 w-full"
                    >
                      <a href="/api/v1/auth/google">
                        <svg
                          className="mr-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        �ang nh?p v?i Google
                      </a>
                    </Button>
                  </Field>

                  <div className="text-secondary mt-4 text-center text-sm">
                    Chua c� t�i kho?n?{" "}
                    <Link
                      href="/dang-ky"
                      className="text-secondary hover:text-primary text-sm font-medium underline-offset-4 transition-colors duration-200 hover:underline"
                    >
                      �ang k�
                    </Link>
                  </div>
                </>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

