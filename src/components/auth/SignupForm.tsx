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
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRegisterMutation } from "@/hooks/use-auth";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await registerMutation.mutateAsync(values);
    router.push("/");
    router.refresh();
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-hairline overflow-hidden p-0 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={onSubmit}
            className="bg-surface flex flex-col justify-center p-8 md:p-12"
          >
            <FieldGroup className="flex flex-col gap-5">
              <div className="mb-4 flex flex-col items-center gap-2 text-center">
                <h1 className="text-heading text-2xl font-semibold tracking-[-0.03em]">
                  Tạo tài khoản mới
                </h1>
                <p className="text-secondary text-sm leading-7">
                  Vui lòng nhập thông tin bên dưới để đăng ký
                </p>
              </div>

              <Field className="flex flex-col gap-2">
                <FieldLabel
                  htmlFor="fullName"
                  className="text-heading font-semibold"
                >
                  Họ và tên
                </FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Họ và tên"
                  {...register("fullName")}
                />
                {errors.fullName?.message ? (
                  <p className="text-danger text-sm">
                    {errors.fullName.message}
                  </p>
                ) : null}
              </Field>

              <div className="grid gap-4 lg:grid-cols-2">
                <Field className="flex flex-col gap-2">
                  <FieldLabel
                    htmlFor="email"
                    className="text-heading font-semibold"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@gmail.com"
                    {...register("email")}
                  />
                  {errors.email?.message ? (
                    <p className="text-danger text-sm">
                      {errors.email.message}
                    </p>
                  ) : null}
                </Field>

                <Field className="flex flex-col gap-2">
                  <FieldLabel
                    htmlFor="phone"
                    className="text-heading font-semibold"
                  >
                    Số điện thoại
                  </FieldLabel>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="Nhập SĐT"
                    {...register("phone")}
                  />
                  {errors.phone?.message ? (
                    <p className="text-danger text-sm">
                      {errors.phone.message}
                    </p>
                  ) : null}
                </Field>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Field className="flex flex-col gap-2">
                  <FieldLabel
                    htmlFor="password"
                    className="text-heading font-semibold"
                  >
                    Mật khẩu
                  </FieldLabel>
                  <PasswordInput
                    id="password"
                    placeholder="Mật khẩu"
                    autoComplete="new-password"
                    {...register("password")}
                  />
                  {errors.password?.message ? (
                    <p className="text-danger text-sm">
                      {errors.password.message}
                    </p>
                  ) : null}
                </Field>

                <Field className="flex flex-col gap-2">
                  <FieldLabel
                    htmlFor="confirmPassword"
                    className="text-heading font-semibold"
                  >
                    Xác nhận mật khẩu
                  </FieldLabel>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword?.message ? (
                    <p className="text-danger text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  ) : null}
                </Field>
              </div>

              <FieldDescription className="text-secondary -mt-2.5 text-xs">
                Mật khẩu phải có ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số
                và ký tự đặc biệt.
              </FieldDescription>

              <Field className="mt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || registerMutation.isPending}
                  className="h-11 w-full"
                >
                  {isSubmitting || registerMutation.isPending
                    ? "Đang đăng ký..."
                    : "Đăng ký"}
                </Button>
              </Field>

              {registerMutation.error ? (
                <p className="text-danger text-center text-sm">
                  Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.
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
                  <Link href="/api/v1/auth/google">
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
                Đã có tài khoản?{" "}
                <Link
                  href="/dang-nhap"
                  className="text-secondary hover:text-primary text-sm font-medium underline-offset-4 transition-colors duration-200 hover:underline"
                >
                  Đăng nhập
                </Link>
              </div>
            </FieldGroup>
          </form>

          <div className="bg-surface relative hidden md:block">
            <Image
              src="/imgs/wallpaper-2.jpg"
              alt="Hình nền đăng ký"
              fill
              sizes="(min-width: 768px) 50vw, 0px"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[rgba(28,20,12,0.38)] via-[rgba(28,20,12,0.10)] to-transparent" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
