import React from "react";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import { Form, Input, Select, Space, Table } from "antd";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";
import { AdminFilterResetButton } from "../../components/admin/page/AdminFilterResetButton";
import { StatusBadge } from "../../components/StatusBadge";
import { CONTENT_STATUS_OPTIONS } from "../../lib/admin/constants/options";
import {
  buildAdminSearchFilters,
  submitAdminSearch,
} from "../../lib/admin/utils/table";
import { EntityCell } from "../../components/EntityCell";

export const NewsList: React.FC = () => {
  const { tableProps, searchFormProps, setCurrentPage, setFilters } = useTable({
    resource: "news",
    pagination: {
      mode: "server",
    },
    sorters: {
      mode: "server",
      initial: [{ field: "createdAt", order: "desc" }],
    },
    onSearch: (values: Record<string, unknown>) =>
      buildAdminSearchFilters(values, ["search", "status"]),
  });

  return (
    <>
      <AdminFilterBar
        actions={<CreateButton type="primary">Thêm tin</CreateButton>}
      >
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
                placeholder="Tìm theo tiêu đề hoặc slug..."
                prefix={<SearchOutlined />}
                onSearch={() =>
                  submitAdminSearch(searchFormProps.form, setCurrentPage)
                }
                style={{ width: 180 }}
              />
            </Form.Item>
            <Form.Item name="status" style={{ marginBottom: 0 }}>
              <Select
                options={CONTENT_STATUS_OPTIONS}
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

      <AdminDataTable tableProps={tableProps} minWidth={1120}>
        <Table.Column title="ID" dataIndex="id" width={70} sorter />
        <Table.Column
          title="Tiêu đề"
          dataIndex="title"
          sorter
          render={(value: string, record: Record<string, unknown>) => (
            <EntityCell
              imageUrl={
                (record.images as Array<{ imageUrl: string }>)?.[0]?.imageUrl ??
                null
              }
              title={value}
            />
          )}
          width={260}
        />
        <Table.Column
          title="Danh mục"
          dataIndex={["category", "name"]}
          width={150}
        />
        <Table.Column
          title="Nổi bật"
          dataIndex="isFeatured"
          width={100}
          sorter
          render={(value: boolean) =>
            value ? (
              <span className="admin-status-badge admin-status-badge--premium">
                Nổi bật
              </span>
            ) : (
              "—"
            )
          }
        />
        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          width={130}
          render={(value: string) => (
            <StatusBadge status={value} type="content" />
          )}
        />
        <Table.Column
          title="Lượt xem"
          dataIndex="viewCount"
          width={90}
          sorter
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
              <ShowButton
                hideText
                size="small"
                recordItemId={record.id as number}
              />
              <EditButton
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
