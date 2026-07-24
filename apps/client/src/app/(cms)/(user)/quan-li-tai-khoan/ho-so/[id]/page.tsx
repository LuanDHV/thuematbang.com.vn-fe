import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function UserMarketplaceCaseDetailPage({
  params,
}: PageProps) {
  const { id } = await params;
  const caseId = Number(id);
  if (!Number.isFinite(caseId) || caseId <= 0) {
    notFound();
  }

  const item = await leadService
    .getMyMarketplaceCaseById(caseId)
    .catch(() => null);
  if (!item) {
    notFound();
  }

  const source = item.property ?? item.rentRequest;
  const winningProposal = item.winningMatchId
    ? item.listingMatches?.find((proposal) => proposal.id === item.winningMatchId)
    : null;
  const winningCounterpart =
    item.property != null
      ? winningProposal?.rentRequest
      : winningProposal?.property;

  return (
    <section className="space-y-5">
      <div className="surface-panel p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-secondary text-sm">Hồ sơ #{item.id}</p>
            <h1 className="text-heading text-2xl font-semibold">
              {item.fullName}
            </h1>
            <p className="text-secondary text-sm">{item.phone}</p>
          </div>
          <StatusBadge tone={leadStatusBadgeToneMap[item.status]}>
            {LEAD_STATUS_LABEL_MAP[item.status]}
          </StatusBadge>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <section className="surface-panel p-4 md:p-5">
            <h2 className="text-heading text-lg font-semibold">
              Thông tin hồ sơ
            </h2>
            <div className="mt-4 grid gap-3 text-sm">
              <p>
                <span className="text-secondary">Tin gốc:</span>{" "}
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
              <p>
                <span className="text-secondary">Ngày hoàn tất:</span>{" "}
                {item.completedAt ? formatDateDisplay(item.completedAt) : "-"}
              </p>
              {source?.slug ? (
                <p>
                  <Link
                    href={
                      item.property
                        ? `/cho-thue/${source.slug}`
                        : `/can-thue/${source.slug}`
                    }
                    className="text-primary text-sm font-medium"
                  >
                    Xem tin gốc
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
                          <p className="text-secondary text-sm">
                            {counterpart?.displayCode ??
                              counterpart?.slug ??
                              "-"}
                          </p>
                        </div>
                        <StatusBadge
                          tone={listingMatchStatusBadgeToneMap[proposal.status]}
                        >
                          {LISTING_MATCH_STATUS_LABEL_MAP[proposal.status]}
                        </StatusBadge>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm">
                        <p>
                          <span className="text-secondary">Nguồn tạo:</span>{" "}
                          {proposal.origin === "ADMIN_CREATED"
                            ? "Admin đề xuất"
                            : "Đề xuất từ người dùng"}
                        </p>
                        <p>
                          <span className="text-secondary">Ngày tạo:</span>{" "}
                          {formatDateDisplay(proposal.createdAt)}
                        </p>
                        {proposal.matchedAt ? (
                          <p>
                            <span className="text-secondary">
                              Ngày chốt đề xuất:
                            </span>{" "}
                            {formatDateDisplay(proposal.matchedAt)}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="text-secondary text-sm">
                  Chưa có đề xuất nào được duyệt cho hồ sơ này.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="surface-panel p-4 md:p-5">
          <h2 className="text-heading text-lg font-semibold">Tiến độ xử lý</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p>
              <span className="text-secondary">Trạng thái hiện tại:</span>{" "}
              {LEAD_STATUS_LABEL_MAP[item.status]}
            </p>
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
            {item.winningMatchId ? (
              <p>
                <span className="text-secondary">Đề xuất đã chốt:</span>{" "}
                {winningCounterpart?.displayCode ?? "Đề xuất thắng"}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}
