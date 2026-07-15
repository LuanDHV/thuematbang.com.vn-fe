import React from "react";
import { useShow } from "@refinedev/core";
import { Card, Descriptions, Image, Space, Typography } from "antd";

import { PriorityBadge } from "../../components/PriorityBadge";
import { StatusBadge } from "../../components/StatusBadge";
import { AdminDetailLayout } from "../../components/admin/page/AdminDetailLayout";
import { AdminFormSection } from "../../components/admin/page/AdminFormSection";
import {
  formatAdminListingPrice,
  formatLocationParts,
  formatMetaDate,
  formatPriceUnitLabel,
} from "../../lib/admin/utils/format";
import {
  getOptionLabel,
  PUBLISH_SOURCE_OPTIONS,
  PROPERTY_DIRECTION_OPTIONS,
} from "../../lib/admin/constants/options";

const { Title } = Typography;

export const PropertiesShow: React.FC = () => {
  const { query } = useShow();
  const record = query?.data?.data as Record<string, unknown> | undefined;

  if (!record) {
    return null;
  }

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
    amount:
      (record.priceAmount as number | string | null | undefined) ??
      (record.amount as number | string | null | undefined),
    value: record.price as number | string | null | undefined,
    unit: ((record.priceUnit as string | undefined) ??
      (record.unit as string | undefined)) as never,
    negotiable: Boolean(record.isNegotiable),
  });

  return (
    <AdminDetailLayout>
      <Title className="admin-show-heading" level={4}>
        {String(record.title ?? "-")}
      </Title>

      <AdminFormSection
        title="Tổng quan"
        description="Các thông tin chính của tin đăng."
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Trạng thái">
            <StatusBadge status={String(record.status)} type="listing" />
          </Descriptions.Item>
          <Descriptions.Item label="Loại tin đăng">
            <PriorityBadge priority={String(record.priorityStatus)} />
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">{categoryName}</Descriptions.Item>
          <Descriptions.Item label="Nguồn đăng">
            {getOptionLabel(
              PUBLISH_SOURCE_OPTIONS,
              String(record.publishSource ?? null)
            )}
          </Descriptions.Item>
        </Descriptions>

        <Descriptions
          bordered
          column={2}
          size="small"
          style={{ marginTop: 16 }}
        >
          <Descriptions.Item label="Lượt xem">
            {String(record.viewCount ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Yêu thích">
            {String(record.favoriteCount ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Đã ghép">
            {record.isMatched ? "Có" : "Chưa"}
          </Descriptions.Item>
          <Descriptions.Item label="Boost">
            {record.isBoosted
              ? `Có (${String(record.boostCount ?? 0)})`
              : "Không"}
          </Descriptions.Item>
        </Descriptions>
      </AdminFormSection>

      <AdminFormSection
        title="Thuộc tính"
        description="Đặc điểm chính và giá trị vận hành của tin."
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Diện tích">
            {record.area ? `${record.area as number} m²` : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Hướng">
            {getOptionLabel(
              PROPERTY_DIRECTION_OPTIONS,
              String(record.direction ?? null)
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng ngủ">
            {String(record.bedrooms ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng tắm">
            {String(record.bathrooms ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Số tầng">
            {String(record.floors ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Giá">{priceText}</Descriptions.Item>
          <Descriptions.Item label="Đơn vị giá">
            {formatPriceUnitLabel(record.priceUnit as string | undefined)}
          </Descriptions.Item>
          <Descriptions.Item label="Có thể thương lượng">
            {record.isNegotiable ? "Có" : "Không"}
          </Descriptions.Item>
        </Descriptions>
      </AdminFormSection>

      <AdminFormSection
        title="Liên hệ & vị trí"
        description="Người liên hệ, địa chỉ và toạ độ nếu có."
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Người liên hệ">
            {String(record.contactName ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {String(record.contactPhone ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Tỉnh/Thành">
            {locationText}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {String(record.addressDetail ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Kinh độ">
            {String(record.longitude ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Vĩ độ">
            {String(record.latitude ?? "-")}
          </Descriptions.Item>
        </Descriptions>
      </AdminFormSection>

      <AdminFormSection
        title="Thông tin hệ thống"
        description="Các dữ liệu kỹ thuật và thời gian."
      >
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="ID">
            {String(record.id ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Slug">
            {String(record.slug ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatMetaDate(record.createdAt as string | undefined)}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật">
            {formatMetaDate(record.updatedAt as string | undefined)}
          </Descriptions.Item>
        </Descriptions>
      </AdminFormSection>

      {images.length > 0 ? (
        <AdminFormSection
          title="Hình ảnh"
          description="Các ảnh đính kèm của tin đăng."
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
          description="Phần mô tả dài của tin đăng."
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
