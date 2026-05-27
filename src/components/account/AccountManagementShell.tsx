"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useAuthMe } from "@/hooks/use-auth";
import AccountSidebar from "@/components/account/AccountSidebar";
import { Button } from "@/components/ui/button";

type AccountManagementShellProps = {
  children: ReactNode;
};

export default function AccountManagementShell({
  children,
}: AccountManagementShellProps) {
  const { data: authUser, isLoading } = useAuthMe();

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="rounded-2xl bg-white p-6 text-sm text-gray-500 shadow-sm">
            Đang tải thông tin tài khoản...
          </div>
        </div>
      </section>
    );
  }

  if (!authUser) {
    return (
      <section className="py-8">
        <div className="mx-auto w-full max-w-4xl px-4">
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900">
              Quản lý tài khoản
            </h1>
            <p className="text-sm text-gray-600">
              Bạn chưa đăng nhập. Vui lòng đăng nhập để quản lý tài khoản.
            </p>
            <Button asChild size="lg" className="w-fit">
              <Link href="/dang-nhap">Đi đến trang đăng nhập</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,28%)_1fr]">
          <AccountSidebar user={authUser} />
          <main className="min-w-0 rounded-2xl bg-white p-4 shadow-sm md:p-6">
            {children}
          </main>
        </div>
      </div>
    </section>
  );
}
