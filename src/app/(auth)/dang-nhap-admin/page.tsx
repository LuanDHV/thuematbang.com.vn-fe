import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

import { createPageMetadata } from "@/lib/metadata";
import Image from "next/image";

export const metadata: Metadata = createPageMetadata({
  title: "Đăng nhập quản trị",
  description: "Đăng nhập vào khu vực quản trị Thuematbang.com.vn.",
  pathname: "/dang-nhap-admin",
  noIndex: true,
});

type AdminLoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function resolveRedirectTo(
  searchParams: Record<string, string | string[] | undefined> | undefined,
) {
  const nextValue = searchParams?.next;
  const nextPath = Array.isArray(nextValue) ? nextValue[0] : nextValue;

  if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
    return nextPath;
  }

  return "/admin";
}

export default async function DangNhapAdminPage({
  searchParams,
}: AdminLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectTo = resolveRedirectTo(resolvedSearchParams);

  return (
    <div className="to-primary/10 flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-white p-6 md:p-10">
      <div className="w-full max-w-lg md:max-w-5xl">
        <Link
          href="/"
          className="inline-flex rounded-lg px-2 py-1 transition-opacity hover:opacity-85 lg:mb-5"
        >
          <Image
            src="/imgs/logo-TMB-black.png"
            alt="Thuematbang.com.vn"
            width={160}
            height={80}
            priority
            loading="eager"
            className="h-14 w-28 object-contain md:h-20 md:w-40"
          />
        </Link>
        <LoginForm
          variant="admin"
          redirectTo={redirectTo}
          className="mx-auto"
        />
      </div>
    </div>
  );
}
