import { Card, Skeleton, Space } from "antd";

export function AdminLoadingSkeleton(props: { rows?: number }) {
  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Card className="admin-panel">
        <Skeleton active title paragraph={{ rows: 2 }} />
      </Card>
      <Card className="admin-panel">
        <Skeleton active title={false} paragraph={{ rows: props.rows ?? 6 }} />
      </Card>
    </Space>
  );
}
