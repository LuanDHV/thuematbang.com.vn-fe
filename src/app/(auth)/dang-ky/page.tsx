import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";
import { createPageMetadata } from "@/lib/metadata";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = createPageMetadata({
  title: "Đăng ký",
  description:
    "Tạo tài khoản mới trên Thuematbang.com.vn để bắt đầu quản lý nhu cầu thuê và cho thuê.",
  pathname: "/dang-ky",
  noIndex: true,
});

export default function DangKyPage() {
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
        <SignupForm />
      </div>
    </div>
  );
}
