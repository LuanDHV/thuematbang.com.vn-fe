import type {
  ContentStatus,
  DealCaseStatus,
  ListingStatus,
  PaymentStatus,
  ProposalStatus,
} from "@thuematbang/contracts";
import { Tag } from "antd";

type StatusKind =
  | "listing"
  | "content"
  | "deal-case"
  | "payment"
  | "proposal";
type StatusTone =
  | "success"
  | "pending"
  | "info"
  | "danger"
  | "neutral"
  | "warning";

type Props = {
  status:
    | ListingStatus
    | ContentStatus
    | DealCaseStatus
    | PaymentStatus
    | ProposalStatus
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
  NEW: { tone: "pending", label: "Mới tiếp nhận" },
  CONTACTED: { tone: "info", label: "Đang chăm sóc" },
  QUALIFIED: { tone: "success", label: "Chốt thành công" },
  REJECTED_LEAD: { tone: "danger", label: "Dừng chăm sóc" },
  SUCCESS: { tone: "success", label: "Thành công" },
  FAILED: { tone: "danger", label: "Thất bại" },
  CANCELED: { tone: "neutral", label: "Đã hủy" },
  SUGGESTED: { tone: "pending", label: "Đề xuất mới" },
  QUALIFIED_PROPOSAL: { tone: "info", label: "Xác nhận phù hợp" },
  NEGOTIATING: { tone: "warning", label: "Đàm phán" },
  DEAL_WON: { tone: "success", label: "Đã chốt đề xuất" },
  DEAL_LOST: { tone: "danger", label: "Đề xuất không hợp" },
  CANCELLED_AUTO: { tone: "neutral", label: "Tự động hủy" },
  APPROVED: { tone: "info", label: "Đã duyệt" },
  PENDING_APPROVAL: { tone: "warning", label: "Chờ duyệt" },
  REJECTED_APPROVAL: { tone: "danger", label: "Từ chối" },
};

export function AdminStatusBadge({ status, kind, type }: Props) {
  const resolvedKind = kind ?? type;
  const resolvedStatus =
    resolvedKind === "deal-case" && status === "REJECTED"
      ? "REJECTED_LEAD"
      : resolvedKind === "proposal" && status === "QUALIFIED"
        ? "QUALIFIED_PROPOSAL"
        : status;
  const meta = STATUS_META[resolvedStatus] ?? {
    tone: "neutral" as const,
    label: String(status),
  };

  return (
    <Tag className={`admin-status-badge admin-status-badge--${meta.tone}`}>
      {meta.label}
    </Tag>
  );
}
