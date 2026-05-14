import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Cột Hình ảnh */}
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/imgs/wallpaper-2.jpg"
              alt="Hình nền đăng nhập"
              fill
              sizes="(min-width: 768px) 50vw, 0px"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
            />
            {/* Lớp overlay nhẹ giúp ảnh trông deep hơn (tuỳ chọn) */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Cột Form */}
          <form className="flex flex-col justify-center bg-white p-8 md:p-12">
            <FieldGroup className="flex flex-col gap-5">
              {/* Header Form */}
              <div className="mb-4 flex flex-col items-center gap-2 text-center">
                <h1 className="text-foreground text-2xl font-bold tracking-tight">
                  Chào mừng trở lại
                </h1>
                <p className="text-muted-foreground text-sm">
                  Vui lòng nhập thông tin để đăng nhập vào tài khoản
                </p>
              </div>

              {/* Input định danh */}
              <Field className="space-y-2">
                <FieldLabel
                  htmlFor="identifier"
                  className="text-foreground font-semibold"
                >
                  SĐT hoặc email
                </FieldLabel>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="SĐT hoặc email"
                  className="focus-visible:ring-primary h-11 transition-all"
                  required
                />
              </Field>

              {/* Input Password */}
              <Field className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="password"
                    className="text-foreground font-semibold"
                  >
                    Mật khẩu
                  </FieldLabel>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary text-sm font-medium underline-offset-4 transition-colors duration-200 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mật khẩu"
                  className="focus-visible:ring-primary h-11 transition-all"
                  required
                />
              </Field>

              {/* Nút Đăng nhập */}
              <Field className="mt-2">
                <Button
                  type="submit"
                  className="h-11 w-full font-medium text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  Đăng nhập
                </Button>
              </Field>

              {/* Đường kẻ phân cách */}
              <FieldSeparator className="*:data-[slot=field-separator-content]:text-muted-foreground mb-1 py-2 text-gray-500 *:data-[slot=field-separator-content]:bg-white *:data-[slot=field-separator-content]:px-3 *:data-[slot=field-separator-content]:text-xs *:data-[slot=field-separator-content]:font-medium *:data-[slot=field-separator-content]:uppercase">
                Hoặc
              </FieldSeparator>

              {/* Nút Google */}
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  className="h-11 w-full bg-white font-medium transition-colors duration-200 hover:bg-gray-50"
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
                </Button>
              </Field>

              {/* Đăng ký */}
              <div className="text-muted-foreground mt-4 text-center text-sm">
                Chưa có tài khoản?{" "}
                <Link
                  href="/dang-ky"
                  className="text-muted-foreground hover:text-primary text-sm font-medium underline-offset-4 transition-colors duration-200 hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
