"use client";

import CmsSidebar from "@/components/cms/shared/CmsSidebar";
import { buildAdminCmsNavItems } from "@/lib/navigation/cms-navigation";
import type { User as UserType } from "@/types";

type AdminSidebarProps = {
  user: UserType;
};

export default function AdminSidebar({ user }: AdminSidebarProps) {
  return <CmsSidebar user={user} items={buildAdminCmsNavItems()} />;
}
