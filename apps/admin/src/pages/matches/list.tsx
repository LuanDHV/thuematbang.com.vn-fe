import React, { useState } from "react";
import { ShowButton, useTable } from "@refinedev/antd";
import { Button, Form, Input, Space, Table, Tag, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";
import { AdminFilterResetButton } from "../../components/admin/page/AdminFilterResetButton";
import {
  buildAdminSearchFilters,
  submitAdminSearch,
} from "../../lib/admin/utils/table";
import { formatMetaDate } from "../../lib/admin/utils/format";
import { axiosInstance } from "../../providers/auth/auth-client";

function approvalTag(status: string) {
  if (status === "PENDING") return <Tag color="gold">Chờ duyệt</Tag>;
  if (status === "APPROVED") return <Tag color="blue">Đã duyệt</Tag>;
  if (status === "REJECTED") return <Tag color="red">Từ chối</Tag>;
  return <Tag>{status}</Tag>;
}

export const MatchesList: React.FC = () => {
  const [loadingKey, setLoadingKey] = useState<string>("");
  const {
    tableProps,
    searchFormProps,
    setCurrentPage,
    setFilters,
    tableQuery,
  } = useTable({
    resource: "listing-matches",
    pagination: {
      mode: "server",
    },
    sorters: {
      mode: "server",
      initial: [{ field: "createdAt", order: "desc" }],
    },
    filters: {
      permanent: [
        { field: "reviewStatus", operator: "eq", value: "PENDING" },
      ],
    },
    onSearch: (values: Record<string, unknown>) =>
      buildAdminSearchFilters(values, ["search"]),
  });

  const refetch = () => tableQuery.refetch();

  const handleApprove = async (id: number) => {
    setLoadingKey(`approve-${id}`);
    try {
      await axiosInstance.post(`/listing-matches/${id}/approve`, {});
      message.success("Đã duyệt đề xuất.");
      await refetch();
    } catch {
      message.error("Không thể duyệt đề xuất.");
    } finally {
      setLoadingKey("");
    }
  };

  const handleReject = async (id: number) => {
    setLoadingKey(`reject-${id}`);
    try {
      await axiosInstance.post(`/listing-matches/${id}/reject-approval`, {});
      message.success("Đã từ chối đề xuất.");
      await refetch();
    } catch {
      message.error("Không thể từ chối đề xuất.");
    } finally {
      setLoadingKey("");
    }
  };

  return (
    <>
      <AdminFilterBar>
        <Form
          {...searchFormProps}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if ("search" in changedValues && !changedValues.search) {
              submitAdminSearch(searchFormProps.form, setCurrentPage);
            }
          }}
        >
          <div className="admin-filter-grid admin-filter-grid--inline">
            <Form.Item name="search" style={{ marginBottom: 0 }}>
              <Input.Search
                placeholder="Tìm tên hồ sơ hoặc mã tin..."
                prefix={<SearchOutlined />}
                onSearch={() =>
                  submitAdminSearch(searchFormProps.form, setCurrentPage)
                }
                style={{ width: 220 }}
              />
            </Form.Item>
            <AdminFilterResetButton
              form={searchFormProps.form}
              fields={["search"]}
              setFilters={setFilters}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </Form>
      </AdminFilterBar>

      <AdminDataTable tableProps={tableProps} minWidth={1080}>
        <Table.Column title="ID" dataIndex="id" width={70} sorter />
        <Table.Column
          title="Hồ sơ"
          width={220}
          render={(_: unknown, record: Record<string, unknown>) => {
            const dealCase = record.dealCase as
              | Record<string, unknown>
              | undefined;
            return (
              <div className="admin-entity-copy">
                <div className="admin-entity-title">
                  {String(dealCase?.fullName ?? "-")}
                </div>
                <span className="admin-entity-subtitle">
                  {String(dealCase?.phone ?? "-")}
                </span>
              </div>
            );
          }}
        />
        <Table.Column
          title="Tin cho thuê"
          width={220}
          render={(_: unknown, record: Record<string, unknown>) => {
            const property = record.property as
              | Record<string, unknown>
              | undefined;
            return (
              <div className="admin-entity-copy">
                <div className="admin-entity-title">
                  {String(property?.title ?? "-")}
                </div>
                <span className="admin-entity-subtitle">
                  {String(property?.displayCode ?? property?.id ?? "-")}
                </span>
              </div>
            );
          }}
        />
        <Table.Column
          title="Tin cần thuê"
          width={220}
          render={(_: unknown, record: Record<string, unknown>) => {
            const rentRequest = record.rentRequest as
              | Record<string, unknown>
              | undefined;
            return (
              <div className="admin-entity-copy">
                <div className="admin-entity-title">
                  {String(rentRequest?.title ?? "-")}
                </div>
                <span className="admin-entity-subtitle">
                  {String(rentRequest?.displayCode ?? rentRequest?.id ?? "-")}
                </span>
              </div>
            );
          }}
        />
        <Table.Column
          title="Nguồn"
          width={140}
          render={(_: unknown, record: Record<string, unknown>) =>
            String(record.sourceType ?? "-") === "USER_SUBMISSION" ? (
              <Tag color="geekblue">User gửi</Tag>
            ) : (
              <Tag color="default">Admin tạo</Tag>
            )
          }
        />
        <Table.Column
          title="Duyệt"
          dataIndex="reviewStatus"
          width={120}
          render={(value: string) => approvalTag(value)}
        />
        <Table.Column
          title="Ngày tạo"
          dataIndex="createdAt"
          width={140}
          render={(value: string) => formatMetaDate(value)}
        />
        <Table.Column
          title="Tác vụ"
          width={200}
          render={(_: unknown, record: Record<string, unknown>) => {
            const id = Number(record.id);
            return (
              <Space size="small">
                <Button
                  type="primary"
                  size="small"
                  loading={loadingKey === `approve-${id}`}
                  onClick={() => {
                    void handleApprove(id);
                  }}
                >
                  Duyệt
                </Button>
                <Button
                  size="small"
                  danger
                  loading={loadingKey === `reject-${id}`}
                  onClick={() => {
                    void handleReject(id);
                  }}
                >
                  Từ chối
                </Button>
                <ShowButton hideText size="small" recordItemId={id} />
              </Space>
            );
          }}
        />
      </AdminDataTable>
    </>
  );
};
