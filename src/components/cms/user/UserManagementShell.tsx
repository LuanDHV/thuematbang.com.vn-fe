"use client";

import { ReactNode } from "react";
import CmsLayout from "@/components/cms/shared/CmsLayout";
import UserSidebar from "@/components/cms/user/UserSidebar";
import { useAuthMe } from "@/hooks/use-auth";

type UserManagementShellProps = {
  children: ReactNode;
};

export default function UserManagementShell({
  children,
}: UserManagementShellProps) {
  const { data: authUser, isLoading } = useAuthMe();

  if (isLoading) {
    return (
      <section className="layout-container layout-section-sm">
        <div className="surface-panel p-6">
          <p className="text-secondary text-sm">
            Đang tải thông tin tài khoản...
          </p>
        </div>
      </section>
    );
  }

  if (!authUser) return null;

  return <CmsLayout sidebar={<UserSidebar user={authUser} />}>{children}</CmsLayout>;
}
