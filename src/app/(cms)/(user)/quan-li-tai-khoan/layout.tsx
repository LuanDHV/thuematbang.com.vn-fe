import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import CmsLayout from "@/components/cms/shared/CmsLayout";
import UserSidebar from "@/components/cms/user/UserSidebar";
import { getServerAuthUser } from "@/lib/server/server-auth";

export default async function UserManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Resolve auth at the layout boundary so every account subpage shares the same guard.
  const authUser = await getServerAuthUser();

  if (!authUser) {
    redirect("/dang-nhap?from=/quan-li-tai-khoan");
  }

  return (
    <CmsLayout
      sidebar={<UserSidebar user={authUser} />}
      mobileSidebar={<UserSidebar user={authUser} forceExpanded />}
    >
      {children}
    </CmsLayout>
  );
}
