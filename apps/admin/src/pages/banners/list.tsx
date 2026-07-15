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

export const BannersList: React.FC = () => {
  const { tableProps } = useTable({
    resource: "banners",
    pagination: {
      mode: "server",
    },
  });

  return (
    <>
      <AdminFilterBar
        actions={<CreateButton type="primary">Thêm banner</CreateButton>}
      />

      <AdminDataTable tableProps={tableProps} minWidth={860}>
        <Table.Column title="Tiêu đề" dataIndex="title" />
        <Table.Column title="Vị trí" dataIndex="position" width={120} />
        <Table.Column title="Trang" dataIndex="page" width={120} />
        <Table.Column title="Thứ tự" dataIndex="sortOrder" width={90} />
        <Table.Column
          title="Hiển thị"
          dataIndex="isActive"
          width={100}
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
