import type {
  AuthProvider,
  CategoryType,
  ContentStatus,
  LeadStatus,
  ListingMatchStatus,
  ListingStatus,
  OrderStatus,
  PriceUnit,
  PropertyDirection,
  PropertyPriority,
  PublishSource,
  PurchaseType,
  UserRole,
} from "@/types/enums";

import {
  AUTH_PROVIDER_VALUES,
  BANNER_POSITION_VALUES,
  CATEGORY_TYPE_VALUES,
  CONTENT_STATUS_VALUES,
  LEAD_STATUS_VALUES,
  LISTING_MATCH_STATUS_VALUES,
  LISTING_STATUS_VALUES,
  ORDER_STATUS_VALUES,
  PAGE_VALUES,
  PRICE_UNIT_VALUES,
  PROPERTY_DIRECTION_VALUES,
  PROPERTY_PRIORITY_VALUES,
  PUBLISH_SOURCE_VALUES,
  PURCHASE_TYPE_VALUES,
  USER_ROLE_VALUES,
} from "@/constants/enum-values";

export type EnumOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export const PROPERTY_DIRECTION_OPTIONS: EnumOption<PropertyDirection>[] =
  PROPERTY_DIRECTION_VALUES.map((value) => {
    const labels: Record<PropertyDirection, string> = {
      BAC: "Bắc",
      DONG_BAC: "Đông Bắc",
      DONG: "Đông",
      DONG_NAM: "Đông Nam",
      NAM: "Nam",
      TAY_NAM: "Tây Nam",
      TAY: "Tây",
      TAY_BAC: "Tây Bắc",
    };

    return { value, label: labels[value] };
  });

export const PROPERTY_PRIORITY_OPTIONS: EnumOption<PropertyPriority>[] =
  PROPERTY_PRIORITY_VALUES.map((value) => {
    const labels: Record<PropertyPriority, string> = {
      FREE: "Miễn phí",
      STANDARD: "Tiêu chuẩn",
      PREMIUM: "Cao cấp",
    };

    return { value, label: labels[value] };
  });

export const PUBLISH_SOURCE_OPTIONS: EnumOption<PublishSource>[] =
  PUBLISH_SOURCE_VALUES.map((value) => {
    const labels: Record<PublishSource, string> = {
      FREE_QUOTA: "Miễn phí",
      PAID_PACKAGE: "Gói trả phí",
    };

    return { value, label: labels[value] };
  });

export const PRICE_UNIT_OPTIONS: EnumOption<PriceUnit>[] =
  PRICE_UNIT_VALUES.map((value) => {
    const labels: Record<PriceUnit, string> = {
      MILLION: "Triệu",
      BILLION: "Tỷ",
      THOUSAND_PER_M2: "Nghìn/m²",
      MILLION_PER_M2: "Triệu/m²",
    };

    return { value, label: labels[value] };
  });

export const PUBLISH_STATUS_OPTIONS: EnumOption<ListingStatus>[] =
  LISTING_STATUS_VALUES.map((value) => {
    const labels: Record<ListingStatus, string> = {
      DRAFT: "Nháp",
      PENDING: "Chờ duyệt",
      PUBLISHED: "Đã đăng",
      REJECTED: "Từ chối",
      ARCHIVED: "Lưu trữ",
    };

    return { value, label: labels[value] };
  });

export const CONTENT_STATUS_OPTIONS: EnumOption<ContentStatus>[] =
  CONTENT_STATUS_VALUES.map((value) => {
    const labels: Record<ContentStatus, string> = {
      DRAFT: "Nháp",
      PUBLISHED: "Đã đăng",
      ARCHIVED: "Lưu trữ",
    };

    return { value, label: labels[value] };
  });

export const RENT_REQUEST_STATUS_OPTIONS: EnumOption<ListingStatus>[] =
  PUBLISH_STATUS_OPTIONS;

export const CATEGORY_TYPE_OPTIONS: EnumOption<CategoryType>[] =
  CATEGORY_TYPE_VALUES.map((value) => {
    const labels: Record<CategoryType, string> = {
      PROPERTY: "Cho thuê",
      RENT_REQUEST: "Cần thuê",
      PROJECT: "Dự án",
      NEWS: "Tin tức",
    };

    return { value, label: labels[value] };
  });

export const LEAD_STATUS_OPTIONS: EnumOption<LeadStatus>[] =
  LEAD_STATUS_VALUES.map((value) => {
    const labels: Record<LeadStatus, string> = {
      NEW: "Mới",
      CONTACTED: "Đã liên hệ",
      QUALIFIED: "Đã phù hợp",
      REJECTED: "Từ chối",
    };

    return { value, label: labels[value] };
  });

export const LISTING_MATCH_STATUS_OPTIONS: EnumOption<ListingMatchStatus>[] =
  LISTING_MATCH_STATUS_VALUES.map((value) => {
    const labels: Record<ListingMatchStatus, string> = {
      CANDIDATE: "Đề xuất ghép",
      MATCHED: "Đã ghép",
      REJECTED: "Từ chối",
    };

    return { value, label: labels[value] };
  });

export const USER_ROLE_OPTIONS: EnumOption<UserRole>[] = USER_ROLE_VALUES.map(
  (value) => {
    const labels: Record<UserRole, string> = {
      CUSTOMER: "Khách hàng",
      AGENT: "Môi giới",
      ADMIN: "Quản trị viên",
    };

    return { value, label: labels[value] };
  },
);

export const AUTH_PROVIDER_OPTIONS: EnumOption<AuthProvider>[] =
  AUTH_PROVIDER_VALUES.map((value) => {
    const labels: Record<AuthProvider, string> = {
      LOCAL: "Local",
      GOOGLE: "Google",
    };

    return { value, label: labels[value] };
  });

export const PURCHASE_TYPE_OPTIONS: EnumOption<PurchaseType>[] =
  PURCHASE_TYPE_VALUES.map((value) => {
    const labels: Record<PurchaseType, string> = {
      PROPERTY_POST_PACKAGE: "Gói đăng tin",
      PROPERTY_BOOST: "Gói đẩy tin",
      RENT_REQUEST_EXPRESS: "Tin hỏa tốc",
    };

    return { value, label: labels[value] };
  });

export const ORDER_STATUS_OPTIONS: EnumOption<OrderStatus>[] =
  ORDER_STATUS_VALUES.map((value) => {
    const labels: Record<OrderStatus, string> = {
      PENDING: "Chờ xử lý",
      ACTIVE: "Đang hoạt động",
      EXPIRED: "Hết hạn",
      CANCELED: "Đã hủy",
    };

    return { value, label: labels[value] };
  });

export const PAGE_OPTIONS = PAGE_VALUES.map((value) => {
  const labels: Record<(typeof PAGE_VALUES)[number], string> = {
    home: "Trang chủ",
    "cho-thue": "Trang cho thuê",
    "can-thue": "Trang cần thuê",
    "du-an": "Trang Dự án",
    "tin-tuc": "Trang tin tức",
  };

  return { value, label: labels[value] };
});

export const BANNER_PAGE_OPTIONS = PAGE_OPTIONS;

export const BANNER_POSITION_OPTIONS = BANNER_POSITION_VALUES.map((value) => {
  const labels: Record<(typeof BANNER_POSITION_VALUES)[number], string> = {
    top: "Top",
    middle: "Middle",
    bottom: "Bottom",
  };

  return { value, label: labels[value] };
});

export const FAQ_PAGE_OPTIONS = PAGE_OPTIONS;

export const SEO_CONTENT_PAGE_OPTIONS = PAGE_OPTIONS;

export const PROPERTY_DIRECTION_LABEL_MAP: Record<PropertyDirection, string> =
  Object.fromEntries(
    PROPERTY_DIRECTION_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<PropertyDirection, string>;

export const PROPERTY_PRIORITY_LABEL_MAP: Record<PropertyPriority, string> =
  Object.fromEntries(
    PROPERTY_PRIORITY_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<PropertyPriority, string>;

export const PUBLISH_STATUS_LABEL_MAP: Record<ListingStatus, string> =
  Object.fromEntries(
    PUBLISH_STATUS_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<ListingStatus, string>;

export const CONTENT_STATUS_LABEL_MAP: Record<ContentStatus, string> =
  Object.fromEntries(
    CONTENT_STATUS_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<ContentStatus, string>;

export const LEAD_STATUS_LABEL_MAP: Record<LeadStatus, string> =
  Object.fromEntries(
    LEAD_STATUS_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<LeadStatus, string>;

export const LISTING_MATCH_STATUS_LABEL_MAP: Record<
  ListingMatchStatus,
  string
> = Object.fromEntries(
  LISTING_MATCH_STATUS_OPTIONS.map((option) => [option.value, option.label]),
) as Record<ListingMatchStatus, string>;

export const CATEGORY_TYPE_LABEL_MAP: Record<CategoryType, string> =
  Object.fromEntries(
    CATEGORY_TYPE_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<CategoryType, string>;

export const USER_ROLE_LABEL_MAP: Record<UserRole, string> = Object.fromEntries(
  USER_ROLE_OPTIONS.map((option) => [option.value, option.label]),
) as Record<UserRole, string>;

export const AUTH_PROVIDER_LABEL_MAP: Record<AuthProvider, string> =
  Object.fromEntries(
    AUTH_PROVIDER_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<AuthProvider, string>;

export const PURCHASE_TYPE_LABEL_MAP: Record<PurchaseType, string> =
  Object.fromEntries(
    PURCHASE_TYPE_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<PurchaseType, string>;

export const ORDER_STATUS_LABEL_MAP: Record<OrderStatus, string> =
  Object.fromEntries(
    ORDER_STATUS_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<OrderStatus, string>;
