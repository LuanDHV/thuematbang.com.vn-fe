import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import CmsLayout from "@/components/cms/shared/CmsLayout";
import UserSidebar from "@/components/cms/user/UserSidebar";
import { getServerAuthUser } from "@/lib/server-auth";

export default async function UserManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authUser = await getServerAuthUser();

  if (!authUser) {
    redirect("/dang-nhap?from=/quan-li-tai-khoan");
  }

  return (
    <CmsLayout sidebar={<UserSidebar user={authUser} />}>
      {children}
    </CmsLayout>
  );
}
