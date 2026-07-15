import React from "react";
import { ShowButton, useTable } from "@refinedev/antd";
import { Form, Select, Table } from "antd";
import { useLocation } from "react-router-dom";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";
import { StatusBadge } from "../../components/StatusBadge";
import { PAYMENT_STATUS_OPTIONS } from "../../lib/admin/constants/options";
import {
  buildAdminSearchFilters,
  submitAdminSearch,
} from "../../lib/admin/utils/table";

const PURCHASE_TYPE_LABELS: Record<string, string> = {
  PROPERTY_POST_PACKAGE: "Gói tin",
  PROPERTY_BOOST: "Đẩy tin",
  RENT_REQUEST_EXPRESS: "Express",
};

export const PaymentsList: React.FC = () => {
  const location = useLocation();
  const { tableProps, searchFormProps, setCurrentPage } = useTable({
    resource: "payments",
    pagination: {
      mode: "server",
    },
    sorters: {
      mode: "server",
      initial: [{ field: "createdAt", order: "desc" }],
    },
    onSearch: (values: Record<string, unknown>) =>
      buildAdminSearchFilters(values, ["purchaseType", "status"]),
  });

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    if (!status) return;

    searchFormProps.form?.setFieldsValue({ status });
    submitAdminSearch(searchFormProps.form, setCurrentPage);
  }, [location.search, searchFormProps.form, setCurrentPage]);

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
            <Form.Item name="purchaseType" style={{ marginBottom: 0 }}>
              <Select
                placeholder="Loại"
                options={[
                  { label: "Gói tin cho thuê", value: "PROPERTY_POST_PACKAGE" },
                  { label: "Đẩy tin", value: "PROPERTY_BOOST" },
                  { label: "Express", value: "RENT_REQUEST_EXPRESS" },
                ]}
                style={{ width: 220 }}
              />
            </Form.Item>
            <Form.Item name="status" style={{ marginBottom: 0 }}>
              <Select
                placeholder="Trạng thái"
                options={PAYMENT_STATUS_OPTIONS}
                style={{ width: 160 }}
              />
            </Form.Item>
          </div>
        </Form>
      </AdminFilterBar>

      <AdminDataTable tableProps={tableProps} minWidth={960}>
        <Table.Column title="ID" dataIndex="id" width={70} />
        <Table.Column
          title="Người dùng"
          dataIndex={["user", "fullName"]}
          width={180}
        />
        <Table.Column
          title="Loại"
          dataIndex="purchaseType"
          width={180}
          sorter
          render={(value: string) => PURCHASE_TYPE_LABELS[value] ?? value}
        />
        <Table.Column
          title="Số tiền"
          dataIndex="amount"
          width={150}
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
          render={(value: string) => (
            <StatusBadge status={value} type="payment" />
          )}
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
        <Table.Column
          title="Hành động"
          width={90}
          render={(_: unknown, record: Record<string, unknown>) => (
            <ShowButton
              hideText
              size="small"
              recordItemId={record.id as number}
            />
          )}
        />
      </AdminDataTable>
    </>
  );
};
