import React from "react";
import { useShow } from "@refinedev/core";
import {
  Button,
  Descriptions,
  Empty,
  Space,
  Table,
  Tabs,
  Typography,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";

import { AdminDetailLayout } from "../../components/admin/page/AdminDetailLayout";
import { AdminFormSection } from "../../components/admin/page/AdminFormSection";
import {
  ADMIN_LISTING_PLACEHOLDER_IMAGE,
  EntityCell,
} from "../../components/EntityCell";
import { StatusBadge } from "../../components/StatusBadge";
import { axiosInstance } from "../../providers/auth/auth-client";
import {
  formatAreaValue,
  formatLocationParts,
  formatMetaDate,
} from "../../lib/admin/utils/format";

const { Title } = Typography;

const ROLE_TONES: Record<string, string> = {
  ADMIN: "danger",
  AGENT: "info",
  CUSTOMER: "neutral",
};
const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  AGENT: "Môi giới",
  CUSTOMER: "Khách hàng",
};

type ResourceMeta = {
  total: number;
  currentPage: number;
  limit: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type ResourceCollection<T> = {
  data: T[];
  meta: ResourceMeta;
};

type LocationValue = {
  name?: string;
};

type ImageValue = {
  imageUrl?: string | null;
};

type ListingResource = {
  id: number;
  displayCode?: string | null;
  title: string;
  status?: string | null;
  viewCount?: number | null;
  favoriteCount?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  area?: number | null;
  desiredArea?: number | null;
  images?: ImageValue[];
  province?: LocationValue | null;
  ward?: LocationValue | null;
  desiredProvince?: LocationValue | null;
  desiredWard?: LocationValue | null;
};

type FavoriteResource = {
  id: number;
  entityType: "PROPERTY" | "RENT_REQUEST" | "PROJECT";
  entityId: number;
  isActive: boolean;
  favoritedAt?: string | null;
  unfavoritedAt?: string | null;
  entity?: (ListingResource & { name?: string | null }) | null;
};

type LeadResource = {
  id: number;
  fullName: string;
  phone: string;
  status?: string | null;
  propertyId?: number | null;
  rentRequestId?: number | null;
  createdAt?: string | null;
  property?: Pick<ListingResource, "id" | "title" | "displayCode"> | null;
  rentRequest?: Pick<ListingResource, "id" | "title" | "displayCode"> | null;
};

type UserResourcesResponse = {
  counts: {
    properties: number;
    rentRequests: number;
    favorites: number;
    leads: number;
    commerce: number;
  };
  properties: ResourceCollection<ListingResource>;
  rentRequests: ResourceCollection<ListingResource>;
  favorites: ResourceCollection<FavoriteResource>;
  leads: ResourceCollection<LeadResource>;
  commerceSummary: {
    enabled: boolean;
    payments: number;
    propertyPackageOrders: number;
    propertyBoostOrders: number;
    rentRequestExpressOrders: number;
  };
};

const DEFAULT_META: ResourceMeta = {
  total: 0,
  currentPage: 1,
  limit: 5,
  totalPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const FAVORITE_TYPE_LABELS: Record<FavoriteResource["entityType"], string> = {
  PROPERTY: "Tin cho thuê",
  RENT_REQUEST: "Tin cần thuê",
  PROJECT: "Dự án",
};

function getResourcePath(type: FavoriteResource["entityType"], id: number) {
  if (type === "PROPERTY") return `/properties/show/${id}`;
  if (type === "RENT_REQUEST") return `/rent-requests/show/${id}`;
  return `/projects/show/${id}`;
}

function getLeadPath(record: LeadResource) {
  if (record.propertyId) return `/leads/property/show/${record.id}`;
  return `/leads/rent-request/show/${record.id}`;
}

function ViewResourceButton(props: { to: string }) {
  return (
    <Link to={props.to}>
      <Button size="small" icon={<EyeOutlined />} />
    </Link>
  );
}

export const UsersShow: React.FC = () => {
  const { id } = useParams();
  const { query } = useShow();
  const record = query?.data?.data as Record<string, unknown> | undefined;
  const [resources, setResources] =
    React.useState<UserResourcesResponse | null>(null);
  const [resourcesLoading, setResourcesLoading] = React.useState(false);
  const [resourcesError, setResourcesError] = React.useState<string | null>(
    null
  );
  const [resourcePaging, setResourcePaging] = React.useState({
    propertiesPage: 1,
    rentRequestsPage: 1,
    favoritesPage: 1,
    leadsPage: 1,
  });

  React.useEffect(() => {
    if (!id) return;

    let isActive = true;
    setResourcesLoading(true);
    setResourcesError(null);

    axiosInstance
      .get(`/admin/users/${id}/resources`, {
        params: {
          ...resourcePaging,
          propertiesLimit: 5,
          rentRequestsLimit: 5,
          favoritesLimit: 5,
          leadsLimit: 5,
        },
      })
      .then(({ data }) => {
        if (!isActive) return;
        setResources(data as UserResourcesResponse);
      })
      .catch(() => {
        if (!isActive) return;
        setResourcesError("Không thể tải tài nguyên của user.");
      })
      .finally(() => {
        if (!isActive) return;
        setResourcesLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [id, resourcePaging]);

  if (!record) return null;

  const role = String(record.role ?? "CUSTOMER");
  const propertiesMeta = resources?.properties.meta ?? DEFAULT_META;
  const rentRequestsMeta = resources?.rentRequests.meta ?? DEFAULT_META;
  const favoritesMeta = resources?.favorites.meta ?? DEFAULT_META;
  const leadsMeta = resources?.leads.meta ?? DEFAULT_META;

  return (
    <AdminDetailLayout>
      <Title className="admin-show-heading" level={4}>
        {String(record.fullName ?? "-")}
      </Title>

      <AdminFormSection
        title="Tổng quan"
        description="Thông tin tài khoản và liên hệ chính."
      >
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="ID">
            {String(record.id ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {String(record.email ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="SĐT">
            {String(record.phone ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Nhà cung cấp">
            {String(record.authProvider ?? "-")}
          </Descriptions.Item>
          <Descriptions.Item label="Có mật khẩu">
            {record.hasPassword ? "Có" : "Không"}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <span
              className={`admin-status-badge admin-status-badge--${
                ROLE_TONES[role] ?? "neutral"
              }`}
            >
              {ROLE_LABELS[role] ?? role}
            </span>
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
        title="Tài nguyên của user"
        description="Các tin đăng, tin cần thuê, lượt quan tâm và lead liên quan đến tài khoản này."
      >
        {resourcesError ? (
          <Empty description={resourcesError} />
        ) : (
          <Tabs
            className="admin-user-resources-tabs"
            items={[
              {
                key: "properties",
                label: `Tin cho thuê (${resources?.counts.properties ?? 0})`,
                children: (
                  <Table
                    rowKey="id"
                    size="small"
                    loading={resourcesLoading}
                    dataSource={resources?.properties.data ?? []}
                    pagination={{
                      current: propertiesMeta.currentPage,
                      pageSize: propertiesMeta.limit,
                      total: propertiesMeta.total,
                      showSizeChanger: false,
                      onChange: (page) =>
                        setResourcePaging((current) => ({
                          ...current,
                          propertiesPage: page,
                        })),
                    }}
                    scroll={{ x: 820 }}
                  >
                    <Table.Column
                      title="Tin"
                      width={280}
                      render={(_: unknown, item: ListingResource) => (
                        <EntityCell
                          imageUrl={item.images?.[0]?.imageUrl ?? null}
                          title={item.title}
                          subtitle={item.displayCode ?? undefined}
                          fallbackImageUrl={ADMIN_LISTING_PLACEHOLDER_IMAGE}
                        />
                      )}
                    />
                    <Table.Column
                      title="Khu vực"
                      width={170}
                      render={(_: unknown, item: ListingResource) =>
                        formatLocationParts([
                          item.ward?.name,
                          item.province?.name,
                        ])
                      }
                    />
                    <Table.Column
                      title="Diện tích"
                      dataIndex="area"
                      width={110}
                      render={(value: number) => formatAreaValue(value)}
                    />
                    <Table.Column
                      title="Trạng thái"
                      dataIndex="status"
                      width={130}
                      render={(value: string) => (
                        <StatusBadge status={value} type="listing" />
                      )}
                    />
                    <Table.Column title="Xem" dataIndex="viewCount" width={80} />
                    <Table.Column
                      title="Quan tâm"
                      dataIndex="favoriteCount"
                      width={100}
                    />
                    <Table.Column
                      title="Ngày tạo"
                      dataIndex="createdAt"
                      width={120}
                      render={(value: string) => formatMetaDate(value)}
                    />
                    <Table.Column
                      title=""
                      width={70}
                      render={(_: unknown, item: ListingResource) => (
                        <ViewResourceButton to={`/properties/show/${item.id}`} />
                      )}
                    />
                  </Table>
                ),
              },
              {
                key: "rentRequests",
                label: `Tin cần thuê (${resources?.counts.rentRequests ?? 0})`,
                children: (
                  <Table
                    rowKey="id"
                    size="small"
                    loading={resourcesLoading}
                    dataSource={resources?.rentRequests.data ?? []}
                    pagination={{
                      current: rentRequestsMeta.currentPage,
                      pageSize: rentRequestsMeta.limit,
                      total: rentRequestsMeta.total,
                      showSizeChanger: false,
                      onChange: (page) =>
                        setResourcePaging((current) => ({
                          ...current,
                          rentRequestsPage: page,
                        })),
                    }}
                    scroll={{ x: 780 }}
                  >
                    <Table.Column
                      title="Tin"
                      dataIndex="title"
                      width={260}
                      render={(value: string, item: ListingResource) => (
                        <EntityCell
                          title={value}
                          subtitle={item.displayCode ?? undefined}
                          fallbackImageUrl={ADMIN_LISTING_PLACEHOLDER_IMAGE}
                        />
                      )}
                    />
                    <Table.Column
                      title="Khu vực"
                      width={170}
                      render={(_: unknown, item: ListingResource) =>
                        formatLocationParts([
                          item.desiredWard?.name,
                          item.desiredProvince?.name,
                        ])
                      }
                    />
                    <Table.Column
                      title="Diện tích"
                      dataIndex="desiredArea"
                      width={110}
                      render={(value: number) => formatAreaValue(value)}
                    />
                    <Table.Column
                      title="Trạng thái"
                      dataIndex="status"
                      width={130}
                      render={(value: string) => (
                        <StatusBadge status={value} type="listing" />
                      )}
                    />
                    <Table.Column title="Xem" dataIndex="viewCount" width={80} />
                    <Table.Column
                      title="Quan tâm"
                      dataIndex="favoriteCount"
                      width={100}
                    />
                    <Table.Column
                      title="Ngày tạo"
                      dataIndex="createdAt"
                      width={120}
                      render={(value: string) => formatMetaDate(value)}
                    />
                    <Table.Column
                      title=""
                      width={70}
                      render={(_: unknown, item: ListingResource) => (
                        <ViewResourceButton
                          to={`/rent-requests/show/${item.id}`}
                        />
                      )}
                    />
                  </Table>
                ),
              },
              {
                key: "favorites",
                label: `Đã quan tâm (${resources?.counts.favorites ?? 0})`,
                children: (
                  <Table
                    rowKey="id"
                    size="small"
                    loading={resourcesLoading}
                    dataSource={resources?.favorites.data ?? []}
                    pagination={{
                      current: favoritesMeta.currentPage,
                      pageSize: favoritesMeta.limit,
                      total: favoritesMeta.total,
                      showSizeChanger: false,
                      onChange: (page) =>
                        setResourcePaging((current) => ({
                          ...current,
                          favoritesPage: page,
                        })),
                    }}
                    scroll={{ x: 860 }}
                  >
                    <Table.Column
                      title="Loại"
                      dataIndex="entityType"
                      width={130}
                      render={(value: FavoriteResource["entityType"]) =>
                        FAVORITE_TYPE_LABELS[value] ?? value
                      }
                    />
                    <Table.Column
                      title="Tin"
                      width={280}
                      render={(_: unknown, item: FavoriteResource) => {
                        const entity = item.entity;
                        const title = entity?.title ?? entity?.name ?? "-";
                        return (
                          <EntityCell
                            imageUrl={entity?.images?.[0]?.imageUrl ?? null}
                            title={title}
                            subtitle={entity?.displayCode ?? undefined}
                            fallbackImageUrl={ADMIN_LISTING_PLACEHOLDER_IMAGE}
                          />
                        );
                      }}
                    />
                    <Table.Column
                      title="Trạng thái quan tâm"
                      dataIndex="isActive"
                      width={150}
                      render={(value: boolean) => (
                        <span
                          className={`admin-status-badge admin-status-badge--${
                            value ? "success" : "neutral"
                          }`}
                        >
                          {value ? "Đang quan tâm" : "Đã bỏ"}
                        </span>
                      )}
                    />
                    <Table.Column
                      title="Ngày quan tâm"
                      dataIndex="favoritedAt"
                      width={130}
                      render={(value: string) => formatMetaDate(value)}
                    />
                    <Table.Column
                      title="Ngày bỏ"
                      dataIndex="unfavoritedAt"
                      width={130}
                      render={(value: string) => formatMetaDate(value)}
                    />
                    <Table.Column
                      title=""
                      width={70}
                      render={(_: unknown, item: FavoriteResource) => (
                        <ViewResourceButton
                          to={getResourcePath(item.entityType, item.entityId)}
                        />
                      )}
                    />
                  </Table>
                ),
              },
              {
                key: "leads",
                label: `Lead (${resources?.counts.leads ?? 0})`,
                children: (
                  <Table
                    rowKey="id"
                    size="small"
                    loading={resourcesLoading}
                    dataSource={resources?.leads.data ?? []}
                    pagination={{
                      current: leadsMeta.currentPage,
                      pageSize: leadsMeta.limit,
                      total: leadsMeta.total,
                      showSizeChanger: false,
                      onChange: (page) =>
                        setResourcePaging((current) => ({
                          ...current,
                          leadsPage: page,
                        })),
                    }}
                    scroll={{ x: 760 }}
                  >
                    <Table.Column
                      title="Khách"
                      width={210}
                      render={(_: unknown, item: LeadResource) => (
                        <div className="admin-entity-copy">
                          <div className="admin-entity-title">
                            {item.fullName}
                          </div>
                          <span className="admin-entity-subtitle">
                            {item.phone}
                          </span>
                        </div>
                      )}
                    />
                    <Table.Column
                      title="Nguồn"
                      width={130}
                      render={(_: unknown, item: LeadResource) =>
                        item.propertyId ? "Lead cho thuê" : "Lead cần thuê"
                      }
                    />
                    <Table.Column
                      title="Tin liên quan"
                      width={250}
                      render={(_: unknown, item: LeadResource) => {
                        const listing = item.property ?? item.rentRequest;
                        return listing ? (
                          <div className="admin-entity-copy">
                            <div className="admin-entity-title">
                              {listing.title}
                            </div>
                            <span className="admin-entity-subtitle">
                              {listing.displayCode ?? "-"}
                            </span>
                          </div>
                        ) : (
                          "-"
                        );
                      }}
                    />
                    <Table.Column
                      title="Trạng thái"
                      dataIndex="status"
                      width={130}
                      render={(value: string) => (
                        <StatusBadge status={value} type="lead" />
                      )}
                    />
                    <Table.Column
                      title="Ngày tạo"
                      dataIndex="createdAt"
                      width={130}
                      render={(value: string) => formatMetaDate(value)}
                    />
                    <Table.Column
                      title=""
                      width={70}
                      render={(_: unknown, item: LeadResource) => (
                        <ViewResourceButton to={getLeadPath(item)} />
                      )}
                    />
                  </Table>
                ),
              },
            ]}
          />
        )}
        {resources?.commerceSummary.enabled ? (
          <Space className="admin-user-commerce-summary" wrap>
            <span>Thanh toán: {resources.commerceSummary.payments}</span>
            <span>Gói tin: {resources.commerceSummary.propertyPackageOrders}</span>
            <span>Đẩy tin: {resources.commerceSummary.propertyBoostOrders}</span>
            <span>
              Express: {resources.commerceSummary.rentRequestExpressOrders}
            </span>
          </Space>
        ) : null}
      </AdminFormSection>

    </AdminDetailLayout>
  );
};
