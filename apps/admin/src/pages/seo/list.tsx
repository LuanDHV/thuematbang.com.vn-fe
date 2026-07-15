import React from "react";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  useTable,
} from "@refinedev/antd";
import { Space, Table } from "antd";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";

export const SeoContentsList: React.FC = () => {
  const { tableProps } = useTable({
    resource: "seo-contents",
    pagination: {
      mode: "server",
    },
  });

  return (
    <>
      <AdminFilterBar
        actions={<CreateButton type="primary">Thêm SEO</CreateButton>}
      />

      <AdminDataTable tableProps={tableProps} minWidth={700}>
        <Table.Column title="ID" dataIndex="id" width={70} sorter />
        <Table.Column title="Page" dataIndex="page" sorter />
        <Table.Column
          title="Ngày tạo"
          dataIndex="createdAt"
          width={140}
          sorter
          render={(value: string) =>
            value ? new Date(value).toLocaleDateString("vi-VN") : "-"
          }
        />
        <Table.Column
          title="Cập nhật"
          dataIndex="updatedAt"
          width={140}
          sorter
          render={(value: string) =>
            value ? new Date(value).toLocaleDateString("vi-VN") : "-"
          }
        />
        <Table.Column
          width={120}
          render={(_: unknown, record: Record<string, unknown>) => (
            <Space size="small">
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
