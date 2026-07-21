import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { createPageMetadata } from "@/lib/metadata";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = createPageMetadata({
  title: "Đăng nhập ngay",
  description:
    "Đăng nhập vào tài khoản Thuematbang.com.vn để quản lý tin đăng và thông tin cá nhân.",
  pathname: "/dang-nhap",
  noIndex: true,
});

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function resolveRedirectTo(
  searchParams: Record<string, string | string[] | undefined> | undefined,
) {
  const fromValue = searchParams?.from;
  const fromPath = Array.isArray(fromValue) ? fromValue[0] : fromValue;

  if (fromPath && fromPath.startsWith("/") && !fromPath.startsWith("//")) {
    return fromPath;
  }

  return "/";
}

export default async function DangNhapPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectTo = resolveRedirectTo(resolvedSearchParams);

  return (
    <div className="bg-app flex min-h-dvh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg md:max-w-5xl">
        <Link
          href="/"
          className="inline-flex rounded-lg px-2 py-1 transition-opacity hover:opacity-85 lg:mb-5"
        >
          <Image
            src="/imgs/logo-symbol.webp"
            alt="Thuematbang.com.vn"
            width={160}
            height={80}
            priority
            loading="eager"
            className="h-14 w-28 object-contain md:h-20 md:w-40"
          />
        </Link>
        <div>
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}
