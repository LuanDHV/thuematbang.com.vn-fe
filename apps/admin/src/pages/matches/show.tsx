import React, { useEffect, useState } from "react";
import { useShow } from "@refinedev/core";
import {
  Button,
  Modal,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";

import { AdminDetailLayout } from "../../components/admin/page/AdminDetailLayout";
import { AdminFormSection } from "../../components/admin/page/AdminFormSection";
import { StatusBadge } from "../../components/StatusBadge";
import { axiosInstance } from "../../providers/auth/auth-client";
import { formatMetaDate } from "../../lib/admin/utils/format";

const { Text, Title } = Typography;

export const MatchesShow: React.FC = () => {
  const navigate = useNavigate();
  const { query } = useShow();
  const record = query?.data?.data as Record<string, unknown> | undefined;
  const [loading, setLoading] = useState("");
  const [currentStatus, setCurrentStatus] = useState("CANDIDATE");

  useEffect(() => {
    setCurrentStatus(String(record?.status ?? "CANDIDATE"));
  }, [record?.status]);

  if (!record) return null;

  const matchId = record.id as number;
  const status = currentStatus;
  const prop = record.property as Record<string, unknown> | undefined;
  const rentReq = record.rentRequest as Record<string, unknown> | undefined;
  const counterpartIsMatched =
    Boolean(rentReq?.isMatched) || Boolean(prop?.isMatched);

  const handlePromote = async () => {
    if (counterpartIsMatched) {
      message.warning("Tin này đã được ghép ở lead khác.");
      return;
    }
    setLoading("promote");
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/promote`, {
        leadId: record.leadId,
      });
      message.success("Đã xác nhận phù hợp.");
      setCurrentStatus("MATCHED");
      await query?.refetch?.();
    } catch {
      message.error("Không thể xác nhận phù hợp.");
    } finally {
      setLoading("");
    }
  };

  const handleReject = async () => {
    setLoading("reject");
    try {
      await axiosInstance.post(`/listing-matches/${matchId}/reject`);
      message.success("Đã từ chối.");
      setCurrentStatus("REJECTED");
      await query?.refetch?.();
    } catch {
      message.error("Không thể từ chối.");
    } finally {
      setLoading("");
    }
  };

  const handleUnmatch = () => {
    Modal.confirm({
      title: "Hủy ghép đề xuất này?",
      content:
        "Tin cho thuê và tin cần thuê sẽ được bỏ ghép. Lead sẽ quay về trạng thái chờ xử lý.",
      okText: "Xác nhận hủy ghép",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axiosInstance.post(`/listing-matches/${matchId}/unmatch`);
          message.success("Đã hủy ghép.");
          setCurrentStatus("CANDIDATE");
          await query?.refetch?.();
        } catch {
          message.error("Không thể hủy ghép.");
        }
      },
    });
  };

  const handleRemove = () => {
    Modal.confirm({
      title: "Xóa đề xuất này?",
      content: `Đề xuất ID ${matchId} sẽ bị xóa khỏi danh sách. Hành động này không thể hoàn tác.`,
      okText: "Xác nhận xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/listing-matches/${matchId}`);
          message.success("Đã xóa.");
          navigate(-1);
        } catch {
          message.error("Không thể xóa.");
        }
      },
    });
  };

  return (
    <AdminDetailLayout>
      <Title className="admin-show-heading" level={4}>
        {String(prop?.title ?? rentReq?.title ?? "Đề xuất ghép")}
      </Title>

      <AdminFormSection
        title="Thông tin ghép"
        description="Chi tiết kết nối giữa tin cho thuê và tin cần thuê."
      >
        <div className="admin-workflow-title-row">
          <StatusBadge status={status} type="match" />
          {counterpartIsMatched && status === "CANDIDATE" ? (
            <span className="admin-warning-badge">Đã ghép nơi khác</span>
          ) : null}
        </div>

        <div className="admin-match-pair">
          <div className="admin-match-side">
            <Text type="secondary">Tin cho thuê</Text>
            <div className="admin-entity-copy">
              <div className="admin-entity-title">
                {String(prop?.title ?? "-")}
              </div>
              <span className="admin-entity-subtitle">
                {`ID #${String(prop?.id ?? "-")} · ${String(
                  prop?.contactName ?? "-"
                )} · ${String(prop?.contactPhone ?? "-")}`}
              </span>
            </div>
          </div>
          <div className="admin-match-connector">&lt;-&gt;</div>
          <div className="admin-match-side">
            <Text type="secondary">Tin cần thuê</Text>
            <div className="admin-entity-copy">
              <div className="admin-entity-title">
                {String(rentReq?.title ?? "-")}
              </div>
              <span className="admin-entity-subtitle">
                {`ID #${String(rentReq?.id ?? "-")} · ${String(
                  rentReq?.contactName ?? "-"
                )} · ${String(rentReq?.contactPhone ?? "-")}`}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-workflow-meta" style={{ marginTop: 14 }}>
          <div className="admin-meta-item">
            <span className="admin-meta-label">Lead</span>
            <span className="admin-meta-value">
              {String(
                (record.lead as Record<string, unknown> | undefined)?.fullName ??
                  "-"
              )}
            </span>
          </div>
          <div className="admin-meta-item">
            <span className="admin-meta-label">Ghép lúc</span>
            <span className="admin-meta-value">
              {formatMetaDate(record.matchedAt as string | undefined)}
            </span>
          </div>
          <div className="admin-meta-item">
            <span className="admin-meta-label">Ngày tạo</span>
            <span className="admin-meta-value">
              {formatMetaDate(record.createdAt as string | undefined)}
            </span>
          </div>
        </div>

        <div className="admin-action-group" style={{ marginTop: 16 }}>
          {status === "CANDIDATE" && (
            <>
              <Button
                type="primary"
                disabled={!!counterpartIsMatched}
                loading={loading === "promote"}
                onClick={() => {
                  void handlePromote();
                }}
              >
                Phù hợp
              </Button>
              <Button
                loading={loading === "reject"}
                onClick={() => {
                  void handleReject();
                }}
              >
                Không phù hợp
              </Button>
              <Button danger onClick={handleRemove}>
                Xóa
              </Button>
            </>
          )}
          {status === "MATCHED" && (
            <Button onClick={handleUnmatch}>
              Hủy ghép
            </Button>
          )}
          {status === "REJECTED" && (
            <Button danger onClick={handleRemove}>
              Xóa
            </Button>
          )}
        </div>
      </AdminFormSection>
    </AdminDetailLayout>
  );
};
