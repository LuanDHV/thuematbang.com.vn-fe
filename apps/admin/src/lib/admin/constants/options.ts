import type {
  ContentStatus,
  LeadStatus,
  ListingMatchStatus,
  ListingStatus,
  PaymentStatus,
  PriceUnit,
  PropertyDirection,
  PropertyPriority,
  PublishSource,
  UserRole,
} from "@thuematbang/contracts";

export const LISTING_STATUS_OPTIONS: Array<{
  label: string;
  value: ListingStatus;
}> = [
  { label: "Nháp", value: "DRAFT" },
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã đăng", value: "PUBLISHED" },
  { label: "Từ chối", value: "REJECTED" },
  { label: "Đã ẩn", value: "ARCHIVED" },
];

export const CONTENT_STATUS_OPTIONS: Array<{
  label: string;
  value: ContentStatus;
}> = [
  { label: "Nháp", value: "DRAFT" },
  { label: "Đã đăng", value: "PUBLISHED" },
  { label: "Đã ẩn", value: "ARCHIVED" },
];

export const PROPERTY_PRIORITY_OPTIONS: Array<{
  label: string;
  value: PropertyPriority;
}> = [
  { label: "Miễn phí", value: "FREE" },
  { label: "Thường", value: "STANDARD" },
  { label: "Cao cấp", value: "PREMIUM" },
];

export const PROPERTY_DIRECTION_OPTIONS: Array<{
  label: string;
  value: PropertyDirection;
}> = [
  { label: "Bắc", value: "BAC" },
  { label: "Đông Bắc", value: "DONG_BAC" },
  { label: "Đông", value: "DONG" },
  { label: "Đông Nam", value: "DONG_NAM" },
  { label: "Nam", value: "NAM" },
  { label: "Tây Nam", value: "TAY_NAM" },
  { label: "Tây", value: "TAY" },
  { label: "Tây Bắc", value: "TAY_BAC" },
];

export const PRICE_UNIT_OPTIONS: Array<{
  label: string;
  value: PriceUnit;
}> = [
  { label: "Triệu", value: "MILLION" },
  { label: "Tỷ", value: "BILLION" },
  { label: "Nghìn/m²", value: "THOUSAND_PER_M2" },
  { label: "Triệu/m²", value: "MILLION_PER_M2" },
];

export const PRICE_UNIT_LABELS = Object.fromEntries(
  PRICE_UNIT_OPTIONS.map((option) => [option.value, option.label])
) as Record<PriceUnit, string>;

export function getOptionLabel<T extends string>(
  options: Array<{ label: string; value: T }>,
  value?: string | null,
  fallback = "-"
) {
  if (!value) {
    return fallback;
  }

  return options.find((option) => option.value === value)?.label ?? fallback;
}

export const PUBLISH_SOURCE_OPTIONS: Array<{
  label: string;
  value: PublishSource;
}> = [
  { label: "Miễn phí", value: "FREE_QUOTA" },
  { label: "Gói trả phí", value: "PAID_PACKAGE" },
];

export const LEAD_STATUS_OPTIONS: Array<{
  label: string;
  value: LeadStatus;
}> = [
  { label: "Mới tiếp nhận", value: "NEW" },
  { label: "Đang chăm sóc", value: "CONTACTED" },
  { label: "Chốt thành công", value: "QUALIFIED" },
  { label: "Dừng chăm sóc", value: "REJECTED" },
];

export const MATCH_STATUS_OPTIONS: Array<{
  label: string;
  value: ListingMatchStatus;
}> = [
  { label: "Đề xuất mới", value: "SUGGESTED" },
  { label: "Đã xác nhận phù hợp", value: "QUALIFIED" },
  { label: "Đang đàm phán", value: "NEGOTIATING" },
  { label: "Đã chốt đề xuất", value: "DEAL_WON" },
  { label: "Đề xuất không hợp", value: "DEAL_LOST" },
  { label: "Tự động hủy", value: "CANCELLED_AUTO" },
];

export const PAYMENT_STATUS_OPTIONS: Array<{
  label: string;
  value: PaymentStatus;
}> = [
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Thành công", value: "SUCCESS" },
  { label: "Thất bại", value: "FAILED" },
  { label: "Đã hủy", value: "CANCELED" },
];

export const USER_ROLE_OPTIONS: Array<{
  label: string;
  value: UserRole;
}> = [
  { label: "Khách hàng", value: "CUSTOMER" },
  { label: "Môi giới", value: "AGENT" },
  { label: "Admin", value: "ADMIN" },
];
