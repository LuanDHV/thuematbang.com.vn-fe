import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Table,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ShowButton, useTable } from "@refinedev/antd";

import { AdminDataTable } from "../../components/admin/page/AdminDataTable";
import { AdminFilterBar } from "../../components/admin/page/AdminFilterBar";
import { AdminFilterResetButton } from "../../components/admin/page/AdminFilterResetButton";
import { StatusBadge } from "../../components/StatusBadge";
import {
  buildAdminSearchFilters,
  submitAdminSearch,
} from "../../lib/admin/utils/table";
import { axiosInstance } from "../../providers/auth/auth-client";

export const MatchesList: React.FC = () => {
  const {
    tableProps,
    searchFormProps,
    tableQuery,
    setCurrentPage,
    setFilters,
  } = useTable({
    resource: "listing-matches",
    pagination: {
      mode: "server",
    },
    sorters: {
      mode: "server",
      initial: [{ field: "createdAt", order: "desc" }],
    },
    onSearch: (values: Record<string, unknown>) =>
      buildAdminSearchFilters(values, ["search", "status"]),
  });
  const [loading, setLoading] = useState("");
  const [confirmAction, setConfirmAction] = useState<{
    kind: "unmatch" | "remove";
    matchId: number;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const refetch = () => tableQuery.refetch();

  const handlePromote = async (
    matchId: number,
    leadId: unknown,
    counterpart: Record<string, unknown>
  ) => {
    if (counterpart.isMatched) {
      message.warning("Tin này đã được ghép ở lead khác.");
      return;
    }
    setLoading(`promote-${matchId}`);
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/promote`, {
        leadId,
      });
      message.success("Đã xác nhận phù hợp.");
      refetch();
    } catch {
      message.error("Không thể xác nhận phù hợp.");
    } finally {
      setLoading("");
    }
  };

  const handleReject = async (matchId: number) => {
    setLoading(`reject-${matchId}`);
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/reject`);
      message.success("Đã từ chối.");
      refetch();
    } catch {
      message.error("Không thể từ chối.");
    } finally {
      setLoading("");
    }
  };

  const handleUnmatch = (matchId: number) => {
    setConfirmAction({ kind: "unmatch", matchId });
  };

  const handleRemove = (matchId: number) => {
    setConfirmAction({ kind: "remove", matchId });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    setConfirmLoading(true);
    try {
      if (confirmAction.kind === "unmatch") {
        await axiosInstance.post(
          `/listing-matches/${confirmAction.matchId}/unmatch`
        );
        message.success("Đã hủy ghép.");
      } else {
        await axiosInstance.delete(`/listing-matches/${confirmAction.matchId}`);
        message.success("Đã xóa.");
      }
      setConfirmAction(null);
      await refetch();
    } catch {
      message.error(
        confirmAction.kind === "unmatch"
          ? "Không thể hủy ghép."
          : "Không thể xóa."
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <AdminFilterBar>
        <Form
          {...searchFormProps}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if ("status" in changedValues) {
              submitAdminSearch(searchFormProps.form, setCurrentPage);
            }
            if ("search" in changedValues && !changedValues.search) {
              submitAdminSearch(searchFormProps.form, setCurrentPage);
            }
          }}
        >
          <div className="admin-filter-grid admin-filter-grid--inline">
            <Form.Item name="search" style={{ marginBottom: 0 }}>
              <Input.Search
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined />}
                onSearch={() =>
                  submitAdminSearch(searchFormProps.form, setCurrentPage)
                }
                style={{ width: 180 }}
              />
            </Form.Item>
            <Form.Item name="status" style={{ marginBottom: 0 }}>
              <Select
                placeholder="Trạng thái"
                style={{ width: 180 }}
                options={[
                  { label: "Ứng viên", value: "CANDIDATE" },
                  { label: "Đã ghép", value: "MATCHED" },
                  { label: "Từ chối", value: "REJECTED" },
                ]}
              />
            </Form.Item>
            <AdminFilterResetButton
              form={searchFormProps.form}
              fields={["search", "status"]}
              setFilters={setFilters}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </Form>
      </AdminFilterBar>

      <AdminDataTable tableProps={tableProps} minWidth={1120}>
        <Table.Column title="ID" dataIndex="id" width={70} sorter />
        <Table.Column
          title="Tin cho thuê"
          render={(_: unknown, record: Record<string, unknown>) => {
            const property = record.property as
              | Record<string, unknown>
              | undefined;

            return (
              <div className="admin-entity-copy">
                <div className="admin-entity-title">
                  {(property?.title as string) ?? "-"}
                </div>
                {property?.displayCode || property?.id ? (
                  <span className="admin-entity-subtitle">
                    {String(property.displayCode ?? `ID #${property.id}`)}
                  </span>
                ) : null}
              </div>
            );
          }}
          width={220}
        />
        <Table.Column
          title="Tin cần thuê"
          render={(_: unknown, record: Record<string, unknown>) => {
            const rentRequest = record.rentRequest as
              | Record<string, unknown>
              | undefined;

            return (
              <div className="admin-entity-copy">
                <div className="admin-entity-title">
                  {(rentRequest?.title as string) ?? "-"}
                </div>
                {rentRequest?.displayCode || rentRequest?.id ? (
                  <span className="admin-entity-subtitle">
                    {String(rentRequest.displayCode ?? `ID #${rentRequest.id}`)}
                  </span>
                ) : null}
              </div>
            );
          }}
          width={220}
        />
        <Table.Column
          title="Lead"
          render={(_: unknown, record: Record<string, unknown>) => {
            const lead = record.lead as Record<string, unknown> | undefined;

            return (
              <div className="admin-entity-copy">
                <div className="admin-entity-title">
                  {(lead?.fullName as string) ?? "-"}
                </div>
                <span className="admin-entity-subtitle">
                  {(lead?.phone as string) ?? "-"}
                </span>
              </div>
            );
          }}
          width={160}
        />
        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          width={130}
          sorter
          render={(value: string) => (
            <StatusBadge status={value} type="match" />
          )}
        />
        <Table.Column
          title="Ngày tạo"
          dataIndex="createdAt"
          width={130}
          sorter
          render={(value: string) =>
            value ? new Date(value).toLocaleDateString("vi-VN") : "-"
          }
        />
        <Table.Column
          title="Tác vụ"
          width={340}
          render={(_: unknown, row: Record<string, unknown>) => {
            const status = String(row.status ?? "CANDIDATE");
            const matchId = Number(row.id);
            const leadId = (row.lead as Record<string, unknown> | undefined)
              ?.id;
            const rentReq = row.rentRequest as
              | Record<string, unknown>
              | undefined;
            const prop = row.property as Record<string, unknown> | undefined;
            const counterpartIsMatched =
              Boolean(rentReq?.isMatched) || Boolean(prop?.isMatched);

            return (
              <div className="admin-action-group">
                {status === "CANDIDATE" && counterpartIsMatched ? (
                  <span className="admin-warning-badge">Đã ghép nơi khác</span>
                ) : null}
                {status === "CANDIDATE" ? (
                  <>
                    <Button
                      type="primary"
                      disabled={!!counterpartIsMatched}
                      loading={loading === `promote-${matchId}`}
                      onClick={() => {
                        void handlePromote(matchId, leadId, {
                          isMatched: counterpartIsMatched,
                        });
                      }}
                    >
                      Phù hợp
                    </Button>
                    <Button
                      loading={loading === `reject-${matchId}`}
                      onClick={() => {
                        void handleReject(matchId);
                      }}
                    >
                      Không phù hợp
                    </Button>
                    <Button
                      danger
                      onClick={() => handleRemove(matchId)}
                    >
                      Xóa
                    </Button>
                  </>
                ) : null}
                {status === "MATCHED" ? (
                  <Button onClick={() => handleUnmatch(matchId)}>
                    Hủy ghép
                  </Button>
                ) : null}
                {status === "REJECTED" ? (
                  <Button
                    danger
                    onClick={() => handleRemove(matchId)}
                  >
                    Xóa
                  </Button>
                ) : null}
                <ShowButton hideText size="small" recordItemId={matchId} />
              </div>
            );
          }}
        />
      </AdminDataTable>
      <Modal
        open={!!confirmAction}
        title={
          confirmAction?.kind === "unmatch"
            ? "Hủy ghép đề xuất này?"
            : "Xóa đề xuất này?"
        }
        okText={
          confirmAction?.kind === "unmatch"
            ? "Xác nhận hủy ghép"
            : "Xác nhận xóa"
        }
        okButtonProps={
          confirmAction?.kind === "remove" ? { danger: true } : undefined
        }
        cancelText="Hủy"
        confirmLoading={confirmLoading}
        onOk={() => {
          void handleConfirmAction();
        }}
        onCancel={() => {
          if (!confirmLoading) setConfirmAction(null);
        }}
      >
        {confirmAction?.kind === "unmatch"
          ? "Tin cho thuê và tin cần thuê sẽ được bỏ ghép."
          : `Đề xuất ID ${
              confirmAction?.matchId ?? ""
            } sẽ bị xóa khỏi danh sách. Hành động này không thể hoàn tác.`}
      </Modal>
    </>
  );
};
