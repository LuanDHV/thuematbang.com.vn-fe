import { Card, Table } from "antd";
import type { TableProps } from "antd";

type Props = {
  children: React.ReactNode;
  tableProps: TableProps<object>;
  rowKey?: string;
  minWidth?: number;
};

export function AdminDataTable({
  children,
  tableProps,
  rowKey = "id",
  minWidth = 960,
}: Props) {
  return (
    <Card className="admin-panel admin-table-panel" bodyStyle={{ padding: 0 }}>
      <Table
        {...tableProps}
        className="admin-data-table"
        rowKey={rowKey}
        size={tableProps.size ?? "middle"}
        scroll={{ x: minWidth }}
        pagination={{
          ...(tableProps.pagination as object),
          showSizeChanger: true,
          showTotal: (total: number) => `${total} kết quả`,
        }}
      >
        {children}
      </Table>
    </Card>
  );
}
