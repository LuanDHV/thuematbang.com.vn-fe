import type {
  ContentStatus,
  LeadStatus,
  ListingMatchStatus,
  ListingStatus,
  PaymentStatus,
} from "@thuematbang/contracts";
import { Tag } from "antd";

type StatusKind = "listing" | "content" | "lead" | "payment" | "match";
type StatusTone = "success" | "pending" | "info" | "danger" | "neutral" | "warning";

type Props = {
  status:
    | ListingStatus
    | ContentStatus
    | LeadStatus
    | PaymentStatus
    | ListingMatchStatus
    | string;
  kind?: StatusKind;
  type?: StatusKind;
};

const STATUS_META: Record<string, { tone: StatusTone; label: string }> = {
  DRAFT: { tone: "neutral", label: "Nháp" },
  PENDING: { tone: "pending", label: "Chờ duyệt" },
  PUBLISHED: { tone: "success", label: "Đã đăng" },
  REJECTED: { tone: "danger", label: "Từ chối" },
  ARCHIVED: { tone: "neutral", label: "Đã ẩn" },
  NEW: { tone: "pending", label: "Mới" },
  CONTACTED: { tone: "info", label: "Đã liên hệ" },
  QUALIFIED: { tone: "success", label: "Đạt chuẩn" },
  SUCCESS: { tone: "success", label: "Thành công" },
  FAILED: { tone: "danger", label: "Thất bại" },
  CANCELED: { tone: "neutral", label: "Đã hủy" },
  CANDIDATE: { tone: "pending", label: "Ứng viên" },
  MATCHED: { tone: "success", label: "Đã ghép" },
  ACTIVE: { tone: "success", label: "Đang dùng" },
  EXPIRED: { tone: "neutral", label: "Hết hạn" },
};

export function AdminStatusBadge({ status }: Props) {
  const meta = STATUS_META[status] ?? {
    tone: "neutral" as const,
    label: String(status),
  };

  return (
    <Tag className={`admin-status-badge admin-status-badge--${meta.tone}`}>
      {meta.label}
    </Tag>
  );
}
