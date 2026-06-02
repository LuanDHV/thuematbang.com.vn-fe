"use client";

import { ReactNode } from "react";
import CmsLayout from "@/components/cms/shared/CmsLayout";
import AdminSidebar from "@/components/cms/admin/AdminSidebar";
import { useAuthMe } from "@/hooks/use-auth";

type AdminManagementShellProps = {
  children: ReactNode;
};

export default function AdminManagementShell({
  children,
}: AdminManagementShellProps) {
  const { data: authUser, isLoading } = useAuthMe();

  if (isLoading) {
    return (
      <section className="layout-container layout-section-sm">
        <div className="surface-panel p-6">
          <p className="text-secondary text-sm">Đang tải khu quản trị...</p>
        </div>
      </section>
    );
  }

  if (!authUser || authUser.role !== "ADMIN") {
    return (
      <section className="layout-container layout-section-sm">
        <div className="surface-panel p-6">
          <p className="text-secondary text-sm">
            Bạn không có quyền truy cập khu quản trị.
          </p>
        </div>
      </section>
    );
  }

  return (
    <CmsLayout
      title="Quản trị CMS"
      description="Một layout chung cho dashboard, quản lý nội dung và tác vụ vận hành."
      eyebrow="CMS Admin"
      sidebar={<AdminSidebar user={authUser} />}
    >
      {children}
    </CmsLayout>
  );
}
