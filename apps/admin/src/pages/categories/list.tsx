import React from "react";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  useTable,
} from "@refinedev/antd";
import { Space, Switch, Table } from "antd";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";

const CATEGORY_LABELS: Record<string, string> = {
  PROPERTY: "Tin cho thuê",
  RENT_REQUEST: "Tin cần thuê",
  PROJECT: "Dự án",
  NEWS: "Tin tức",
};

export const CategoriesList: React.FC = () => {
  const { tableProps } = useTable({
    resource: "categories",
    pagination: {
      mode: "server",
    },
  });

  return (
    <>
      <AdminFilterBar
        actions={<CreateButton type="primary">Thêm danh mục</CreateButton>}
      />

      <AdminDataTable tableProps={tableProps} minWidth={880}>
        <Table.Column title="ID" dataIndex="id" width={70} sorter />
        <Table.Column title="Tên" dataIndex="name" sorter />
        <Table.Column title="Slug" dataIndex="slug" sorter />
        <Table.Column
          title="Loại"
          dataIndex="type"
          width={160}
          sorter
          render={(value: string) => CATEGORY_LABELS[value] ?? value}
        />
        <Table.Column
          title="Hiển thị"
          dataIndex="isActive"
          width={100}
          sorter
          render={(value: boolean) => (
            <Switch checked={value} disabled size="small" />
          )}
        />
        <Table.Column title="Ưu tiên" dataIndex="priority" width={90} sorter />
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
