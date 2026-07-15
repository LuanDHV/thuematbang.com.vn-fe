import React from "react";
import { useTable } from "@refinedev/antd";
import { Form, Select, Table } from "antd";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";
import { StatusBadge } from "../../components/StatusBadge";
import {
  buildAdminSearchFilters,
  submitAdminSearch,
} from "../../lib/admin/utils/table";

export const PackageOrdersList: React.FC = () => {
  const { tableProps, searchFormProps, setCurrentPage } = useTable({
    resource: "property-package-orders",
    pagination: {
      mode: "server",
    },
    sorters: {
      mode: "server",
      initial: [{ field: "createdAt", order: "desc" }],
    },
    onSearch: (values: Record<string, unknown>) =>
      buildAdminSearchFilters(values, ["status"]),
  });

  return (
    <>
      <AdminFilterBar>
        <Form
          {...searchFormProps}
          layout="vertical"
          onValuesChange={() =>
            submitAdminSearch(searchFormProps.form, setCurrentPage)
          }
        >
          <div className="admin-filter-grid admin-filter-grid--inline">
            <Form.Item name="status" style={{ marginBottom: 0 }}>
              <Select
                placeholder="Trạng thái"
                style={{ width: 180 }}
                options={[
                  { label: "Chờ duyệt", value: "PENDING" },
                  { label: "Đang dùng", value: "ACTIVE" },
                  { label: "Hết hạn", value: "EXPIRED" },
                  { label: "Đã hủy", value: "CANCELED" },
                ]}
              />
            </Form.Item>
          </div>
        </Form>
      </AdminFilterBar>

      <AdminDataTable tableProps={tableProps} minWidth={900}>
        <Table.Column title="ID" dataIndex="id" width={70} />
        <Table.Column
          title="Người dùng"
          dataIndex={["user", "fullName"]}
          width={190}
        />
        <Table.Column
          title="Gói"
          dataIndex="priorityStatus"
          width={130}
          sorter
          render={(value: string) =>
            ({
              FREE: "Miễn phí",
              STANDARD: "Thường",
              PREMIUM: "Cao cấp",
            }[value] ?? value)
          }
        />
        <Table.Column title="Tổng tin" dataIndex="totalPosts" width={80} />
        <Table.Column title="Còn" dataIndex="remainingPosts" width={70} />
        <Table.Column
          title="Số tiền"
          dataIndex="amount"
          width={140}
          sorter
          render={(value: number) =>
            value ? `${value.toLocaleString("vi-VN")} ₫` : "-"
          }
        />
        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          width={130}
          sorter
          render={(value: string) => <StatusBadge status={value} />}
        />
        <Table.Column
          title="Ngày tạo"
          dataIndex="createdAt"
          width={130}
          sorter
          render={(value: string) =>
            value ? new Date(value).toLocaleDateString("vi-VN") : "-"
          }
        />
      </AdminDataTable>
    </>
  );
};
