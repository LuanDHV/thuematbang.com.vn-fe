import { Card, Typography } from "antd";

const { Text, Title } = Typography;

export function AdminFormSection(props: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="admin-panel admin-form-section">
      <div className="admin-form-section-header">
        <Title level={4} className="admin-form-section-title">
          {props.title}
        </Title>
        {props.description ? (
          <Text className="admin-form-section-description">
            {props.description}
          </Text>
        ) : null}
      </div>
      {props.children}
    </Card>
  );
}
