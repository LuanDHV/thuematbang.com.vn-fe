import { Avatar, Space, Typography } from "antd";
import {
  FileTextOutlined,
  HomeOutlined,
  PictureOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export const ADMIN_LISTING_PLACEHOLDER_IMAGE =
  "https://burst.shopifycdn.com/photos/downtown-toronto.jpg?width=100&format=pjpg&exif=0&iptc=0";

export function AdminEntityCell(props: {
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  fallbackImageUrl?: string | null;
  icon?: React.ReactNode;
}) {
  const { title, subtitle, imageUrl, fallbackImageUrl, icon } = props;
  const resolvedImageUrl = imageUrl || fallbackImageUrl || undefined;

  return (
    <Space size={12} align="center">
      <Avatar
        shape="square"
        size={48}
        src={resolvedImageUrl}
        icon={
          icon ?? (resolvedImageUrl ? <PictureOutlined /> : <HomeOutlined />)
        }
        className="admin-entity-avatar"
      />
      <div className="admin-entity-copy">
        <div className="admin-entity-title">{title}</div>
        {subtitle ? (
          <Text type="secondary" className="admin-entity-subtitle">
            {subtitle}
          </Text>
        ) : null}
      </div>
    </Space>
  );
}

export function AdminUserCell(props: {
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
}) {
  return (
    <AdminEntityCell
      title={props.name}
      subtitle={props.email}
      imageUrl={props.avatarUrl}
      icon={<UserOutlined />}
    />
  );
}

export function AdminDocumentCell(props: {
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  fallbackImageUrl?: string | null;
}) {
  return (
    <AdminEntityCell
      title={props.title}
      subtitle={props.subtitle}
      imageUrl={props.imageUrl}
      fallbackImageUrl={props.fallbackImageUrl}
      icon={<FileTextOutlined />}
    />
  );
}
