import {
  ClipboardList,
  Heart,
  House,
  LayoutPanelTop,
  LockKeyholeOpen,
  Signpost,
  type LucideIcon,
  UserRoundCog,
} from "lucide-react";

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
      href: "/quan-li-tai-khoan/lien-he-da-gui",
      label: "Liên hệ đã gửi",
      icon: LayoutPanelTop,
    },
    {
      href: "/quan-li-tai-khoan/chinh-sua-thong-tin",
      label: "Hồ sơ cá nhân",
      icon: UserRoundCog,
      exact: true,
    },
    {
      href: "/quan-li-tai-khoan/cho-thue",
      label: "Tin cho thuê của tôi",
      icon: Signpost,
    },
    {
      href: "/quan-li-tai-khoan/can-thue",
      label: "Nhu cầu thuê của tôi",
      icon: ClipboardList,
    },
    {
      href: "/quan-li-tai-khoan/da-quan-tam",
      label: "Tin đã quan tâm",
      icon: Heart,
    },
    {
      href: "/quan-li-tai-khoan/doi-mat-khau",
      label: hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu",
      icon: LockKeyholeOpen,
      exact: true,
    },
  ];
}
