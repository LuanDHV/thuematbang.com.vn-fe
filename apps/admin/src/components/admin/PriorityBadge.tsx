import type { PropertyPriority } from "@thuematbang/contracts";
import { Tag } from "antd";

const PRIORITY_META: Record<PropertyPriority, { tone: string; label: string }> = {
  FREE: { tone: "neutral", label: "Miễn phí" },
  STANDARD: { tone: "info", label: "Thường" },
  PREMIUM: { tone: "premium", label: "Cao cấp" },
};

export function AdminPriorityBadge({ priority }: { priority: PropertyPriority | string }) {
  const meta =
    PRIORITY_META[priority as PropertyPriority] ?? {
      tone: "neutral",
      label: String(priority),
    };

  return (
    <Tag className={`admin-status-badge admin-status-badge--${meta.tone}`}>
      {meta.label}
    </Tag>
  );
}
