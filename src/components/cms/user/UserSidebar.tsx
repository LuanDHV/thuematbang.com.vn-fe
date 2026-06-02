"use client";

import CmsSidebar from "@/components/cms/shared/CmsSidebar";
import { buildUserCmsNavItems } from "@/components/cms/shared/cms-navigation";
import type { User as UserType } from "@/types";

type UserSidebarProps = {
  user: UserType;
};

export default function UserSidebar({ user }: UserSidebarProps) {
  return (
    <CmsSidebar
      user={user}
      items={buildUserCmsNavItems(user.hasPassword ?? true)}
      title="Khu vực tài khoản"
      description="Quản lý hồ sơ và bảo mật trong cùng một layout CMS."
      eyebrow="CMS User"
    />
  );
}
