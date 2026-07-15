"use client";

import CmsSidebar from "@/components/cms/shared/CmsSidebar";
import { buildUserCmsNavItems } from "@/lib/navigation/cms-navigation";
import type { User as UserType } from "@/types";

type UserSidebarProps = {
  user: UserType;
  forceExpanded?: boolean;
};

export default function UserSidebar({
  user,
  forceExpanded,
}: UserSidebarProps) {
  return (
    <CmsSidebar
      user={user}
      items={buildUserCmsNavItems(user.hasPassword ?? true)}
      forceExpanded={forceExpanded}
    />
  );
}
