import {
  BadgeQuestionMark,
  Building2,
  CreditCard,
  FileText,
  FolderCog,
  Inbox,
  Image,
  LayoutDashboard,
  MapPinned,
  Megaphone,
  Newspaper,
  Search,
  Settings,
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
      label: "Tin cho thuê",
      icon: Building2,
    },
    {
      href: "/quan-li-tai-khoan/can-thue",
      label: "Tin cần thuê",
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
      href: "/admin/cho-thue",
      label: "Tin cho thuê",
      icon: Building2,
    },
    {
      href: "/admin/can-thue",
      label: "Tin cần thuê",
      icon: Inbox,
    },
    {
      href: "/admin/du-an",
      label: "Dự án",
      icon: FileText,
    },
    {
      href: "/admin/tin-tuc",
      label: "Tin tức",
      icon: Newspaper,
    },
    {
      href: "/admin/nguoi-dung",
      label: "Người dùng",
      icon: Users,
    },
    {
      href: "/admin/banners",
      label: "Banner",
      icon: Megaphone,
    },
    {
      href: "/admin/categories",
      label: "Danh mục",
      icon: Tags,
    },
    {
      href: "/admin/faqs",
      label: "Câu hỏi thường gặp",
      icon: BadgeQuestionMark,
    },
    {
      href: "/admin/leads",
      label: "Lead",
      icon: Search,
    },
    {
      href: "/admin/media",
      label: "Media",
      icon: Image,
    },
    {
      href: "/admin/payments",
      label: "Thanh toán",
      icon: CreditCard,
    },
    {
      href: "/admin/seo-contents",
      label: "Nội dung SEO",
      icon: FolderCog,
    },
    {
      href: "/admin/locations",
      label: "Địa điểm",
      icon: MapPinned,
    },
    {
      href: "/admin/cai-dat",
      label: "Cài đặt",
      icon: Settings,
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
