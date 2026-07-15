import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";
import { createPageMetadata } from "@/lib/metadata";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = createPageMetadata({
  title: "Đăng ký ngay",
  description: "Tạo tài khoản mới để bắt đầu quản lý nhu cầu thuê và cho thuê.",
  pathname: "/dang-ky",
  noIndex: true,
});

export default function DangKyPage() {
  return (
    <div className="bg-app flex min-h-dvh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg md:max-w-5xl">
        <Link
          href="/"
          className="inline-flex rounded-lg px-2 py-1 transition-opacity hover:opacity-85 lg:mb-5"
        >
          <Image
            src="/imgs/logo-symbol.png"
            alt="Thuematbang.com.vn"
            width={160}
            height={80}
            priority
            loading="eager"
            className="h-14 w-28 object-contain md:h-20 md:w-40"
          />
        </Link>
        <SignupForm />
      </div>
    </div>
  );
}
