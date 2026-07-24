import Link from "next/link";
import { notFound } from "next/navigation";

import SentLeadProposalActions from "@/components/cms/user/SentLeadProposalActions";
import StatusBadge, {
  dealCaseStatusBadgeToneMap,
  proposalStatusBadgeToneMap,
} from "@/components/cms/shared/StatusBadge";
import {
  DEAL_CASE_STATUS_LABEL_MAP,
  PROPOSAL_STATUS_LABEL_MAP,
} from "@/constants/enum-options";
import { formatDateDisplay } from "@/lib/format";
import { dealCaseService } from "@/services/lead.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

function approvalLabel(status: "PENDING" | "APPROVED" | "REJECTED") {
  if (status === "PENDING") return "Chờ duyệt";
  if (status === "APPROVED") return "Đã duyệt";
  return "Từ chối";
}

function buildListingHref(input: {
  property?: { slug: string } | null;
  rentRequest?: { slug: string } | null;
}) {
  if (input.property?.slug) {
    return `/cho-thue/${input.property.slug}`;
  }

  if (input.rentRequest?.slug) {
    return `/can-thue/${input.rentRequest.slug}`;
  }

  return null;
}

export default async function UserSentLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dealCaseId = Number(id);
  if (!Number.isFinite(dealCaseId) || dealCaseId <= 0) {
    notFound();
  }

  const item = await dealCaseService
    .getMySentDealCaseById(dealCaseId)
    .catch(() => null);
  if (!item) {
    notFound();
  }

  const source = item.property ?? item.rentRequest;
  const sourceHref = buildListingHref({
    property: item.property ?? null,
    rentRequest: item.rentRequest ?? null,
  });
  const proposalList = (item.proposals ?? []) as Array<
    Record<string, any> & { id: number }
  >;
  const winningProposalId = Number(item.winningProposalId ?? 0);

  return (
    <section className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.5fr]">
        <div className="space-y-5">
          <section className="surface-panel p-4 md:p-5">
            <div className="flex justify-between">
              <h2 className="text-heading text-lg font-semibold">
                Thông tin liên hệ đã gửi
              </h2>
              <StatusBadge tone={dealCaseStatusBadgeToneMap[item.status]}>
                {DEAL_CASE_STATUS_LABEL_MAP[item.status]}
              </StatusBadge>
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              <p>
                <span className="text-secondary">Tin đăng:</span>{" "}
                {source?.title ?? "-"}
              </p>
              <p>
                <span className="text-secondary">Mã tin:</span>{" "}
                {source?.displayCode ?? "-"}
              </p>
              <p>
                <span className="text-secondary">Ngày tạo:</span>{" "}
                {formatDateDisplay(item.createdAt)}
              </p>
              {item.completedAt ? (
                <p>
                  <span className="text-secondary">Ngày hoàn tất:</span>{" "}
                  {formatDateDisplay(item.completedAt)}
                </p>
              ) : null}

              {item.note ? (
                <p>
                  <span className="text-secondary">Ghi chú gửi đi:</span>{" "}
                  {item.note}
                </p>
              ) : null}

              {sourceHref ? (
                <p>
                  <Link
                    href={sourceHref}
                    className="text-primary text-sm font-medium"
                  >
                    Xem tin đăng gốc
                  </Link>
                </p>
              ) : null}
            </div>
          </section>

          <section className="surface-panel p-4 md:p-5">
            <h2 className="text-heading text-lg font-semibold">Đề xuất</h2>
            <div className="mt-4 space-y-3">
              {proposalList?.length ? (
                proposalList.map((proposal) => {
                  const counterpart =
                    item.property != null
                      ? proposal.rentRequest
                      : proposal.property;
                  const counterpartHref = buildListingHref({
                    property: proposal.property ?? null,
                    rentRequest: proposal.rentRequest ?? null,
                  });

                  return (
                    <article
                      key={proposal.id}
                      className="border-hairline bg-surface rounded-2xl border p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-heading font-semibold">
                            {counterpart?.title ?? "Đề xuất"}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge
                            tone={
                              proposal.reviewStatus === "PENDING"
                                ? "warning"
                                : proposal.reviewStatus === "APPROVED"
                                  ? "info"
                                  : "danger"
                          }
                        >
                            {approvalLabel(proposal.reviewStatus)}
                          </StatusBadge>
                          <StatusBadge
                            tone={
                              proposalStatusBadgeToneMap[
                                proposal.status as keyof typeof proposalStatusBadgeToneMap
                              ]
                            }
                          >
                            {
                              PROPOSAL_STATUS_LABEL_MAP[
                                proposal.status as keyof typeof PROPOSAL_STATUS_LABEL_MAP
                              ]
                            }
                          </StatusBadge>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 text-sm">
                        <p>
                          <span className="text-secondary">Mã tin:</span>{" "}
                          {counterpart?.displayCode ?? "-"}
                        </p>

                        {proposal.matchedAt ? (
                          <p>
                            <span className="text-secondary">
                              Ngày chốt đề xuất:
                            </span>{" "}
                            {formatDateDisplay(proposal.matchedAt)}
                          </p>
                        ) : null}
                        {counterpartHref ? (
                          <div className="pt-1">
                            <Link
                              href={counterpartHref}
                              className="text-primary text-sm font-medium"
                            >
                              Xem tin đề xuất
                            </Link>
                          </div>
                        ) : null}
                        <SentLeadProposalActions
                          dealCaseId={item.id}
                          proposalId={proposal.id}
                          reviewStatus={proposal.reviewStatus}
                          status={proposal.status}
                        />
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="text-secondary text-sm">
                  Chưa có đề xuất nào được ghi nhận cho liên hệ này.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="surface-panel p-4 md:p-5">
          <h2 className="text-heading text-lg font-semibold">Tiến độ xử lý</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p>
              <span className="text-secondary">Trạng thái:</span>{" "}
              {DEAL_CASE_STATUS_LABEL_MAP[item.status]}
            </p>
            <p>
              <span className="text-secondary">Tiến độ kiểm duyệt:</span>{" "}
              {proposalList?.some(
                (proposal) => proposal.reviewStatus === "PENDING",
              )
                ? "Đang chờ duyệt"
                : proposalList?.some(
                      (proposal) => proposal.reviewStatus === "APPROVED",
                    )
                  ? "Đã có đề xuất"
                  : "Chưa có đề xuất"}
            </p>
            <p>
              <span className="text-secondary">Số đề xuất:</span>{" "}
              {proposalList?.length ?? 0}
            </p>
            {winningProposalId ? (
              <p>
                <span className="text-secondary">Đề xuất đã chốt:</span>{" "}
                {(() => {
                  const winningProposal = proposalList?.find(
                    (proposal) => proposal.id === winningProposalId,
                  );
                  const counterpart =
                    item.property != null
                      ? winningProposal?.rentRequest
                      : winningProposal?.property;
                  return counterpart?.displayCode ?? "Đề xuất thắng";
                })()}
              </p>
            ) : null}
            {item.closureReason ? (
              <p>
                <span className="text-secondary">Lý do dừng chăm sóc:</span>{" "}
                {item.closureReason}
              </p>
            ) : null}
            {item.closureReasonDetail ? (
              <p>
                <span className="text-secondary">Chi tiết:</span>{" "}
                {item.closureReasonDetail}
              </p>
            ) : null}
            {item.closureNote ? (
              <p>
                <span className="text-secondary">Ghi chú:</span>{" "}
                {item.closureNote}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}
