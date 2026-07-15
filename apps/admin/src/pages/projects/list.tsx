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
  formatAdminListingPrice,
  formatLocationParts,
} from "../../lib/admin/utils/format";
import {
  buildAdminSearchFilters,
  submitAdminSearch,
} from "../../lib/admin/utils/table";
import {
  ADMIN_LISTING_PLACEHOLDER_IMAGE,
  EntityCell,
} from "../../components/EntityCell";

export const ProjectsList: React.FC = () => {
  const { tableProps, searchFormProps, setCurrentPage, setFilters } = useTable({
    resource: "projects",
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
        actions={<CreateButton type="primary">Thêm dự án</CreateButton>}
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
                placeholder="Tìm theo tên hoặc slug..."
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
                options={CONTENT_STATUS_OPTIONS}
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

      <AdminDataTable tableProps={tableProps} minWidth={1020}>
        <Table.Column title="ID" dataIndex="id" width={70} sorter />
        <Table.Column
          title="Tin đăng"
          dataIndex="name"
          sorter
          render={(value: string, record: Record<string, unknown>) => (
            <EntityCell
              imageUrl={
                (record.images as Array<{ imageUrl: string }>)?.[0]?.imageUrl ??
                null
              }
              title={value}
              subtitle={record.displayCode as string | undefined}
              fallbackImageUrl={ADMIN_LISTING_PLACEHOLDER_IMAGE}
            />
          )}
          width={300}
        />
        <Table.Column
          title="Khu vực"
          width={180}
          render={(_: unknown, record: Record<string, unknown>) =>
            formatLocationParts([
              (record.ward as Record<string, unknown> | undefined)?.name as
                | string
                | undefined,
              (record.province as Record<string, unknown> | undefined)?.name as
                | string
                | undefined,
            ])
          }
        />
        <Table.Column title="Chủ đầu tư" dataIndex="developer" width={170} />
        <Table.Column
          title="Giá"
          dataIndex="priceAmount"
          width={160}
          sorter
          render={(_: unknown, record: Record<string, unknown>) =>
            formatAdminListingPrice({
              amount: record.priceAmount as number | string | null | undefined,
              value: record.price as number | string | null | undefined,
              unit: record.priceUnit as string | undefined as never,
              negotiable: Boolean(record.isNegotiable),
            })
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
          width={100}
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
