import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import CmsLayout from "@/components/cms/shared/CmsLayout";
import AdminSidebar from "@/components/cms/admin/AdminSidebar";
import { getServerAuthUser } from "@/lib/server-auth";

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
    <CmsLayout sidebar={<AdminSidebar user={authUser} />}>{children}</CmsLayout>
  );
}
