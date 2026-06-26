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

export default function DangNhapPage() {
  return (
    <div className="bg-app flex min-h-dvh flex-col items-center justify-center p-6 md:p-10">
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
        <div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
