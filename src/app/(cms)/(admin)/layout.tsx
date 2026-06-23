import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import CmsLayout from "@/components/cms/shared/CmsLayout";
import AdminSidebar from "@/components/cms/admin/AdminSidebar";
import { getServerAuthUser } from "@/lib/server/server-auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authUser = await getServerAuthUser();

  if (!authUser) {
    redirect("/dang-nhap-admin?next=/admin");
  }

  if (authUser.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div data-theme="admin" className="bg-app text-body min-h-dvh">
      <CmsLayout
        sidebar={<AdminSidebar user={authUser} />}
        mobileSidebar={<AdminSidebar user={authUser} forceExpanded />}
      >
        {children}
      </CmsLayout>
    </div>
  );
}
