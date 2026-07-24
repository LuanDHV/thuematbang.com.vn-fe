import React from "react";
import {
  EditButton,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import { Form, Input, Select, Space, Table } from "antd";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";
import { AdminFilterResetButton } from "../../components/admin/page/AdminFilterResetButton";
import { USER_ROLE_OPTIONS } from "../../lib/admin/constants/options";
import {
  buildAdminSearchFilters,
  submitAdminSearch,
} from "../../lib/admin/utils/table";

const ROLE_TONES: Record<string, string> = {
  ADMIN: "danger",
  AGENT: "info",
  CUSTOMER: "neutral",
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  AGENT: "Môi giới",
  CUSTOMER: "Khách hàng",
};

const AUTH_PROVIDER_TONES: Record<string, string> = {
  GOOGLE: "info",
  LOCAL: "success",
};

const AUTH_PROVIDER_LABELS: Record<string, string> = {
  GOOGLE: "Google",
  LOCAL: "Đăng ký tài khoản",
};

export const UsersList: React.FC = () => {
  const { tableProps, searchFormProps, setCurrentPage, setFilters } = useTable({
    resource: "users",
    pagination: {
      mode: "server",
    },
    sorters: {
      mode: "server",
      initial: [{ field: "createdAt", order: "desc" }],
    },
    onSearch: (values: Record<string, unknown>) =>
      buildAdminSearchFilters(values, ["search", "role"]),
  });

  return (
    <>
      <AdminFilterBar>
        <Form
          {...searchFormProps}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if ("role" in changedValues) {
              submitAdminSearch(searchFormProps.form, setCurrentPage);
            }
            if ("search" in changedValues && !changedValues.search) {
              submitAdminSearch(searchFormProps.form, setCurrentPage);
            }
          }}
        >
          <div className="admin-filter-grid admin-filter-grid--inline">
            <Form.Item name="search" style={{ marginBottom: 0 }}>
              <Input.Search
                placeholder="Tìm tên, email hoặc SĐT..."
                prefix={<SearchOutlined />}
                onSearch={() =>
                  submitAdminSearch(searchFormProps.form, setCurrentPage)
                }
                style={{ width: 180 }}
              />
            </Form.Item>
            <Form.Item name="role" style={{ marginBottom: 0 }}>
              <Select
                options={USER_ROLE_OPTIONS}
                placeholder="Vai trò"
                style={{ width: 180 }}
              />
            </Form.Item>
            <AdminFilterResetButton
              form={searchFormProps.form}
              fields={["search", "role"]}
              setFilters={setFilters}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </Form>
      </AdminFilterBar>

      <AdminDataTable tableProps={tableProps} minWidth={960}>
        <Table.Column title="ID" dataIndex="id" width={70} sorter />

        <Table.Column
          title="Họ tên"
          dataIndex="fullName"
          sorter
          render={(value: string, record: Record<string, unknown>) => (
            <div className="admin-entity-copy">
              <div className="admin-entity-title">{value}</div>
              <span className="admin-entity-subtitle">
                {record.email ? String(record.email) : "-"}
              </span>
            </div>
          )}
          width={260}
        />
        <Table.Column title="SĐT" dataIndex="phone" width={130} sorter />
        <Table.Column
          title="Vai trò"
          dataIndex="role"
          width={120}
          sorter
          render={(value: string) => (
            <span
              className={`admin-status-badge admin-status-badge--${
                ROLE_TONES[value] ?? "neutral"
              }`}
            >
              {ROLE_LABELS[value] ?? value}
            </span>
          )}
        />
        <Table.Column
          title="Nguồn tạo"
          dataIndex="authProvider"
          width={120}
          sorter
          render={(value: string) => (
            <span
              className={`admin-status-badge admin-status-badge--${
                AUTH_PROVIDER_TONES[value] ?? "neutral"
              }`}
            >
              {AUTH_PROVIDER_LABELS[value] ?? value}
            </span>
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
          width={150}
          render={(_: unknown, record: Record<string, unknown>) => (
            <Space size="small">
              <EditButton
                hideText
                size="small"
                recordItemId={record.id as number}
              />
              <ShowButton
                hideText
                size="small"
                recordItemId={record.id as number}
              />
            </Space>
          )}
        />
      </AdminDataTable>
    </>
  );
};
