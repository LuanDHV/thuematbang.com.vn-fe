"use client";

import CmsSidebar from "@/components/cms/shared/CmsSidebar";
import { buildUserCmsNavItems } from "@/lib/cms-navigation";
import type { User as UserType } from "@/types";

type UserSidebarProps = {
  user: UserType;
};

export default function UserSidebar({ user }: UserSidebarProps) {
  return (
    <CmsSidebar
      user={user}
      items={buildUserCmsNavItems(user.hasPassword ?? true)}
    />
  );
}
