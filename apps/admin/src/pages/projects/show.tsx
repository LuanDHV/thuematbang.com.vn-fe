import React from "react";
import { useShow } from "@refinedev/core";
import { Card, Descriptions, Image, Space, Typography } from "antd";

import { StatusBadge } from "../../components/StatusBadge";
import { AdminDetailLayout } from "../../components/admin/page/AdminDetailLayout";
import { AdminFormSection } from "../../components/admin/page/AdminFormSection";
import {
  formatAdminListingPrice,
  formatLocationParts,
  formatMetaDate,
  formatPriceUnitLabel,
} from "../../lib/admin/utils/format";

export const ProjectsShow: React.FC = () => {
  const { query } = useShow();
  const record = query?.data?.data as Record<string, unknown> | undefined;

  if (!record) return null;

  const images =
    (record.images as Array<{ id: number; imageUrl: string }>) ?? [];
  const categoryName = String(
    (record.category as Record<string, unknown> | undefined)?.name ?? "-"
  );
  const locationText = formatLocationParts([
    (record.ward as Record<string, unknown> | undefined)?.name as
      | string
      | undefined,
    (record.province as Record<string, unknown> | undefined)?.name as
      | string
      | undefined,
  ]);
  const priceText = formatAdminListingPrice({
    amount: record.priceAmount as number | string | null | undefined,
    unit: record.priceUnit as string | undefined as never,
    negotiable: Boolean(record.isNegotiable),
  });
  const { Title } = Typography;

  return (
    <AdminDetailLayout>
      <Title className="admin-show-heading" level={4}>
        {String(record.name ?? "-")}
      </Title>

      <AdminFormSection
        title="Tổng quan"
        description="Thông tin chính của dự án."
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="ID">
            {String(record.id ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Mã dự án">
            {String(record.displayCode ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Slug">
            {String(record.slug ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <StatusBadge status={String(record.status)} type="content" />
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            {categoryName}
          </Descriptions.Item>
          <Descriptions.Item label="Chủ đầu tư">
            {String(record.developer ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Đơn vị giá">
            {formatPriceUnitLabel(record.priceUnit as string | undefined)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatMetaDate(record.createdAt as string | undefined)}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật">
            {formatMetaDate(record.updatedAt as string | undefined)}
          </Descriptions.Item>
        </Descriptions>
      </AdminFormSection>

      <AdminFormSection
        title="Thông số & vị trí"
        description="Các thông số vận hành và vị trí địa lý."
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Diện tích">
            {record.area ? `${record.area as number} m²` : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Giá">{priceText}</Descriptions.Item>
          <Descriptions.Item label="Tỉnh/Thành">
            {locationText}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {String(record.addressDetail ?? "-")}
          </Descriptions.Item>
        </Descriptions>
      </AdminFormSection>

      {images.length > 0 ? (
        <AdminFormSection
          title="Hình ảnh"
          description="Các ảnh minh hoạ của dự án."
        >
          <Image.PreviewGroup>
            <Space size={[16, 16]} wrap>
              {images.map((image) => (
                <Image
                  key={image.id}
                  src={image.imageUrl}
                  width={120}
                  height={120}
                  style={{ borderRadius: 16, objectFit: "cover" }}
                />
              ))}
            </Space>
          </Image.PreviewGroup>
        </AdminFormSection>
      ) : null}

      {record.content ? (
        <AdminFormSection
          title="Nội dung chi tiết"
          description="Phần mô tả dài của dự án."
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
