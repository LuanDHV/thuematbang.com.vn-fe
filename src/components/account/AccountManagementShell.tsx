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
      <section className="py-8">
        <div className="mx-auto w-full max-w-7xl px-5">
          <div className="text-secondary rounded-2xl bg-white p-6 text-sm shadow-sm">
            Đang tải thông tin tài khoản...
          </div>
        </div>
      </section>
    );
  }

  if (!authUser) return null;

  return (
    <section className="min-h-screen py-8">
      <div className="mx-auto w-full max-w-7xl px-5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,28%)_1fr]">
          <AccountSidebar user={authUser} />
          <main className="min-h-screen min-w-0 rounded-2xl bg-white p-4 shadow-sm md:p-6">
            {children}
          </main>
        </div>
      </div>
    </section>
  );
}

