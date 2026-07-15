import React from "react";
import { DeleteButton, ShowButton, useTable } from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import { Form, Input, Select, Space, Table } from "antd";
import { useLocation } from "react-router-dom";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";
import { AdminFilterResetButton } from "../../components/admin/page/AdminFilterResetButton";
import { LEAD_STATUS_OPTIONS } from "../../lib/admin/constants/options";
import { StatusBadge } from "../../components/StatusBadge";
import { formatMetaDate } from "../../lib/admin/utils/format";
import {
  buildAdminSearchFilters,
  submitAdminSearch,
} from "../../lib/admin/utils/table";

export const LeadsPropertyList: React.FC = () => {
  const location = useLocation();
  const { tableProps, searchFormProps, setCurrentPage, setFilters } = useTable({
    resource: "leads-property",
    pagination: {
      mode: "server",
    },
    sorters: {
      mode: "server",
      initial: [{ field: "createdAt", order: "desc" }],
    },
    filters: {
      permanent: [{ field: "source", operator: "eq", value: "PROPERTY" }],
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
                options={LEAD_STATUS_OPTIONS}
                placeholder="Trạng thái"
                style={{ width: 180 }}
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

      <AdminDataTable minWidth={1020} tableProps={tableProps}>
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
          title="Tin cho thuê"
          render={(_: unknown, record: Record<string, unknown>) => {
            const property = record.property as
              | Record<string, unknown>
              | undefined;

            return (
              <div className="admin-entity-copy">
                <div className="admin-entity-title">
                  {(property?.title as string) ?? "-"}
                </div>
                <span className="admin-entity-subtitle">
                  {(property?.displayCode as string) ?? "-"}
                </span>
              </div>
            );
          }}
          width={240}
        />
        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          sorter
          render={(value: string) => <StatusBadge status={value} type="lead" />}
          width={140}
        />
        <Table.Column
          title="Ngày tạo"
          dataIndex="createdAt"
          sorter
          render={(value: string) => formatMetaDate(value)}
          width={140}
        />
        <Table.Column
          title="Tác vụ"
          width={160}
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
