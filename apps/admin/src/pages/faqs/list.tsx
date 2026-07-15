import React from "react";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  useTable,
} from "@refinedev/antd";
import { Table, Space } from "antd";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";

export const FaqsList: React.FC = () => {
  const { tableProps } = useTable({
    resource: "faqs",
    pagination: {
      mode: "server",
    },
  });

  return (
    <>
      <AdminFilterBar
        actions={<CreateButton type="primary">Thêm FAQ</CreateButton>}
      />

      <AdminDataTable tableProps={tableProps} minWidth={760}>
        <Table.Column title="ID" dataIndex="id" width={70} sorter />
        <Table.Column title="Câu hỏi" dataIndex="question" ellipsis sorter />
        <Table.Column title="Trang" dataIndex="page" width={120} sorter />
        <Table.Column title="Thứ tự" dataIndex="sortOrder" width={90} sorter />
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
