import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useShow } from "@refinedev/core";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Tag,
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
import {
  DEAL_CASE_STATUS_OPTIONS,
  PROPOSAL_STATUS_OPTIONS,
} from "../../lib/admin/constants/options";
import { formatMetaDate } from "../../lib/admin/utils/format";

const { Text, Title } = Typography;

function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const maybeItems = (payload as Record<string, unknown>).items;
    if (Array.isArray(maybeItems)) return maybeItems as T[];
    const maybeData = (payload as Record<string, unknown>).data;
    if (Array.isArray(maybeData)) return maybeData as T[];
    if (maybeData && typeof maybeData === "object") {
      const nestedItems = (maybeData as Record<string, unknown>).items;
      if (Array.isArray(nestedItems)) return nestedItems as T[];
      const nestedData = (maybeData as Record<string, unknown>).data;
      if (Array.isArray(nestedData)) return nestedData as T[];
    }
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
  const [counterpartOptions, setCounterpartOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [counterpartSearching, setCounterpartSearching] = useState(false);
  const [matchUpdating, setMatchUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("NEW");
  const [confirmAction, setConfirmAction] = useState<{
    kind: "unmatch" | "remove";
    matchId: number;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [closeDialogMode, setCloseDialogMode] = useState<"won" | "lost" | null>(
    null
  );
  const [closeForm] = Form.useForm();

  const dealCaseId = record?.id as number | undefined;
  const { data: matchesData, refetch } = useQuery({
    queryKey: ["deal-case-proposals", dealCaseId],
    queryFn: async () => {
      if (!dealCaseId) return [];
      const { data } = await axiosInstance.get(
        `/listing-matches/by-lead/${dealCaseId}`
      );
      return unwrapArray<Record<string, unknown>>(data);
    },
    enabled: Boolean(dealCaseId),
  });

  const matches = matchesData ?? [];
  const isLeadClosed =
    currentStatus === "QUALIFIED" || currentStatus === "REJECTED";
  const winningMatch = matches.find(
    (match) => Number(match.id) === Number(record?.winningProposalId ?? 0)
  ) as Record<string, unknown> | undefined;

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

  const closableMatches = matches.filter((m) => {
    const status = String(m.status ?? "SUGGESTED");
    return (
      m.reviewStatus === "APPROVED" &&
      ["QUALIFIED", "NEGOTIATING", "DEAL_WON"].includes(status)
    );
  });

  const approvalTag = (status: string) => {
    if (status === "PENDING") return <Tag color="gold">Chờ duyệt</Tag>;
    if (status === "APPROVED") return <Tag color="blue">Đã duyệt</Tag>;
    if (status === "REJECTED") return <Tag color="red">Từ chối</Tag>;
    return <Tag>{status}</Tag>;
  };

  const invalidateAll = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["deal-case-proposals", dealCaseId],
    });
  };

  const syncLeadMatches = (
    updater: (prev: Record<string, unknown>[]) => Record<string, unknown>[]
  ) => {
    queryClient.setQueryData<Record<string, unknown>[]>(
      ["deal-case-proposals", dealCaseId],
      (prev) => updater(prev ?? [])
    );
  };

  if (query?.isLoading) {
    return <AdminLoadingSkeleton rows={4} />;
  }

  if (query?.isError) {
    return (
      <AdminErrorState
        title="Không thể tải chi tiết hồ sơ"
        description="Dữ liệu hồ sơ không thể được tải tại thời điểm này."
        onRetry={() => {
          void query?.refetch?.();
        }}
      />
    );
  }

  if (!record) {
    return (
      <AdminErrorState
        title="Không tìm thấy hồ sơ"
        description="Bản ghi này không còn tồn tại hoặc không thể truy cập."
      />
    );
  }

  const handleQualify = async (
    matchId: number,
    counterpart: Record<string, unknown>
  ) => {
    if (counterpart.isMatched) {
      message.warning("Tin này đã được ghép ở hồ sơ khác.");
      return;
    }
    setMatchUpdating(true);
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/qualify`);
      message.success("Xác nhận phù hợp.");
      syncLeadMatches((prev) =>
        prev.map((item) =>
          Number(item.id) === matchId
            ? {
                ...item,
                status: "QUALIFIED",
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

  const handleNegotiate = async (matchId: number) => {
    setMatchUpdating(true);
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/negotiate`);
      message.success("Đã đàm phán.");
      syncLeadMatches((prev) =>
        prev.map((item) =>
          Number(item.id) === matchId
            ? {
                ...item,
                status: "NEGOTIATING",
              }
            : item
        )
      );
      await invalidateAll();
      await refetch();
    } catch {
      message.error("Không thể đàm phán.");
    } finally {
      setMatchUpdating(false);
    }
  };

  const handleRevertToSuggested = async (matchId: number) => {
    setMatchUpdating(true);
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/revert-suggested`);
      message.success("Đã hoàn tác về đề xuất mới.");
      syncLeadMatches((prev) =>
        prev.map((item) =>
          Number(item.id) === matchId
            ? {
                ...item,
                status: "SUGGESTED",
                matchedAt: null,
              }
            : item
        )
      );
      await invalidateAll();
      await refetch();
    } catch {
      message.error("Không thể hoàn tác đề xuất.");
    } finally {
      setMatchUpdating(false);
    }
  };

  const handleRevertToQualified = async (matchId: number) => {
    setMatchUpdating(true);
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/revert-qualified`);
      message.success("Đã hoàn tác về xác nhận phù hợp.");
      syncLeadMatches((prev) =>
        prev.map((item) =>
          Number(item.id) === matchId
            ? {
                ...item,
                status: "QUALIFIED",
                matchedAt: null,
              }
            : item
        )
      );
      await invalidateAll();
      await refetch();
    } catch {
      message.error("Không thể hoàn tác đàm phán.");
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
          Number(item.id) === matchId ? { ...item, status: "DEAL_LOST" } : item
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

  const handleApproveProposal = async (matchId: number) => {
    setMatchUpdating(true);
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/approve`);
      message.success("Đã duyệt đề xuất.");
      await invalidateAll();
      await refetch();
    } catch {
      message.error("Không thể duyệt đề xuất.");
    } finally {
      setMatchUpdating(false);
    }
  };

  const handleRejectProposal = async (matchId: number) => {
    setMatchUpdating(true);
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/reject-approval`);
      message.success("Đã từ chối đề xuất.");
      await invalidateAll();
      await refetch();
    } catch {
      message.error("Không thể từ chối đề xuất.");
    } finally {
      setMatchUpdating(false);
    }
  };

  const handleRevertApproval = async (matchId: number) => {
    setMatchUpdating(true);
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/revert-approval`);
      message.success("Đã hoàn tác về hàng chờ duyệt.");
      await invalidateAll();
      await refetch();
    } catch {
      message.error("Không thể hoàn tác duyệt.");
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
        await axiosInstance.post(
          `/listing-matches/${confirmAction.matchId}/unmatch`
        );
        message.success("Đã bỏ ghép.");
        syncLeadMatches((prev) =>
          prev.map((item) =>
            Number(item.id) === confirmAction.matchId
              ? { ...item, status: "NEGOTIATING" }
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
          ? "Không thể bỏ ghép."
          : "Không thể xóa."
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCloseCase = async () => {
    if (!closeDialogMode) return;

    try {
      const values = await closeForm.validateFields();
      setMatchUpdating(true);
      await axiosInstance.patch(`/leads/${dealCaseId}`, {
        status: closeDialogMode === "won" ? "QUALIFIED" : "REJECTED",
        completedAt: values.completedAt,
        winningProposalId:
          closeDialogMode === "won" ? Number(values.winningProposalId) : null,
        closureReason:
          closeDialogMode === "lost" ? values.closureReason : undefined,
        closureReasonDetail:
          closeDialogMode === "lost" ? values.closureReasonDetail : undefined,
        closureNote: values.closureNote,
      });
      message.success(
        closeDialogMode === "won"
          ? "Đã đóng hồ sơ thành công."
          : "Đã dừng chăm sóc hồ sơ."
      );
      setCloseDialogMode(null);
      closeForm.resetFields();
      await query?.refetch?.();
      await invalidateAll();
      await refetch();
    } catch (error) {
      if (error && typeof error === "object" && "errorFields" in error) return;
      message.error("Không thể đóng hồ sơ.");
    } finally {
      setMatchUpdating(false);
    }
  };

  const handleReopenCase = async () => {
    setMatchUpdating(true);
    try {
      await axiosInstance.patch(`/leads/${dealCaseId}`, {
        status: "CONTACTED",
      });
      message.success("Đã mở lại hồ sơ.");
      setCurrentStatus("CONTACTED");
      statusForm.setFieldsValue({ status: "CONTACTED" });
      await query?.refetch?.();
      await invalidateAll();
      await refetch();
    } catch {
      message.error("Không thể mở lại hồ sơ.");
    } finally {
      setMatchUpdating(false);
    }
  };

  const openWonCloseDialog = (matchId: number) => {
    setCloseDialogMode("won");
    closeForm.setFieldsValue({
      completedAt: new Date().toISOString().slice(0, 10),
      winningProposalId: matchId,
      closureReason: undefined,
      closureReasonDetail: undefined,
      closureNote: undefined,
    });
  };

  const openLostCloseDialog = () => {
    setCloseDialogMode("lost");
    closeForm.setFieldsValue({
      completedAt: new Date().toISOString().slice(0, 10),
      winningProposalId: undefined,
      closureReason: undefined,
      closureReasonDetail: undefined,
      closureNote: undefined,
    });
  };

  const fetchCounterpartOptions = async (keyword?: string) => {
    if (!linkedSource) return;

    setCounterpartSearching(true);
    try {
      const endpoint =
        linkedSource === "PROPERTY" ? "/rent-requests" : "/properties";
      const { data } = await axiosInstance.get(endpoint, {
        params: {
          q: keyword?.trim() || undefined,
          status: "PUBLISHED",
          page: 1,
          limit: 10,
          sortBy: "displayCode",
          sortOrder: "desc",
        },
      });

      const items = unwrapArray<Record<string, unknown>>(data);
      setCounterpartOptions(
        items.map((item) => ({
          value: String(item.id),
          label: `${String(item.displayCode ?? `#${item.id}`)} · ${String(
            item.title ?? "-"
          )}`,
        }))
      );
    } catch {
      setCounterpartOptions([]);
    } finally {
      setCounterpartSearching(false);
    }
  };

  const handleAddCandidate = async () => {
    try {
      const values = await addForm.validateFields();
      const counterpartId = values.counterpartId
        ? Number(values.counterpartId)
        : null;
      if (!counterpartId || counterpartId <= 0) {
        message.warning("Vui lòng chọn đề xuất hợp lệ.");
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
        dealCaseId,
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
  const winningCounterpart =
    winningMatch && linkedSource === "PROPERTY"
      ? (winningMatch.rentRequest as Record<string, unknown> | undefined)
      : winningMatch
        ? (winningMatch.property as Record<string, unknown> | undefined)
        : undefined;

  return (
    <>
      <AdminDetailLayout>
        <Title className="admin-show-heading" level={4}>
          {String(record.fullName ?? "-")}
        </Title>

        <AdminFormSection
          title="Tổng quan hồ sơ"
          description="Thông tin điều phối chính của hồ sơ."
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
                <StatusBadge status={currentStatus} kind="deal-case" />
              </div>
              <div className="admin-workflow-meta">
                <div className="admin-meta-item">
                  <span className="admin-meta-label">ID</span>
                  <span className="admin-meta-value">
                    {String(record.id ?? "-")}
                  </span>
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
                {isLeadClosed ? (
                  <div className="admin-meta-item">
                    <span className="admin-meta-label">Ngày hoàn tất</span>
                    <span className="admin-meta-value">
                      {formatMetaDate(record.completedAt as string | undefined)}
                    </span>
                  </div>
                ) : null}
              </div>

              {isLeadClosed ? (
                <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                  <div className="admin-meta-item">
                    <span className="admin-meta-label">Kết quả cuối</span>
                    <span className="admin-meta-value">
                      {currentStatus === "QUALIFIED"
                        ? "Chốt thành công"
                        : "Dừng chăm sóc"}
                    </span>
                  </div>
                  {currentStatus === "QUALIFIED" ? (
                    <div className="admin-meta-item">
                      <span className="admin-meta-label">Đề xuất thắng</span>
                      <span className="admin-meta-value">
                        {winningCounterpart
                          ? `${String(
                              winningCounterpart.displayCode ?? "-"
                            )} · ${String(winningCounterpart.title ?? "Đề xuất")}`
                          : "Đề xuất thắng"}
                      </span>
                    </div>
                  ) : (
                    <div className="admin-meta-item">
                      <span className="admin-meta-label">Lý do thất bại</span>
                      <span className="admin-meta-value">
                        {String(
                          record.closureReasonDetail ??
                            record.closureReason ??
                            "-"
                        )}
                      </span>
                    </div>
                  )}
                  {record.closureNote ? (
                    <div className="admin-meta-item">
                      <span className="admin-meta-label">Ghi chú</span>
                      <span className="admin-meta-value">
                        {String(record.closureNote)}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}

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
                      {String(sourceRecord.displayCode ?? "-")}
                    </span>
                  </div>
                  <Text type="secondary">Xem</Text>
                </button>
              ) : null}
            </div>

            <div>
              <Text type="secondary">Điều phối</Text>
              {isLeadClosed ? (
                <div style={{ marginTop: 8, display: "grid", gap: 10 }}>
                  <div className="admin-meta-item">
                    <span className="admin-meta-label">
                      Trạng thái hiện tại
                    </span>
                    <span className="admin-meta-value">
                      {currentStatus === "QUALIFIED"
                        ? "Hồ sơ đã đóng thành công"
                        : "Hồ sơ đã dừng chăm sóc"}
                    </span>
                  </div>
                  <div className="admin-meta-item">
                    <span className="admin-meta-label">Ngày hoàn tất</span>
                    <span className="admin-meta-value">
                      {formatMetaDate(record.completedAt as string | undefined)}
                    </span>
                  </div>
                  <Button
                    type="primary"
                    loading={matchUpdating}
                    onClick={() => {
                      void handleReopenCase();
                    }}
                  >
                    Mở lại hồ sơ
                  </Button>
                </div>
              ) : (
                <Form
                  form={statusForm}
                  layout="vertical"
                  initialValues={{ status: currentStatus }}
                  style={{ marginTop: 8 }}
                >
                  <Form.Item
                    label="Cập nhật trạng thái xử lý"
                    name="status"
                    style={{ marginBottom: 12 }}
                  >
                    <Select
                      options={DEAL_CASE_STATUS_OPTIONS.filter(
                        (option) =>
                          option.value === "NEW" || option.value === "CONTACTED"
                      )}
                      loading={matchUpdating}
                      onSelect={(value) => {
                        void (async () => {
                          setMatchUpdating(true);
                          try {
                            await axiosInstance.patch(`/leads/${dealCaseId}`, {
                              status: value,
                            });
                            setCurrentStatus(String(value));
                            statusForm.setFieldsValue({ status: value });
                            message.success("Đã cập nhật trạng thái hồ sơ.");
                            await query?.refetch?.();
                            await invalidateAll();
                          } catch {
                            message.error(
                              "Không thể cập nhật trạng thái hồ sơ."
                            );
                          } finally {
                            setMatchUpdating(false);
                          }
                        })();
                      }}
                    />
                  </Form.Item>
                  <Space wrap>
                    <Button
                      danger
                      onClick={() => {
                        openLostCloseDialog();
                      }}
                    >
                      Dừng chăm sóc
                    </Button>
                  </Space>
                </Form>
              )}
            </div>
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Đề xuất"
          description={
            sourceListingTitle !== "-"
              ? `Danh sách các tin ${counterpartLabel} đang được ghép với hồ sơ này.`
              : "Danh sách các đề xuất của hồ sơ."
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
              disabled={isLeadClosed}
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
                      {`${String(c?.displayCode ?? "-")} · ${String(
                        c?.contactName ?? "-"
                      )} · ${String(c?.contactPhone ?? "-")}`}
                    </div>
                  </div>
                );
              }}
            />
            <Table.Column
              title="Nguồn"
              width={120}
              render={(_: unknown, row: Record<string, unknown>) =>
                String(row.sourceType ?? "-") === "USER_SUBMISSION" ? (
                  <Tag color="geekblue">User gửi</Tag>
                ) : (
                  <Tag>Admin tạo</Tag>
                )
              }
            />
            <Table.Column
              title="Duyệt"
              width={130}
              render={(_: unknown, row: Record<string, unknown>) =>
                approvalTag(String(row.reviewStatus ?? "APPROVED"))
              }
            />
            <Table.Column
              title="Trạng thái"
              dataIndex="status"
              width={130}
              render={(value: string) => (
                <StatusBadge status={value} type="proposal" />
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
                  <span
                    className="admin-warning-badge"
                    title="Đề xuất này đã chốt thành công ở hồ sơ khác"
                  >
                    Đã chốt nơi khác
                  </span>
                ) : (
                  <span className="admin-ready-badge">Sẵn sàng</span>
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
                const status = String(row.status ?? "SUGGESTED");
                const matchId = Number(row.id);
                const counterpart =
                  linkedSource === "PROPERTY" ? row.rentRequest : row.property;
                const c = counterpart as Record<string, unknown> | undefined;
                const isMatchedElsewhere = c?.isMatched as boolean | undefined;

                return (
                  <div className="admin-action-group">
                    {status === "SUGGESTED" &&
                    row.reviewStatus === "PENDING" ? (
                      <>
                        <Button
                          type="primary"
                          onClick={() => void handleApproveProposal(matchId)}
                        >
                          Duyệt
                        </Button>
                        <Button
                          danger
                          onClick={() => void handleRejectProposal(matchId)}
                        >
                          Từ chối
                        </Button>
                      </>
                    ) : null}
                    {status === "SUGGESTED" &&
                    row.reviewStatus === "APPROVED" ? (
                      <>
                        <Button
                          type="primary"
                          disabled={!!isMatchedElsewhere}
                          onClick={() => void handleQualify(matchId, c ?? {})}
                        >
                          Phù hợp
                        </Button>
                        <Button onClick={() => void handleReject(matchId)}>
                          Không phù hợp
                        </Button>
                        {String(row.sourceType ?? "-") === "USER_SUBMISSION" ? (
                          <Button
                            onClick={() => void handleRevertApproval(matchId)}
                          >
                            Hoàn tác duyệt
                          </Button>
                        ) : null}
                      </>
                    ) : null}
                    {status === "SUGGESTED" &&
                    row.reviewStatus === "REJECTED" &&
                    String(row.sourceType ?? "-") === "USER_SUBMISSION" ? (
                      <Button
                        onClick={() => void handleRevertApproval(matchId)}
                      >
                        Hoàn tác duyệt
                      </Button>
                    ) : null}
                    {status === "QUALIFIED" &&
                    row.reviewStatus === "APPROVED" ? (
                      <>
                        <Button
                          type="primary"
                          onClick={() => void handleNegotiate(matchId)}
                        >
                          Đàm phán
                        </Button>
                        <Button onClick={() => void handleReject(matchId)}>
                          Không phù hợp
                        </Button>
                        <Button
                          onClick={() => void handleRevertToSuggested(matchId)}
                        >
                          Hoàn tác
                        </Button>
                      </>
                    ) : null}
                    {status === "NEGOTIATING" &&
                    row.reviewStatus === "APPROVED" ? (
                      <>
                        <Button
                          type="primary"
                          disabled={!!isMatchedElsewhere}
                          onClick={() => openWonCloseDialog(matchId)}
                        >
                          Chốt đề xuất
                        </Button>
                        <Button onClick={() => void handleReject(matchId)}>
                          Không phù hợp
                        </Button>
                        <Button
                          onClick={() => void handleRevertToQualified(matchId)}
                        >
                          Hoàn tác
                        </Button>
                      </>
                    ) : null}
                    {!isLeadClosed && status === "DEAL_WON" && (
                      <Button onClick={() => handleUnmatch(matchId)}>
                        Bỏ ghép
                      </Button>
                    )}
                    {!isLeadClosed &&
                      (status === "DEAL_LOST" ||
                        status === "CANCELLED_AUTO") && (
                        <>
                          <Button
                            onClick={() =>
                              void handleRevertToSuggested(matchId)
                            }
                          >
                            Hoàn tác
                          </Button>
                          <Button danger onClick={() => handleRemove(matchId)}>
                            Xóa
                          </Button>
                        </>
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
          Tìm theo mã tin hoặc tên tin để thêm đề xuất cho hồ sơ này.
        </div>
        <Form form={addForm} layout="vertical">
          <Form.Item
            label={`Chọn ${counterpartLabel}`}
            name="counterpartId"
            rules={[{ required: true, message: "Chọn đề xuất hợp lệ" }]}
          >
            <Select
              showSearch
              placeholder="Nhập mã tin hoặc tên tin..."
              filterOption={false}
              loading={counterpartSearching}
              onFocus={() => {
                void fetchCounterpartOptions();
              }}
              onSearch={(value) => {
                void fetchCounterpartOptions(value);
              }}
            >
              {counterpartOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          closeDialogMode === "won"
            ? "Chốt đề xuất và lưu trữ hồ sơ"
            : "Dừng chăm sóc hồ sơ"
        }
        open={!!closeDialogMode}
        forceRender
        onOk={() => {
          void handleCloseCase();
        }}
        confirmLoading={matchUpdating}
        onCancel={() => {
          setCloseDialogMode(null);
          closeForm.resetFields();
        }}
        okText={closeDialogMode === "won" ? "Lưu trữ hồ sơ" : "Xác nhận dừng"}
        cancelText="Hủy"
      >
        <Form form={closeForm} layout="vertical">
          <Form.Item
            label="Ngày hoàn tất"
            name="completedAt"
            rules={[{ required: true, message: "Vui lòng nhập ngày hoàn tất" }]}
          >
            <Input type="date" />
          </Form.Item>

          {closeDialogMode === "won" ? (
            <Form.Item
              label="Chốt đề xuất"
              name="winningProposalId"
              rules={[{ required: true, message: "Chọn đề xuất thắng" }]}
            >
              <Select
                options={closableMatches.map((item) => {
                  const counterpart =
                    linkedSource === "PROPERTY"
                      ? item.rentRequest
                      : item.property;
                  const c = counterpart as Record<string, unknown> | undefined;
                  const proposalStatus = String(item.status ?? "SUGGESTED");
                  const proposalStatusLabel =
                    PROPOSAL_STATUS_OPTIONS.find(
                      (option) => option.value === proposalStatus
                    )?.label ?? proposalStatus;
                  return {
                    value: Number(item.id),
                    label: `${String(c?.displayCode ?? "-")} · ${String(
                      c?.title ?? "Đề xuất"
                    )}${proposalStatusLabel ? ` · ${proposalStatusLabel}` : ""}`,
                  };
                })}
              />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                label="Lý do thất bại"
                name="closureReason"
                rules={[{ required: true, message: "Chọn lý do thất bại" }]}
              >
                <Select
                  options={[
                    {
                      label: "Không phù hợp nhu cầu",
                      value: "Không phù hợp nhu cầu",
                    },
                    {
                      label: "Ngân sách không phù hợp",
                      value: "Ngân sách không phù hợp",
                    },
                    {
                      label: "Không liên hệ được",
                      value: "Không liên hệ được",
                    },
                    { label: "Khách đổi ý", value: "Khách đổi ý" },
                    { label: "Khác", value: "Khác" },
                  ]}
                />
              </Form.Item>
              <Form.Item shouldUpdate noStyle>
                {({ getFieldValue }) =>
                  getFieldValue("closureReason") === "Khác" ? (
                    <Form.Item
                      label="Lý do khác"
                      name="closureReasonDetail"
                      rules={[{ required: true, message: "Nhập lý do cụ thể" }]}
                    >
                      <Input.TextArea rows={3} />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </>
          )}

          <Form.Item label="Ghi chú" name="closureNote">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={!!confirmAction}
        title={
          confirmAction?.kind === "unmatch"
            ? "Bỏ ghép đề xuất này?"
            : "Xóa đề xuất này?"
        }
        okText={
          confirmAction?.kind === "unmatch"
            ? "Xác nhận bỏ ghép"
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
          ? "Tin cho thuê và tin cần thuê sẽ được bỏ ghép. Hồ sơ sẽ quay về trạng thái chờ xử lý."
          : "Đề xuất này sẽ bị xóa khỏi danh sách. Hành động này không thể hoàn tác."}
      </Modal>
    </>
  );
};
