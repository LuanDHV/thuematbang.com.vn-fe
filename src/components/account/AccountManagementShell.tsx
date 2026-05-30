"use client";

import { ReactNode } from "react";
import { useAuthMe } from "@/hooks/use-auth";
import AccountSidebar from "@/components/account/AccountSidebar";

type AccountManagementShellProps = {
  children: ReactNode;
};

export default function AccountManagementShell({
  children,
}: AccountManagementShellProps) {
  const { data: authUser, isLoading } = useAuthMe();

  if (isLoading) {
    return (
      <section className="layout-container py-8">
        <div className="min-h-[80vh]">
          <div className="text-secondary rounded-lg border border-gray-200 bg-white p-6 text-sm">
            Đang tải thông tin tài khoản...
          </div>
        </div>
      </section>
    );
  }

  if (!authUser) return null;

  return (
    <section className="layout-container py-8">
      <div className="grid min-h-[80vh] grid-cols-1 gap-4 lg:grid-cols-[minmax(260px,25%)_1fr] lg:gap-10">
        <AccountSidebar user={authUser} />
        <main className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-5">
          {children}
        </main>
      </div>
    </section>
  );
}
