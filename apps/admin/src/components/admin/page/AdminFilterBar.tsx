import { Card, Space } from "antd";

export function AdminFilterBar(props: {
  children?: React.ReactNode;
  compact?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <Card
      className="admin-filter-bar admin-panel"
      bodyStyle={{
        padding: props.compact ? 12 : 14,
      }}
    >
      <div className="admin-filter-bar__row">
        <div className="admin-filter-bar__content">{props.children}</div>
        {props.actions ? <Space>{props.actions}</Space> : null}
      </div>
    </Card>
  );
}
