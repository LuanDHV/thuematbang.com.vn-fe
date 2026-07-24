import React, { useEffect, useState } from "react";
import { useShow } from "@refinedev/core";
import { Button, Space, Tag, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";

import { AdminDetailLayout } from "../../components/admin/page/AdminDetailLayout";
import { AdminFormSection } from "../../components/admin/page/AdminFormSection";
import { StatusBadge } from "../../components/StatusBadge";
import { axiosInstance } from "../../providers/auth/auth-client";
import { formatMetaDate } from "../../lib/admin/utils/format";

const { Text, Title } = Typography;

function approvalTag(status: string) {
  if (status === "PENDING") return <Tag color="gold">Chờ duyệt</Tag>;
  if (status === "APPROVED") return <Tag color="blue">Đã duyệt</Tag>;
  if (status === "REJECTED") return <Tag color="red">Từ chối</Tag>;
  return <Tag>{status}</Tag>;
}

export const MatchesShow: React.FC = () => {
  const navigate = useNavigate();
  const { query } = useShow();
  const record = query?.data?.data as Record<string, unknown> | undefined;
  const [actionLoading, setActionLoading] = useState("");
  const [reviewStatus, setReviewStatus] = useState("PENDING");

  useEffect(() => {
    setReviewStatus(String(record?.reviewStatus ?? "PENDING"));
  }, [record?.reviewStatus]);

  if (!record) return null;

  const property = record.property as Record<string, unknown> | undefined;
  const rentRequest = record.rentRequest as Record<string, unknown> | undefined;
  const dealCase = record.dealCase as Record<string, unknown> | undefined;
  const caseHref = dealCase?.id
    ? property
      ? `/leads/property/show/${dealCase.id}`
      : `/leads/rent-request/show/${dealCase.id}`
    : null;

  const handleApprove = async () => {
    setActionLoading("approve");
    try {
      await axiosInstance.post(`/listing-matches/${record.id}/approve`, {});
      setReviewStatus("APPROVED");
      message.success("Đã duyệt đề xuất.");
      await query?.refetch?.();
    } catch {
      message.error("Không thể duyệt đề xuất.");
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async () => {
    setActionLoading("reject");
    try {
      await axiosInstance.post(`/listing-matches/${record.id}/reject-approval`, {});
      setReviewStatus("REJECTED");
      message.success("Đã từ chối đề xuất.");
      await query?.refetch?.();
    } catch {
      message.error("Không thể từ chối đề xuất.");
    } finally {
      setActionLoading("");
    }
  };

  const handleRevertApproval = async () => {
    setActionLoading("revert");
    try {
      await axiosInstance.post(`/listing-matches/${record.id}/revert-approval`, {});
      setReviewStatus("PENDING");
      message.success("Đã hoàn tác về hàng chờ duyệt.");
      await query?.refetch?.();
    } catch {
      message.error("Không thể hoàn tác duyệt.");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <AdminDetailLayout>
      <Title className="admin-show-heading" level={4}>
        Đề xuất #{String(record.id)}
      </Title>

      <AdminFormSection
        title="Tổng quan đề xuất"
        description="Theo dõi trạng thái duyệt trước khi đề xuất được public sang phía còn lại."
      >
        <div className="admin-workflow-summary">
          <div>
            <div className="admin-workflow-title-row">
              <div className="admin-entity-copy">
                <div className="admin-entity-title">
                  {String(property?.title ?? "-")}
                </div>
                <span className="admin-entity-subtitle">
                  {String(rentRequest?.title ?? "-")}
                </span>
              </div>
              <Space size={8}>
                {approvalTag(reviewStatus)}
                <StatusBadge status={String(record.status ?? "SUGGESTED")} kind="proposal" />
              </Space>
            </div>
            <div className="admin-workflow-meta">
              <div className="admin-meta-item">
                <span className="admin-meta-label">Nguồn tạo</span>
                <span className="admin-meta-value">
                  {String(record.sourceType ?? "-") === "USER_SUBMISSION"
                    ? "User gửi"
                    : "Admin tạo"}
                </span>
              </div>
              <div className="admin-meta-item">
                <span className="admin-meta-label">Ngày tạo</span>
                <span className="admin-meta-value">
                  {formatMetaDate(record.createdAt as string | undefined)}
                </span>
              </div>
              <div className="admin-meta-item">
                <span className="admin-meta-label">Duyệt lúc</span>
                <span className="admin-meta-value">
                  {formatMetaDate(record.approvalReviewedAt as string | undefined)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <Text type="secondary">Xử lý nhanh</Text>
            <div className="admin-action-group" style={{ marginTop: 12 }}>
              {reviewStatus === "PENDING" ? (
                <>
                  <Button
                    type="primary"
                    loading={actionLoading === "approve"}
                    onClick={() => {
                      void handleApprove();
                    }}
                  >
                    Duyệt
                  </Button>
                  <Button
                    danger
                    loading={actionLoading === "reject"}
                    onClick={() => {
                      void handleReject();
                    }}
                  >
                    Từ chối
                  </Button>
                </>
              ) : null}
              {reviewStatus !== "PENDING" && String(record.status ?? "SUGGESTED") === "SUGGESTED" ? (
                <Button
                  loading={actionLoading === "revert"}
                  onClick={() => {
                    void handleRevertApproval();
                  }}
                >
                  Hoàn tác duyệt
                </Button>
              ) : null}
              {caseHref ? (
                <Button onClick={() => navigate(caseHref)}>Mở hồ sơ</Button>
              ) : null}
            </div>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Thông tin liên quan" description="Dữ liệu hiển thị cho admin trước khi quyết định public đề xuất.">
        <div className="admin-stack">
          <div className="admin-entity-copy">
            <Text type="secondary">Tin cho thuê</Text>
            <div className="admin-entity-title">{String(property?.title ?? "-")}</div>
            <span className="admin-entity-subtitle">
              {String(property?.displayCode ?? property?.id ?? "-")}
            </span>
          </div>
          <div className="admin-entity-copy">
            <Text type="secondary">Tin cần thuê</Text>
            <div className="admin-entity-title">{String(rentRequest?.title ?? "-")}</div>
            <span className="admin-entity-subtitle">
              {String(rentRequest?.displayCode ?? rentRequest?.id ?? "-")}
            </span>
          </div>
          <div className="admin-entity-copy">
            <Text type="secondary">Hồ sơ</Text>
            <div className="admin-entity-title">
              {String(dealCase?.fullName ?? "-")}
            </div>
            <span className="admin-entity-subtitle">
              {String(dealCase?.phone ?? "-")}
            </span>
          </div>
        </div>
      </AdminFormSection>
    </AdminDetailLayout>
  );
};
