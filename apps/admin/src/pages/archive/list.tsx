import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Empty, Space, Spin, Table } from "antd";
import { useNavigate } from "react-router-dom";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { axiosInstance } from "../../providers/auth/auth-client";
import { formatMetaDate } from "../../lib/admin/utils/format";
import { ShowButton } from "@refinedev/antd";

type LeadRecord = Record<string, unknown>;

async function fetchArchiveLeads() {
  const requests = [
    axiosInstance.get("/leads", {
      params: { source: "PROPERTY", status: "QUALIFIED", limit: 50 },
    }),
    axiosInstance.get("/leads", {
      params: { source: "PROPERTY", status: "REJECTED", limit: 50 },
    }),
    axiosInstance.get("/leads", {
      params: { source: "RENT_REQUEST", status: "QUALIFIED", limit: 50 },
    }),
    axiosInstance.get("/leads", {
      params: { source: "RENT_REQUEST", status: "REJECTED", limit: 50 },
    }),
  ];

  const results = await Promise.all(requests);
  return results
    .flatMap((result) => {
      const payload = result.data as { data?: LeadRecord[] };
      return payload.data ?? [];
    })
    .sort(
      (left, right) =>
        new Date(String(right.completedAt ?? right.updatedAt ?? 0)).getTime() -
        new Date(String(left.completedAt ?? left.updatedAt ?? 0)).getTime()
    );
}

export const ArchiveList: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ["admin-archive"],
    queryFn: fetchArchiveLeads,
  });

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spin size="large" />
      </div>
    );
  }

  const items = query.data ?? [];

  return (
    <AdminDataTable
      tableProps={{
        dataSource: items,
        pagination: false,
        locale: {
          emptyText: <Empty description="Chưa có hồ sơ lưu trữ" />,
        },
      }}
      minWidth={1080}
    >
      <Table.Column title="ID" dataIndex="id" width={70} />
      <Table.Column
        title="Tên hồ sơ"
        width={240}
        render={(_: unknown, record: LeadRecord) => (
          <div className="admin-entity-copy">
            <div className="admin-entity-title">
              {String(record.fullName ?? "-")}
            </div>
            <span className="admin-entity-subtitle">
              {String(record.phone ?? "-")}
            </span>
          </div>
        )}
      />
      <Table.Column
        title="Kết quả cuối"
        dataIndex="status"
        width={160}
        render={(value: string) => (
          <StatusBadge status={value} kind="deal-case" />
        )}
      />
      <Table.Column
        title="Ngày hoàn tất"
        dataIndex="completedAt"
        width={160}
        render={(value: string) => formatMetaDate(value)}
      />
      <Table.Column
        title="Lý do / đề xuất thắng"
        width={260}
        render={(_: unknown, record: LeadRecord) => {
          const proposalList = (record.proposals ?? []) as LeadRecord[];
          const winningProposalId = Number(record.winningProposalId ?? 0);
          if (record.status === "QUALIFIED") {
            const winningMatch = proposalList.find(
              (item) => Number(item.id) === winningProposalId
            );
            const counterpart = record.propertyId
              ? (winningMatch?.rentRequest as LeadRecord | undefined)
              : (winningMatch?.property as LeadRecord | undefined);

            if (!counterpart) {
              return "Đề xuất thắng";
            }

            return `${String(counterpart.displayCode ?? "-")} · ${String(
              counterpart.title ?? "Đề xuất"
            )}`;
          }

          return String(
            record.closureReasonDetail ?? record.closureReason ?? "-"
          );
        }}
      />
      <Table.Column
        title="Ghi chú"
        dataIndex="closureNote"
        render={(value: string) => String(value ?? "-")}
      />

      <Table.Column
        title="Tác vụ"
        width={100}
        render={(_: unknown, record: Record<string, unknown>) => (
          <Space size="small">
            <ShowButton
              hideText
              size="small"
              recordItemId={record.id as number}
              onClick={() =>
                navigate(
                  record.propertyId
                    ? `/leads/property/show/${record.id}`
                    : `/leads/rent-request/show/${record.id}`
                )
              }
            />
          </Space>
        )}
      />
    </AdminDataTable>
  );
};
