import type { ReactNode } from "react";
import {
  CreditCardOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  FlagOutlined,
  HomeOutlined,
  NotificationOutlined,
  ReadOutlined,
  RocketOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
  KeyOutlined,
  SearchOutlined,
} from "@ant-design/icons";

export type AdminMenuGroupKey =
  | "overview"
  | "for-rent"
  | "rent-request"
  | "connections"
  | "content"
  | "system"
  | "monetization";

export type AdminResourceName =
  | "dashboard"
  | "properties"
  | "rent-requests"
  | "leads-property"
  | "leads-rent-request"
  | "archive"
  | "news"
  | "projects"
  | "banners"
  | "users"
  | "categories"
  | "faqs"
  | "static-pages"
  | "seo-contents"
  | "locations"
  | "payments"
  | "property-package-orders"
  | "property-boost-orders"
  | "rent-request-express-orders";

type ResourceMeta = {
  label: string;
  shortLabel?: string;
  group: AdminMenuGroupKey;
  icon?: ReactNode;
  usable?: boolean;
};

type AdminResource = {
  name: AdminResourceName;
  list: string;
  create?: string;
  edit?: string;
  show?: string;
  meta: ResourceMeta;
};

export const adminResources: AdminResource[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Tổng quan",
      shortLabel: "Tổng quan",
      group: "overview",
      icon: <DashboardOutlined />,
      usable: true,
    },
  },
  {
    name: "properties",
    list: "/properties",
    create: "/properties/create",
    edit: "/properties/edit/:id",
    show: "/properties/show/:id",
    meta: {
      label: "Tin cho thuê",
      shortLabel: "Cho thuê",
      group: "for-rent",
      icon: <HomeOutlined />,
      usable: true,
    },
  },
  {
    name: "leads-property",
    list: "/leads/property",
    show: "/leads/property/show/:id",
    meta: {
      label: "Liên hệ cho thuê",
      shortLabel: "Liên hệ cho thuê",
      group: "for-rent",
      icon: <TeamOutlined />,
      usable: true,
    },
  },
  {
    name: "rent-requests",
    list: "/rent-requests",
    create: "/rent-requests/create",
    edit: "/rent-requests/edit/:id",
    show: "/rent-requests/show/:id",
    meta: {
      label: "Tin cần thuê",
      shortLabel: "Cần thuê",
      group: "rent-request",
      icon: <FileTextOutlined />,
      usable: true,
    },
  },
  {
    name: "leads-rent-request",
    list: "/leads/rent-request",
    show: "/leads/rent-request/show/:id",
    meta: {
      label: "Liên hệ cần thuê",
      shortLabel: "Liên hệ cần thuê",
      group: "rent-request",
      icon: <UserOutlined />,
      usable: true,
    },
  },
  {
    name: "archive",
    list: "/archive",
    show: "/archive/show/:id",
    meta: {
      label: "Lưu trữ hồ sơ",
      shortLabel: "Lưu trữ",
      group: "connections",
      icon: <ReadOutlined />,
      usable: true,
    },
  },
  {
    name: "news",
    list: "/news",
    create: "/news/create",
    edit: "/news/edit/:id",
    show: "/news/show/:id",
    meta: {
      label: "Tin tức",
      shortLabel: "Tin tức",
      group: "content",
      icon: <ReadOutlined />,
      usable: true,
    },
  },
  {
    name: "projects",
    list: "/projects",
    create: "/projects/create",
    edit: "/projects/edit/:id",
    show: "/projects/show/:id",
    meta: {
      label: "Dự án",
      shortLabel: "Dự án",
      group: "content",
      icon: <NotificationOutlined />,
      usable: true,
    },
  },
  {
    name: "banners",
    list: "/banners",
    create: "/banners/create",
    edit: "/banners/edit/:id",
    meta: {
      label: "Banner",
      shortLabel: "Banner",
      group: "content",
      icon: <NotificationOutlined />,
      usable: true,
    },
  },
  {
    name: "users",
    list: "/users",
    show: "/users/show/:id",
    edit: "/users/edit/:id",
    meta: {
      label: "Tài khoản",
      shortLabel: "Tài khoản",
      group: "system",
      icon: <UserOutlined />,
      usable: true,
    },
  },
  {
    name: "categories",
    list: "/categories",
    create: "/categories/create",
    edit: "/categories/edit/:id",
    meta: {
      label: "Danh mục",
      shortLabel: "Danh mục",
      group: "system",
      icon: <SettingOutlined />,
      usable: true,
    },
  },
  {
    name: "faqs",
    list: "/faqs",
    create: "/faqs/create",
    edit: "/faqs/edit/:id",
    meta: {
      label: "FAQ",
      shortLabel: "FAQ",
      group: "system",
      icon: <FileTextOutlined />,
      usable: true,
    },
  },
  {
    name: "static-pages",
    list: "/static-pages",
    create: "/static-pages/create",
    edit: "/static-pages/edit/:id",
    meta: {
      label: "Trang tĩnh",
      shortLabel: "Trang tĩnh",
      group: "system",
      icon: <FileTextOutlined />,
      usable: true,
    },
  },
  {
    name: "seo-contents",
    list: "/seo-contents",
    create: "/seo-contents/create",
    edit: "/seo-contents/edit/:id",
    meta: {
      label: "Nội dung SEO",
      shortLabel: "SEO",
      group: "system",
      icon: <ReadOutlined />,
      usable: true,
    },
  },
  {
    name: "locations",
    list: "/locations",
    meta: {
      label: "Địa điểm",
      shortLabel: "Địa điểm",
      group: "system",
      icon: <EnvironmentOutlined />,
      usable: true,
    },
  },
  {
    name: "payments",
    list: "/payments",
    meta: {
      label: "Thanh toán",
      shortLabel: "Thanh toán",
      group: "monetization",
      icon: <CreditCardOutlined />,
      usable: true,
    },
  },
  {
    name: "property-package-orders",
    list: "/orders/packages",
    meta: {
      label: "Gói tin",
      shortLabel: "Gói tin",
      group: "monetization",
      icon: <ShoppingCartOutlined />,
      usable: true,
    },
  },
  {
    name: "property-boost-orders",
    list: "/orders/boosts",
    meta: {
      label: "Đẩy tin",
      shortLabel: "Đẩy tin",
      group: "monetization",
      icon: <RocketOutlined />,
      usable: true,
    },
  },
  {
    name: "rent-request-express-orders",
    list: "/orders/express",
    meta: {
      label: "Express",
      shortLabel: "Express",
      group: "monetization",
      icon: <NotificationOutlined />,
      usable: true,
    },
  },
];

export const visibleAdminResources = adminResources.filter(
  (resource) => resource.meta.usable !== false
);

export const menuGroups: Array<{
  key: AdminMenuGroupKey;
  label: string;
  icon: ReactNode;
  items: AdminResourceName[];
}> = [
  {
    key: "overview",
    label: "Tổng quan",
    icon: <DashboardOutlined />,
    items: ["dashboard"],
  },
  {
    key: "for-rent",
    label: "Quản lý cho thuê",
    icon: <KeyOutlined />,
    items: ["properties", "leads-property"],
  },
  {
    key: "rent-request",
    label: "Quản lý cần thuê",
    icon: <SearchOutlined />,
    items: ["rent-requests", "leads-rent-request"],
  },
  {
    key: "connections",
    label: "Xử lý hồ sơ",
    icon: <FlagOutlined />,
    items: ["archive"],
  },
  {
    key: "content",
    label: "Quản lý nội dung",
    icon: <ReadOutlined />,
    items: [
      "projects",
      "news",
      "seo-contents",
      "faqs",
      "banners",
      "static-pages",
      "categories",
      "locations",
    ],
  },
  {
    key: "monetization",
    label: "Quản lý doanh thu",
    icon: <CreditCardOutlined />,
    items: [
      "payments",
      "property-package-orders",
      "property-boost-orders",
      "rent-request-express-orders",
    ],
  },
  {
    key: "system",
    label: "Quản lý hệ thống",
    icon: <SettingOutlined />,
    items: ["users"],
  },
];

export function findResourceByPath(
  pathname: string
): AdminResource | undefined {
  return visibleAdminResources
    .slice()
    .sort((left, right) => right.list.length - left.list.length)
    .find((resource) => {
      if (resource.list === "/") {
        return pathname === "/";
      }

      return (
        pathname === resource.list || pathname.startsWith(`${resource.list}/`)
      );
    });
}
