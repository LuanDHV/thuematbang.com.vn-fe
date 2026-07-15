"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useLoginMutation } from "@/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track-event";

type LoginFormProps = React.ComponentProps<"div"> & {
  redirectTo?: string;
};

export function LoginForm({ className, redirectTo, ...props }: LoginFormProps) {
  const router = useRouter();
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
    const trackingParams = {
      source: "login_form",
      auth_method: "password",
      redirect_to: redirectTo ?? "/",
    };

    trackEvent(ANALYTICS_EVENTS.loginSubmitClicked, trackingParams);

    try {
      await loginMutation.mutateAsync(values);

      trackEvent(ANALYTICS_EVENTS.loginCompleted, trackingParams);
      router.push(redirectTo || "/");
      router.refresh();
    } catch {
      trackEvent(ANALYTICS_EVENTS.loginFailed, {
        ...trackingParams,
        reason: "invalid_credentials",
      });
    }
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="surface-panel overflow-hidden p-0 shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="bg-surface relative hidden md:block">
            <Image
              src="/imgs/wallpaper-2.jpg"
              alt="Hình nền đăng nhập"
              fill
              sizes="(min-width: 768px) 50vw, 0px"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-surface flex flex-col justify-center p-8 md:p-12"
          >
            <FieldGroup className="flex flex-col gap-5">
              <div className="mb-4 flex flex-col items-center gap-2 text-center">
                <h1 className="text-heading text-2xl font-semibold tracking-[-0.04em]">
                  Chào mừng trở lại
                </h1>
                <p className="text-secondary text-sm leading-7">
                  Vui lòng nhập thông tin để đăng nhập vào tài khoản
                </p>
              </div>

              <Field className="flex flex-col gap-2">
                <FieldLabel
                  htmlFor="identifier"
                  className="text-heading font-semibold"
                >
                  Số điện thoại hoặc email
                </FieldLabel>
                <Input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="Số điện thoại hoặc email"
                  {...register("identifier")}
                />
                {errors.identifier?.message ? (
                  <p className="text-danger text-sm">
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
                    Mật khẩu
                  </FieldLabel>
                  {/*
                  <Link
                    href="/quen-mat-khau"
                    className="text-secondary hover:text-primary text-sm font-medium underline-offset-4 transition-colors duration-200 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                  */}
                </div>
                <PasswordInput
                  id="password"
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password?.message ? (
                  <p className="text-danger text-sm">
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
                    ? "Đang đăng nhập..."
                    : "Đăng nhập"}
                </Button>
              </Field>

              {loginMutation.error ? (
                <p className="text-danger text-center text-sm">
                  Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.
                </p>
              ) : null}

              <FieldSeparator className="text-secondary *:data-[slot=field-separator-content]:text-secondary *:data-[slot=field-separator-content]:bg-surface mb-1 py-2 *:data-[slot=field-separator-content]:px-3 *:data-[slot=field-separator-content]:text-xs *:data-[slot=field-separator-content]:font-medium *:data-[slot=field-separator-content]:uppercase">
                Hoặc
              </FieldSeparator>

              <Field>
                <Button
                  asChild
                  variant="outline"
                  type="button"
                  className="h-11 w-full"
                >
                  <Link
                    href="/api/v1/auth/google"
                    onClick={() =>
                      trackEvent(ANALYTICS_EVENTS.googleLoginClicked, {
                        source: "login_form",
                        auth_method: "google",
                      })
                    }
                  >
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
                    Đăng nhập với Google
                  </Link>
                </Button>
              </Field>

              <div className="text-secondary mt-4 text-center text-sm">
                Chưa có tài khoản?{" "}
                <Link
                  href="/dang-ky"
                  className="text-secondary hover:text-primary text-sm font-medium underline-offset-4 transition-colors duration-200 hover:underline"
                >
                  Đăng ký
                </Link>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
