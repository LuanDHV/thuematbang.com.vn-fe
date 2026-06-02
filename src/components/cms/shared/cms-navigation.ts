import {
  Building2,
  FileText,
  Image,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  Newspaper,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { User as AppUser } from "@/types";

export type CmsNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export function buildUserCmsNavItems(hasPassword: boolean): CmsNavItem[] {
  return [
    {
      href: "/quan-li-tai-khoan/chinh-sua-thong-tin",
      label: "Hồ sơ cá nhân",
      icon: User,
      exact: true,
    },
    {
      href: "/quan-li-tai-khoan/doi-mat-khau",
      label: hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu",
      icon: KeyRound,
      exact: true,
    },
  ];
}

export function buildAdminCmsNavItems(): CmsNavItem[] {
  return [
    {
      href: "/cms/admin",
      label: "Bảng điều khiển",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/cms/admin/tin-dang",
      label: "Quản lý tin đăng",
      icon: Building2,
    },
    {
      href: "/cms/admin/du-an",
      label: "Quản lý dự án",
      icon: FileText,
    },
    {
      href: "/cms/admin/tin-tuc",
      label: "Quản lý tin tức",
      icon: Newspaper,
    },
    {
      href: "/cms/admin/tin-nhan",
      label: "Quản lý yêu cầu",
      icon: ListChecks,
    },
    {
      href: "/cms/admin/nguoi-dung",
      label: "Quản lý người dùng",
      icon: Users,
    },
    {
      href: "/cms/admin/media",
      label: "Media",
      icon: Image,
    },
    {
      href: "/cms/admin/cai-dat",
      label: "Cài đặt",
      icon: Settings,
    },
  ];
}

export function getCmsRoleLabel(role: AppUser["role"], scope: "user" | "admin") {
  if (scope === "admin" || role === "ADMIN") return "CMS Admin";
  return "CMS User";
}
