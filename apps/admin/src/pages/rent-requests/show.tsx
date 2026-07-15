import React from "react";
import { useShow } from "@refinedev/core";
import { Card, Descriptions, Typography } from "antd";
import { AdminDetailLayout } from "../../components/admin/page/AdminDetailLayout";
import { AdminFormSection } from "../../components/admin/page/AdminFormSection";
import { StatusBadge } from "../../components/StatusBadge";
import {
  formatAdminCurrency,
  formatMetaDate,
  formatPriceUnitLabel,
} from "../../lib/admin/utils/format";
import {
  getOptionLabel,
  PROPERTY_DIRECTION_OPTIONS,
} from "../../lib/admin/constants/options";

const { Paragraph, Text, Title } = Typography;

export const RentRequestsShow: React.FC = () => {
  const { query } = useShow();
  const record = query?.data?.data as Record<string, unknown> | undefined;

  if (!record) {
    return null;
  }

  const requirementText = String(record.requirementText ?? "");

  return (
    <AdminDetailLayout>
      <Title className="admin-show-heading" level={4}>
        {String(record.title ?? record.displayCode ?? "-")}
      </Title>

      <AdminFormSection
        title="Tổng quan"
        description="Các tiêu chí chính của nhu cầu thuê."
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="ID">
            {String(record.id ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Slug">
            {String(record.slug ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <StatusBadge
              status={String(record.status ?? "DRAFT")}
              type="listing"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Express">
            {record.isExpress ? "Có" : "Không"}
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            {String(
              (record.category as Record<string, unknown> | undefined)?.name ??
                "-"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Đã khớp">
            {record.isMatched ? "Có" : "Chưa"}
          </Descriptions.Item>
          <Descriptions.Item label="Người liên hệ">
            {String(record.contactName ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {String(record.contactPhone ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatMetaDate(record.createdAt as string | undefined)}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật">
            {formatMetaDate(record.updatedAt as string | undefined)}
          </Descriptions.Item>
        </Descriptions>
        {record.rejectReason ? (
          <div className="admin-stack" style={{ marginTop: 20 }}>
            <div>
              <Text type="secondary">Lý do từ chối</Text>
              <Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
                {String(record.rejectReason)}
              </Paragraph>
            </div>
          </div>
        ) : null}
      </AdminFormSection>

      <AdminFormSection
        title="Tiêu chí tìm kiếm"
        description="Những thông số cần khớp cho tin thuê."
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Diện tích mong muốn">
            {record.desiredArea ? `${record.desiredArea as number} m²` : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngân sách">
            {formatAdminCurrency(
              record.budgetAmount as number | string | null | undefined
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Đơn vị">
            {formatPriceUnitLabel(record.budgetUnit as string | undefined)}
          </Descriptions.Item>
          <Descriptions.Item label="Số phòng ngủ">
            {String(record.bedrooms ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Số phòng tắm">
            {String(record.bathrooms ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Số tầng">
            {String(record.floors ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Hướng mong muốn">
            {getOptionLabel(
              PROPERTY_DIRECTION_OPTIONS,
              String(record.desiredDirection ?? null)
            )}
          </Descriptions.Item>
        </Descriptions>
      </AdminFormSection>

      <AdminFormSection
        title="Khu vực mong muốn"
        description="Khu vực địa lý mà nhu cầu đang hướng tới."
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Tỉnh/Thành mong muốn">
            {String(
              (
                record.desiredProvince as Record<string, unknown> | undefined
              )?.name ?? "-"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Phường/Xã mong muốn">
            {String(
              (record.desiredWard as Record<string, unknown> | undefined)?.name ??
                "-"
            )}
          </Descriptions.Item>
        </Descriptions>
      </AdminFormSection>

      <AdminFormSection
        title="Mô tả nhu cầu"
        description="Nội dung chi tiết tin cần thuê."
      >
        <Card bodyStyle={{ padding: 0 }} bordered={false}>
          {requirementText ? (
            <div
              className="admin-rich-content"
              dangerouslySetInnerHTML={{ __html: requirementText }}
            />
          ) : (
            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
              Chưa có mô tả chi tiết.
            </Paragraph>
          )}
        </Card>
      </AdminFormSection>

    </AdminDetailLayout>
  );
};
