import { Button, Select, Space, Typography } from "antd";
import type { AdminSortOption, AdminSortOrder } from "../../../lib/admin/hooks/use-admin-sort-controls";

const { Text } = Typography;

type Props = {
  title?: string;
  fieldLabel?: string;
  orderLabel?: string;
  fieldPlaceholder?: string;
  orderPlaceholder?: string;
  fieldOptions: AdminSortOption[];
  sortField?: string;
  sortOrder: AdminSortOrder;
  onFieldChange: (value?: string) => void;
  onOrderChange: (value: AdminSortOrder) => void;
  onApply: () => void;
  onClear: () => void;
};

export function AdminSortControls({
  title = "Sắp xếp nâng cao",
  fieldLabel = "Trường",
  orderLabel = "Thứ tự",
  fieldPlaceholder = "Chọn trường",
  orderPlaceholder = "Chọn thứ tự",
  fieldOptions,
  sortField,
  sortOrder,
  onFieldChange,
  onOrderChange,
  onApply,
  onClear,
}: Props) {
  return (
    <div className="admin-sort-controls">
      <Text className="admin-sort-controls-title">{title}</Text>
      <Space
        className="admin-sort-controls-grid"
        align="end"
        wrap
        size={12}
      >
        <label className="admin-sort-control">
          <span className="admin-sort-control-label">{fieldLabel}</span>
          <Select
            allowClear
            placeholder={fieldPlaceholder}
            options={fieldOptions}
            value={sortField}
            onChange={(value) => onFieldChange(value ?? undefined)}
            className="admin-sort-control-input"
          />
        </label>
        <label className="admin-sort-control">
          <span className="admin-sort-control-label">{orderLabel}</span>
          <Select
            placeholder={orderPlaceholder}
            value={sortOrder}
            options={[
              { label: "Tăng dần", value: "asc" },
              { label: "Giảm dần", value: "desc" },
            ]}
            onChange={(value) => onOrderChange(value as AdminSortOrder)}
            className="admin-sort-control-input"
          />
        </label>
        <div className="admin-sort-controls-actions">
          <Button type="primary" onClick={onApply}>
            Áp dụng
          </Button>
          <Button onClick={onClear}>Xóa</Button>
        </div>
      </Space>
    </div>
  );
}
