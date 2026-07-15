import React from "react";
import { useShow } from "@refinedev/core";
import { Card, Descriptions, Image, Typography } from "antd";
import { AdminDetailLayout } from "../../components/admin/page/AdminDetailLayout";
import { AdminFormSection } from "../../components/admin/page/AdminFormSection";
import { StatusBadge } from "../../components/StatusBadge";
import { formatMetaDate } from "../../lib/admin/utils/format";

export const NewsShow: React.FC = () => {
  const { query } = useShow();
  const record = query?.data?.data as Record<string, unknown> | undefined;

  if (!record) return null;

  const categoryName = String(
    (record.category as Record<string, unknown> | undefined)?.name ?? "-"
  );
  const { Title } = Typography;

  return (
    <AdminDetailLayout>
      <Title className="admin-show-heading" level={4}>
        {String(record.title ?? "-")}
      </Title>

      <AdminFormSection
        title="Tổng quan"
        description="Các thông tin điều phối và phân loại nội dung."
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="ID">
            {String(record.id ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Slug">
            {String(record.slug ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            {categoryName}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <StatusBadge status={String(record.status)} type="content" />
          </Descriptions.Item>
          <Descriptions.Item label="Nổi bật">
            {record.isFeatured ? "Có" : "Không"}
          </Descriptions.Item>
          <Descriptions.Item label="Lượt xem">
            {String(record.viewCount ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Tóm tắt">
            {String(record.summary ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatMetaDate(record.createdAt as string | undefined)}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật">
            {formatMetaDate(record.updatedAt as string | undefined)}
          </Descriptions.Item>
        </Descriptions>
      </AdminFormSection>

      {record.imageUrl ? (
        <AdminFormSection
          title="Ảnh thumbnail"
          description="Ảnh đại diện hiển thị cho bài viết."
        >
          <Image
            src={record.imageUrl as string}
            width={240}
            style={{ borderRadius: 16, objectFit: "cover" }}
          />
        </AdminFormSection>
      ) : null}

      {record.content ? (
        <AdminFormSection
          title="Nội dung chi tiết"
          description="Nội dung HTML của bài viết."
        >
          <Card
            bodyStyle={{ padding: 0 }}
            bordered={false}
            className="admin-show-rich-card"
          >
            <div
              className="admin-rich-content"
              dangerouslySetInnerHTML={{ __html: String(record.content) }}
            />
          </Card>
        </AdminFormSection>
      ) : null}

    </AdminDetailLayout>
  );
};
