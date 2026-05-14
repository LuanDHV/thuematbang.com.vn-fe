import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex min-w-md flex-col gap-6", className)} {...props}>
      <FieldGroup className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Đăng nhập tài khoản
          </h1>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Nhập số điện thoại hoặc email"
            required
            className="focus-visible:ring-primary/20 focus-visible:border-primary bg-background rounded-xl border border-gray-300"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
            <a
              href="#"
              className="text-primary ml-auto text-sm underline-offset-4 hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Nhập mật khẩu"
            required
            className="focus-visible:ring-primary/20 focus-visible:border-primary bg-background rounded-xl border border-gray-300"
          />
        </Field>
        <Field>
          <Button
            type="submit"
            className="bg-primary h-11 rounded-xl text-white hover:brightness-105"
          >
            Đăng nhập
          </Button>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Hoặc
        </FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            className="border-primary text-primary hover:bg-primary/10 mb-2 h-11 rounded-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Đăng nhập với Google
          </Button>
          <FieldDescription className="text-center">
            Chưa có tài khoản?
            <a href="#" className="text-primary underline underline-offset-4">
              Đăng ký
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
