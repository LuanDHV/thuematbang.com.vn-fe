"use client";

import Link from "next/link";
import { useAuthMe } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { data: authUser, isLoading } = useAuthMe();

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-8 lg:py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
          Đang tải thông tin hồ sơ...
        </div>
      </section>
    );
  }

  if (!authUser) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-8 lg:py-12">
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-gray-900">Hồ sơ người dùng</h1>
          <p className="text-sm text-gray-600">
            Bạn chưa đăng nhập. Vui lòng đăng nhập để xem hồ sơ cá nhân.
          </p>
          <Button asChild size="lg" className="w-fit">
            <Link href="/dang-nhap">Đi đến trang đăng nhập</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 lg:py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Hồ sơ người dùng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Thông tin tài khoản đang đăng nhập
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <ProfileRow label="Họ và tên" value={authUser.fullName || "-"} />
          <ProfileRow label="Email" value={authUser.email || "-"} />
          <ProfileRow label="Số điện thoại" value={authUser.phone || "-"} />
          <ProfileRow label="Vai trò" value={authUser.role || "-"} />
        </div>
      </div>
    </section>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}
