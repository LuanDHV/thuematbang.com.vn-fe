"use client";

import CmsSidebar from "@/components/cms/shared/CmsSidebar";
import { buildUserCmsNavItems } from "@/components/cms/shared/cms-navigation";
import type { User as UserType } from "@/types";

type UserSidebarProps = {
  user: UserType;
  onNavigate?: () => void;
};

export default function UserSidebar({ user, onNavigate }: UserSidebarProps) {
  return (
    <CmsSidebar
      user={user}
      items={buildUserCmsNavItems(user.hasPassword ?? true)}
      onNavigate={onNavigate}
    />
  );
}
