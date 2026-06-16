import {
  BadgeQuestionMark,
  Building2,
  CreditCard,
  FileText,
  FolderCog,
  Inbox,
  LayoutDashboard,
  MapPinned,
  Megaphone,
  Newspaper,
  House,
  Search,
  Tags,
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

export function buildCmsHomeNavItem(): CmsNavItem {
  return {
    href: "/",
    label: "Về trang chủ",
    icon: House,
    exact: true,
  };
}

export function buildUserCmsNavItems(hasPassword: boolean): CmsNavItem[] {
  return [
    {
      href: "/quan-li-tai-khoan/chinh-sua-thong-tin",
      label: "Hồ sơ cá nhân",
      icon: User,
      exact: true,
    },
    {
      href: "/quan-li-tai-khoan/cho-thue",
      label: "Tin cho thuê của tôi",
      icon: Building2,
    },
    {
      href: "/quan-li-tai-khoan/cau-thue",
      label: "Nhu cầu thuê của tôi",
      icon: Inbox,
    },
    {
      href: "/quan-li-tai-khoan/doi-mat-khau",
      label: hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu",
      icon: FolderCog,
      exact: true,
    },
  ];
}

export function buildAdminCmsNavItems(): CmsNavItem[] {
  return [
    {
      href: "/admin",
      label: "Tổng quan",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/quan-li-danh-muc",
      label: "Danh mục",
      icon: Tags,
    },
    {
      href: "/admin/quan-li-tin-cho-thue",
      label: "Tin cho thuê",
      icon: Building2,
    },
    {
      href: "/admin/quan-li-tin-can-thue",
      label: "Tin cần thuê",
      icon: Inbox,
    },
    {
      href: "/admin/quan-li-du-an",
      label: "Dự án",
      icon: FileText,
    },
    {
      href: "/admin/quan-li-tin-tuc",
      label: "Tin tức",
      icon: Newspaper,
    },
    {
      href: "/admin/quan-li-tai-khoan",
      label: "Tài khoản",
      icon: Users,
    },
    {
      href: "/admin/quan-li-dia-diem",
      label: "Địa điểm",
      icon: MapPinned,
    },
    {
      href: "/admin/quan-li-faqs",
      label: "Câu hỏi thường gặp",
      icon: BadgeQuestionMark,
    },
    {
      href: "/admin/quan-li-noi-dung-seo",
      label: "Nội dung SEO",
      icon: FolderCog,
    },
    {
      href: "/admin/quan-li-banners",
      label: "Banner",
      icon: Megaphone,
    },
    {
      href: "/admin/quan-li-leads",
      label: "Lead",
      icon: Search,
    },
    {
      href: "/admin/quan-li-thanh-toan",
      label: "Thanh toán",
      icon: CreditCard,
    },
  ];
}

export function getCmsRoleLabel(
  role: AppUser["role"],
  scope: "user" | "admin",
) {
  if (scope === "admin" || role === "ADMIN") return "CMS Admin";
  return "CMS User";
}
