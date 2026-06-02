"use client";

import { ReactNode } from "react";
import CmsLayout from "@/components/cms/shared/CmsLayout";
import { useAuthMe } from "@/hooks/use-auth";
import UserSidebar from "@/components/cms/user/UserSidebar";

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

  return (
    <CmsLayout
      title="Quản lý tài khoản"
      description="Cập nhật hồ sơ cá nhân và bảo mật tài khoản trong cùng một khung CMS."
      eyebrow="CMS User"
      sidebar={<UserSidebar user={authUser} />}
    >
      {children}
    </CmsLayout>
  );
}
