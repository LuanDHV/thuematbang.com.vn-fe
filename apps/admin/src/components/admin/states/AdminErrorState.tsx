import { Alert, Button, Space } from "antd";

export function AdminErrorState(props: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="admin-state-card">
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Alert
          type="error"
          showIcon
          message={props.title ?? "Không thể tải dữ liệu"}
          description={props.description ?? "Vui lòng thử lại sau."}
        />
        {props.onRetry ? (
          <Button onClick={props.onRetry}>Thử lại</Button>
        ) : null}
      </Space>
    </div>
  );
}
