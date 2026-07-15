import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useShow } from "@refinedev/core";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";

import { AdminDetailLayout } from "../../components/admin/page/AdminDetailLayout";
import { AdminFormSection } from "../../components/admin/page/AdminFormSection";
import { AdminErrorState } from "../../components/admin/states/AdminErrorState";
import { AdminLoadingSkeleton } from "../../components/admin/states/AdminLoadingSkeleton";
import { StatusBadge } from "../../components/StatusBadge";
import { axiosInstance } from "../../providers/auth/auth-client";
import { LEAD_STATUS_OPTIONS } from "../../lib/admin/constants/options";
import { formatMetaDate } from "../../lib/admin/utils/format";

const { Text, Title } = Typography;

function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const maybeData = (payload as Record<string, unknown>).data;
    if (Array.isArray(maybeData)) return maybeData as T[];
  }
  return [];
}

export const LeadsShow: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { query } = useShow();
  const record = query?.data?.data as Record<string, unknown> | undefined;
  const [statusForm] = Form.useForm();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm] = Form.useForm();
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [matchUpdating, setMatchUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("NEW");
  const [confirmAction, setConfirmAction] = useState<{
    kind: "unmatch" | "remove";
    matchId: number;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const leadId = record?.id as number | undefined;
  const { data: matchesData, refetch } = useQuery({
    queryKey: ["lead-matches", leadId],
    queryFn: async () => {
      if (!leadId) return [];
      const { data } = await axiosInstance.get(
        `/listing-matches/by-lead/${leadId}`
      );
      return unwrapArray<Record<string, unknown>>(data);
    },
    enabled: Boolean(leadId),
  });

  const matches = matchesData ?? [];

  const linkedSource = useMemo(() => {
    if (record?.propertyId) return "PROPERTY";
    if (record?.rentRequestId) return "RENT_REQUEST";
    return null;
  }, [record?.propertyId, record?.rentRequestId]);

  useEffect(() => {
    const nextStatus = String(record?.status ?? "NEW");
    setCurrentStatus(nextStatus);
    statusForm.setFieldsValue({ status: nextStatus });
  }, [record?.status, statusForm]);

  const activeCandidates = matches.filter((m) => m.status === "CANDIDATE");

  const invalidateAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ["lead-matches", leadId] });
  };

  const syncLeadMatches = (
    updater: (prev: Record<string, unknown>[]) => Record<string, unknown>[]
  ) => {
    queryClient.setQueryData<Record<string, unknown>[]>(
      ["lead-matches", leadId],
      (prev) => updater(prev ?? [])
    );
  };

  if (query?.isLoading) {
    return <AdminLoadingSkeleton rows={4} />;
  }

  if (query?.isError) {
    return (
      <AdminErrorState
        title="Không thể tải chi tiết lead"
        description="Dữ liệu lead không thể được tải tại thời điểm này."
        onRetry={() => {
          void query?.refetch?.();
        }}
      />
    );
  }

  if (!record) {
    return (
      <AdminErrorState
        title="Không tìm thấy lead"
        description="Bản ghi này không còn tồn tại hoặc không thể truy cập."
      />
    );
  }

  const handlePromote = async (
    matchId: number,
    counterpart: Record<string, unknown>
  ) => {
    if (counterpart.isMatched) {
      message.warning("Tin này đã được ghép ở lead khác.");
      return;
    }
    setMatchUpdating(true);
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/promote`, {
        leadId,
      });
      message.success("Đã xác nhận phù hợp.");
      syncLeadMatches((prev) =>
        prev.map((item) =>
          Number(item.id) === matchId
            ? {
                ...item,
                status: "MATCHED",
                matchedAt: item.matchedAt ?? new Date().toISOString(),
              }
            : item
        )
      );
      await invalidateAll();
      await refetch();
    } catch {
      message.error("Không thể xác nhận phù hợp.");
    } finally {
      setMatchUpdating(false);
    }
  };

  const handleReject = async (matchId: number) => {
    setMatchUpdating(true);
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/reject`);
      message.success("Đã từ chối.");
      syncLeadMatches((prev) =>
        prev.map((item) =>
          Number(item.id) === matchId ? { ...item, status: "REJECTED" } : item
        )
      );
      await invalidateAll();
      await refetch();
    } catch {
      message.error("Không thể từ chối.");
    } finally {
      setMatchUpdating(false);
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
        await axiosInstance.post(`/listing-matches/${confirmAction.matchId}/unmatch`);
        message.success("Đã hủy ghép.");
        syncLeadMatches((prev) =>
          prev.map((item) =>
            Number(item.id) === confirmAction.matchId
              ? { ...item, status: "CANDIDATE" }
              : item
          )
        );
      } else {
        await axiosInstance.delete(`/listing-matches/${confirmAction.matchId}`);
        message.success("Đã xóa.");
        syncLeadMatches((prev) =>
          prev.filter((item) => Number(item.id) !== confirmAction.matchId)
        );
      }
      await invalidateAll();
      await refetch();
      setConfirmAction(null);
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

  const handleAddCandidate = async () => {
    try {
      const values = await addForm.validateFields();
      const counterpartId = values.counterpartId
        ? Number(values.counterpartId)
        : null;
      if (!counterpartId || counterpartId <= 0) {
        message.warning("Vui lòng nhập ID hợp lệ.");
        return;
      }

      setAddSubmitting(true);
      await axiosInstance.post("/listing-matches", {
        propertyId:
          linkedSource === "PROPERTY" ? record.propertyId : counterpartId,
        rentRequestId:
          linkedSource === "RENT_REQUEST"
            ? record.rentRequestId
            : counterpartId,
        leadId,
      });
      message.success("Đã thêm đề xuất.");
      setAddDialogOpen(false);
      addForm.resetFields();
      await refetch();
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Không thể thêm đề xuất.");
    } finally {
      setAddSubmitting(false);
    }
  };

  const counterpartLabel =
    linkedSource === "PROPERTY" ? "tin cần thuê" : "tin cho thuê";
  const sourceListingTitle =
    linkedSource === "PROPERTY"
      ? String(
          (record.property as Record<string, unknown> | undefined)?.title ?? "-"
        )
      : String(
          (record.rentRequest as Record<string, unknown> | undefined)?.title ??
            "-"
        );
  const sourceRecord =
    linkedSource === "PROPERTY"
      ? (record.property as Record<string, unknown> | undefined)
      : (record.rentRequest as Record<string, unknown> | undefined);
  const sourcePath =
    linkedSource === "PROPERTY"
      ? `/properties/show/${String(record.propertyId ?? sourceRecord?.id ?? "")}`
      : `/rent-requests/show/${String(record.rentRequestId ?? sourceRecord?.id ?? "")}`;
  const sourceLabel =
    linkedSource === "PROPERTY"
      ? "Tin cho thuê gốc"
      : linkedSource === "RENT_REQUEST"
      ? "Tin cần thuê gốc"
      : "Nguồn gốc";

  return (
    <>
      <AdminDetailLayout>
        <Title className="admin-show-heading" level={4}>
          {String(record.fullName ?? "-")}
        </Title>

        <AdminFormSection
          title="Tổng quan lead"
          description="Thông tin điều phối chính của lead."
        >
          <div className="admin-workflow-summary">
            <div>
              <div className="admin-workflow-title-row">
                <div className="admin-entity-copy">
                  <div className="admin-entity-title">
                    {String(record.fullName ?? "-")}
                  </div>
                  <span className="admin-entity-subtitle">
                    {String(record.phone ?? "-")}
                  </span>
                </div>
                <StatusBadge status={currentStatus} type="lead" />
              </div>
              <div className="admin-workflow-meta">
                <div className="admin-meta-item">
                  <span className="admin-meta-label">ID</span>
                  <span className="admin-meta-value">{String(record.id ?? "-")}</span>
                </div>
                <div className="admin-meta-item">
                  <span className="admin-meta-label">Nguồn</span>
                  <span className="admin-meta-value">
                    {linkedSource === "PROPERTY"
                      ? "Tin cho thuê"
                      : linkedSource === "RENT_REQUEST"
                      ? "Tin cần thuê"
                      : "-"}
                  </span>
                </div>
                <div className="admin-meta-item">
                  <span className="admin-meta-label">Ngày tạo</span>
                  <span className="admin-meta-value">
                    {formatMetaDate(record.createdAt as string | undefined)}
                  </span>
                </div>
                <div className="admin-meta-item">
                  <span className="admin-meta-label">Cập nhật</span>
                  <span className="admin-meta-value">
                    {formatMetaDate(record.updatedAt as string | undefined)}
                  </span>
                </div>
              </div>

              {sourceRecord ? (
                <button
                  type="button"
                  className="admin-link-entity"
                  style={{ width: "100%", marginTop: 14, textAlign: "left" }}
                  onClick={() => navigate(sourcePath)}
                >
                  <div className="admin-entity-copy">
                    <Text type="secondary">{sourceLabel}</Text>
                    <div className="admin-entity-title">
                      {String(sourceRecord.title ?? "-")}
                    </div>
                    <span className="admin-entity-subtitle">
                      {String(sourceRecord.displayCode ?? sourceRecord.slug ?? "-")}
                    </span>
                  </div>
                  <Text type="secondary">Xem</Text>
                </button>
              ) : null}
            </div>

            <div>
              <Text type="secondary">Điều phối</Text>
              <Form
                form={statusForm}
                layout="vertical"
                initialValues={{ status: currentStatus }}
                style={{ marginTop: 8 }}
              >
                <Form.Item label="Đổi trạng thái" name="status" style={{ marginBottom: 0 }}>
                  <Select
                    options={LEAD_STATUS_OPTIONS}
                    loading={matchUpdating}
                    onSelect={(value) => {
                      void (async () => {
                        setMatchUpdating(true);
                        try {
                          if (
                            value === "QUALIFIED" &&
                            activeCandidates.length > 0
                          ) {
                            message.warning(
                              "Lead này đang có đề xuất ghép. Hãy chọn một đề xuất để xác nhận hoặc từ chối chúng trước."
                            );
                            return;
                          }
                          await axiosInstance.patch(`/leads/${leadId}`, {
                            status: value,
                          });
                          setCurrentStatus(String(value));
                          statusForm.setFieldsValue({ status: value });
                          message.success("Đã cập nhật trạng thái lead.");
                          await query?.refetch?.();
                          await invalidateAll();
                        } catch {
                          message.error("Không thể cập nhật trạng thái lead.");
                        } finally {
                          setMatchUpdating(false);
                        }
                      })();
                    }}
                  />
                </Form.Item>
              </Form>
            </div>
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Đề xuất"
          description={
            sourceListingTitle !== "-"
              ? `Danh sách các tin ${counterpartLabel} đang được ghép với lead này.`
              : "Danh sách các đề xuất của lead."
          }
        >
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              type="primary"
              onClick={() => setAddDialogOpen(true)}
            >
              Thêm đề xuất
            </Button>
            <Text type="secondary">{matches.length} đề xuất</Text>
          </div>
          <Table
            dataSource={matches}
            rowKey="id"
            pagination={false}
            scroll={{ x: 960 }}
            size="middle"
          >
            <Table.Column
              title="Tin đối ứng"
              width={320}
              render={(_: unknown, row: Record<string, unknown>) => {
                const counterpart =
                  linkedSource === "PROPERTY" ? row.rentRequest : row.property;
                const c = counterpart as Record<string, unknown> | undefined;
                return (
                  <div className="admin-entity-copy">
                    <div className="admin-entity-title">
                      {String(c?.title ?? "-")}
                    </div>
                    <div className="admin-entity-subtitle">
                      {`ID #${c?.id ?? "-"} · ${String(
                        c?.contactName ?? "-"
                      )} · ${String(c?.contactPhone ?? "-")}`}
                    </div>
                  </div>
                );
              }}
            />
            <Table.Column
              title="Trạng thái"
              dataIndex="status"
              width={130}
              render={(value: string) => (
                <StatusBadge status={value} type="match" />
              )}
            />
            <Table.Column
              title="Khả dụng"
              width={150}
              render={(_: unknown, row: Record<string, unknown>) => {
                const counterpart =
                  linkedSource === "PROPERTY" ? row.rentRequest : row.property;
                const c = counterpart as Record<string, unknown> | undefined;
                return c?.isMatched ? (
                  <span className="admin-warning-badge">Đã ghép nơi khác</span>
                ) : (
                  <Text type="secondary">Sẵn sàng</Text>
                );
              }}
            />
            <Table.Column
              title="Ghép lúc"
              dataIndex="matchedAt"
              width={120}
              render={(v: string | null | undefined) =>
                v ? formatMetaDate(v) : "Chưa xác nhận"
              }
            />
            <Table.Column
              title="Ngày tạo"
              dataIndex="createdAt"
              width={120}
              render={(v: string | null | undefined) =>
                v ? formatMetaDate(v) : "-"
              }
            />
            <Table.Column
              title="Tác vụ"
              width={200}
              render={(_: unknown, row: Record<string, unknown>) => {
                const status = String(row.status ?? "CANDIDATE");
                const matchId = Number(row.id);
                const counterpart =
                  linkedSource === "PROPERTY" ? row.rentRequest : row.property;
                const c = counterpart as Record<string, unknown> | undefined;
                const isMatchedElsewhere = c?.isMatched as boolean | undefined;

                return (
                  <div className="admin-action-group">
                    {status === "CANDIDATE" && (
                      <>
                        <Button
                          type="primary"
                          disabled={!!isMatchedElsewhere}
                          onClick={() => void handlePromote(matchId, c ?? {})}
                        >
                          Phù hợp
                        </Button>
                        <Button
                          onClick={() => void handleReject(matchId)}
                        >
                          Không phù hợp
                        </Button>
                      </>
                    )}
                    {status === "MATCHED" && (
                      <Button
                        onClick={() => handleUnmatch(matchId)}
                      >
                        Hủy ghép
                      </Button>
                    )}
                    {status === "REJECTED" && (
                      <Button
                        danger
                        onClick={() => handleRemove(matchId)}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                );
              }}
            />
          </Table>
        </AdminFormSection>
      </AdminDetailLayout>

      <Modal
        title="Thêm đề xuất"
        open={addDialogOpen}
        forceRender
        onOk={() => {
          void handleAddCandidate();
        }}
        confirmLoading={addSubmitting}
        onCancel={() => {
          setAddDialogOpen(false);
          addForm.resetFields();
        }}
        okText="Thêm"
        cancelText="Huỷ"
      >
        <div style={{ marginBottom: 16, color: "#666", fontSize: 13 }}>
          Nhập ID của tin đối ứng để tạo một đề xuất mới cho lead này.
        </div>
        <Form form={addForm} layout="vertical">
          <Form.Item
            label={`ID ${counterpartLabel}`}
            name="counterpartId"
            rules={[{ required: true, message: "Nhập ID hợp lệ" }]}
          >
            <Input type="number" placeholder="Nhập ID..." />
          </Form.Item>
        </Form>
      </Modal>

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
          ? "Tin cho thuê và tin cần thuê sẽ được bỏ ghép. Lead sẽ quay về trạng thái chờ xử lý."
          : `Đề xuất ID ${confirmAction?.matchId ?? ""} sẽ bị xóa khỏi danh sách. Hành động này không thể hoàn tác.`}
      </Modal>
    </>
  );
};
