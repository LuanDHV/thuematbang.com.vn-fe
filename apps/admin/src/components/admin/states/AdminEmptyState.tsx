import { Empty } from "antd";

export function AdminEmptyState(props: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="admin-state-card">
      <Empty
        description={
          <div>
            <div className="admin-state-title">{props.title ?? "Chưa có dữ liệu"}</div>
            {props.description ? (
              <div className="admin-state-description">{props.description}</div>
            ) : null}
          </div>
        }
      />
    </div>
  );
}
