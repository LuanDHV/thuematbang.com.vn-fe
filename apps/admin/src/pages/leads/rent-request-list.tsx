import React from "react";
import { DeleteButton, ShowButton, useTable } from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import { Form, Input, Select, Space, Table } from "antd";
import { useLocation } from "react-router-dom";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";
import { AdminFilterResetButton } from "../../components/admin/page/AdminFilterResetButton";
import { StatusBadge } from "../../components/StatusBadge";
import { LEAD_STATUS_OPTIONS } from "../../lib/admin/constants/options";
import {
  buildAdminSearchFilters,
  submitAdminSearch,
} from "../../lib/admin/utils/table";

export const LeadsRentRequestList: React.FC = () => {
  const location = useLocation();
  const { tableProps, searchFormProps, setCurrentPage, setFilters } = useTable({
    resource: "leads",
    pagination: {
      mode: "server",
    },
    sorters: {
      mode: "server",
      initial: [{ field: "createdAt", order: "desc" }],
    },
    filters: {
      permanent: [{ field: "source", operator: "eq", value: "RENT_REQUEST" }],
    },
    onSearch: (values: Record<string, unknown>) =>
      buildAdminSearchFilters(values, ["search", "status"]),
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
          onValuesChange={(changedValues) => {
            if ("status" in changedValues) {
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
                placeholder="Tìm tên hoặc SĐT..."
                prefix={<SearchOutlined />}
                onSearch={() =>
                  submitAdminSearch(searchFormProps.form, setCurrentPage)
                }
                style={{ width: 180 }}
              />
            </Form.Item>
            <Form.Item name="status" style={{ marginBottom: 0 }}>
              <Select
                placeholder="Trạng thái"
                style={{ width: 180 }}
                options={LEAD_STATUS_OPTIONS}
              />
            </Form.Item>
            <AdminFilterResetButton
              form={searchFormProps.form}
              fields={["search", "status"]}
              setFilters={setFilters}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </Form>
      </AdminFilterBar>

      <AdminDataTable tableProps={tableProps} minWidth={820}>
        <Table.Column title="ID" dataIndex="id" width={70} sorter />
        <Table.Column
          title="Lead"
          render={(_: unknown, record: Record<string, unknown>) => {
            const fullName = String(record.fullName ?? "-");
            const phone = String(record.phone ?? "-");

            return (
              <div className="admin-entity-copy">
                <div className="admin-entity-title">{fullName}</div>
                <span className="admin-entity-subtitle">{phone}</span>
              </div>
            );
          }}
          width={260}
        />
        <Table.Column
          title="Tin cần thuê"
          render={(_: unknown, record: Record<string, unknown>) => {
            const rentRequest = record.rentRequest as
              | Record<string, unknown>
              | undefined;

            const title = (rentRequest?.title as string) ?? "-";
            const subtitle = (rentRequest?.displayCode as string) ?? "-";

            return (
              <div className="admin-entity-copy">
                <div className="admin-entity-title">{title}</div>
                <span className="admin-entity-subtitle">{subtitle}</span>
              </div>
            );
          }}
          width={240}
        />
        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          width={140}
          sorter
          render={(value: string) => <StatusBadge status={value} type="lead" />}
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
          width={120}
          render={(_: unknown, record: Record<string, unknown>) => (
            <Space size="small">
              <ShowButton
                hideText
                size="small"
                recordItemId={record.id as number}
              />
              <DeleteButton
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
