import {
  BadgeQuestionMark,
  Building2,
  CreditCard,
  LayoutDashboard,
  Newspaper,
  House,
  Users,
  type LucideIcon,
  UserStar,
  Wallpaper,
  TrendingUp,
  Compass,
  ClipboardList,
  Layers,
  LockKeyholeOpen,
  UserRoundCog,
  Signpost,
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
      icon: UserRoundCog,
      exact: true,
    },
    {
      href: "/quan-li-tai-khoan/goi-dang-tin",
      label: "Gói đăng tin",
      icon: CreditCard,
      exact: true,
    },
    {
      href: "/quan-li-tai-khoan/cho-thue",
      label: "Tin cho thuê của tôi",
      icon: Signpost,
    },
    {
      href: "/quan-li-tai-khoan/cau-thue",
      label: "Nhu cầu thuê của tôi",
      icon: ClipboardList,
    },
    {
      href: "/quan-li-tai-khoan/doi-mat-khau",
      label: hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu",
      icon: LockKeyholeOpen,
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
      icon: Layers,
    },
    {
      href: "/admin/quan-li-tin-cho-thue",
      label: "Tin cho thuê",
      icon: Signpost,
    },
    {
      href: "/admin/quan-li-tin-can-thue",
      label: "Tin cần thuê",
      icon: ClipboardList,
    },
    {
      href: "/admin/quan-li-du-an",
      label: "Dự án",
      icon: Building2,
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
      icon: Compass,
    },
    {
      href: "/admin/quan-li-faqs",
      label: "Câu hỏi thường gặp",
      icon: BadgeQuestionMark,
    },
    {
      href: "/admin/quan-li-noi-dung-seo",
      label: "Nội dung SEO",
      icon: TrendingUp,
    },
    {
      href: "/admin/quan-li-banners",
      label: "Banner",
      icon: Wallpaper,
    },
    {
      href: "/admin/quan-li-leads",
      label: "Lead",
      icon: UserStar,
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
