"use client";

import CmsSidebar from "@/components/cms/shared/CmsSidebar";
import { buildAdminCmsNavItems } from "@/components/cms/shared/cms-navigation";
import type { User as UserType } from "@/types";

type AdminSidebarProps = {
  user: UserType;
  onNavigate?: () => void;
};

export default function AdminSidebar({ user, onNavigate }: AdminSidebarProps) {
  return (
    <CmsSidebar
      user={user}
      items={buildAdminCmsNavItems()}
      onNavigate={onNavigate}
    />
  );
}
