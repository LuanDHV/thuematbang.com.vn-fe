import Link from "next/link";
import { notFound } from "next/navigation";

import SentLeadProposalActions from "@/components/cms/user/SentLeadProposalActions";
import StatusBadge, {
  leadStatusBadgeToneMap,
  listingMatchStatusBadgeToneMap,
} from "@/components/cms/shared/StatusBadge";
import {
  LEAD_STATUS_LABEL_MAP,
  LISTING_MATCH_STATUS_LABEL_MAP,
} from "@/constants/enum-options";
import { formatDateDisplay } from "@/lib/format";
import { leadService } from "@/services/lead.service";

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
  const leadId = Number(id);
  if (!Number.isFinite(leadId) || leadId <= 0) {
    notFound();
  }

  const item = await leadService.getMySentLeadById(leadId).catch(() => null);
  if (!item) {
    notFound();
  }

  const source = item.property ?? item.rentRequest;
  const sourceHref = buildListingHref({
    property: item.property ?? null,
    rentRequest: item.rentRequest ?? null,
  });

  return (
    <section className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.5fr]">
        <div className="space-y-5">
          <section className="surface-panel p-4 md:p-5">
            <div className="flex justify-between">
              <h2 className="text-heading text-lg font-semibold">
                Thông tin liên hệ đã gửi
              </h2>
              <StatusBadge tone={leadStatusBadgeToneMap[item.status]}>
                {LEAD_STATUS_LABEL_MAP[item.status]}
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
              {(item.listingMatches ?? []).length ? (
                item.listingMatches?.map((proposal) => {
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
                              proposal.approvalStatus === "PENDING"
                                ? "warning"
                                : proposal.approvalStatus === "APPROVED"
                                  ? "info"
                                  : "danger"
                            }
                          >
                            {approvalLabel(proposal.approvalStatus)}
                          </StatusBadge>
                          <StatusBadge
                            tone={
                              listingMatchStatusBadgeToneMap[proposal.status]
                            }
                          >
                            {LISTING_MATCH_STATUS_LABEL_MAP[proposal.status]}
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
                          leadId={item.id}
                          proposalId={proposal.id}
                          approvalStatus={proposal.approvalStatus}
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
              {LEAD_STATUS_LABEL_MAP[item.status]}
            </p>
            <p>
              <span className="text-secondary">Tiến độ kiểm duyệt:</span>{" "}
              {(item.listingMatches ?? []).some(
                (proposal) => proposal.approvalStatus === "PENDING",
              )
                ? "Đang chờ duyệt"
                : (item.listingMatches ?? []).some(
                      (proposal) => proposal.approvalStatus === "APPROVED",
                    )
                  ? "Đã có đề xuất"
                  : "Chưa có đề xuất"}
            </p>
            <p>
              <span className="text-secondary">Số đề xuất:</span>{" "}
              {item.listingMatches?.length ?? 0}
            </p>
            {item.winningMatchId ? (
              <p>
                <span className="text-secondary">Đề xuất đã chốt:</span>{" "}
                {(() => {
                  const winningProposal = item.listingMatches?.find(
                    (proposal) => proposal.id === item.winningMatchId,
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
