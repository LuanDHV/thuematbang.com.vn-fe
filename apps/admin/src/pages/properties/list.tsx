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
import { useLocation } from "react-router-dom";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";
import { AdminFilterResetButton } from "../../components/admin/page/AdminFilterResetButton";
import {
  ADMIN_LISTING_PLACEHOLDER_IMAGE,
  EntityCell,
} from "../../components/EntityCell";
import { PriorityBadge } from "../../components/PriorityBadge";
import { StatusBadge } from "../../components/StatusBadge";
import {
  LISTING_STATUS_OPTIONS,
  PROPERTY_PRIORITY_OPTIONS,
} from "../../lib/admin/constants/options";
import {
  buildAdminSearchFilters,
  submitAdminSearch,
} from "../../lib/admin/utils/table";
import {
  formatAdminListingPrice,
  formatAreaValue,
  formatLocationParts,
} from "../../lib/admin/utils/format";

export const PropertiesList: React.FC = () => {
  const location = useLocation();
  const { tableProps, searchFormProps, setCurrentPage, setFilters } = useTable({
    resource: "properties",
    pagination: {
      mode: "server",
    },
    sorters: {
      mode: "server",
      initial: [{ field: "createdAt", order: "desc" }],
    },
    onSearch: (values: Record<string, unknown>) =>
      buildAdminSearchFilters(values, ["search", "status", "priorityStatus"]),
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
      <AdminFilterBar
        actions={<CreateButton type="primary">Thêm tin mới</CreateButton>}
      >
        <Form
          {...searchFormProps}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if (
              "status" in changedValues ||
              "priorityStatus" in changedValues
            ) {
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
                placeholder="Tìm theo tiêu đề, mã tin hoặc SĐT..."
                prefix={<SearchOutlined />}
                onSearch={() =>
                  submitAdminSearch(searchFormProps.form, setCurrentPage)
                }
                style={{ width: 180 }}
              />
            </Form.Item>
            <Form.Item name="status" style={{ marginBottom: 0 }}>
              <Select
                options={LISTING_STATUS_OPTIONS}
                placeholder="Trạng thái"
                style={{ width: 180 }}
              />
            </Form.Item>
            <Form.Item name="priorityStatus" style={{ marginBottom: 0 }}>
              <Select
                options={PROPERTY_PRIORITY_OPTIONS}
                placeholder="Ưu tiên"
                style={{ width: 180 }}
              />
            </Form.Item>
            <AdminFilterResetButton
              form={searchFormProps.form}
              fields={["search", "status", "priorityStatus"]}
              setFilters={setFilters}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </Form>
      </AdminFilterBar>

      <AdminDataTable tableProps={tableProps} minWidth={1200}>
        <Table.Column title="ID" dataIndex="id" width={70} sorter />
        <Table.Column
          title="Tin đăng"
          dataIndex="title"
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
          title="Người đăng"
          dataIndex="contactName"
          width={170}
          render={(value: string, record: Record<string, unknown>) => (
            <div>
              <div>{value}</div>
              <div className="admin-inline-muted" style={{ fontSize: 12 }}>
                {record.contactPhone as string}
              </div>
            </div>
          )}
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
        <Table.Column
          title="Diện tích"
          dataIndex="area"
          width={110}
          sorter
          render={(value: number) => formatAreaValue(value)}
        />
        <Table.Column
          title="Giá"
          dataIndex="price"
          width={170}
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
          title="Loại tin"
          dataIndex="priorityStatus"
          width={120}
          render={(value: string) => <PriorityBadge priority={value} />}
        />
        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          width={130}
          render={(value: string) => (
            <StatusBadge status={value} type="listing" />
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
