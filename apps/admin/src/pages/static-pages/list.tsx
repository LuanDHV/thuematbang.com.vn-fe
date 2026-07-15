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

export const StaticPagesList: React.FC = () => {
  const { tableProps } = useTable({
    resource: "static-pages",
    pagination: {
      mode: "server",
    },
  });

  return (
    <>
      <AdminFilterBar
        actions={<CreateButton type="primary">Thêm trang</CreateButton>}
      />

      <AdminDataTable tableProps={tableProps} minWidth={760}>
        <Table.Column title="ID" dataIndex="id" width={70} sorter />
        <Table.Column title="Site Code" dataIndex="siteCode" sorter />
        <Table.Column
          title="Hiển thị"
          dataIndex="isPublished"
          width={100}
          sorter
          render={(value: boolean) => (
            <Switch checked={value} disabled size="small" />
          )}
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
