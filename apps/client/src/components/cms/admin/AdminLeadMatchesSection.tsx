"use client";

import Link from "next/link";
import { CheckCircle2, CircleX, Plus, Undo2, X } from "lucide-react";
import type { ReactNode } from "react";

import AdminStatusBadge, {
  listingMatchStatusBadgeToneMap,
} from "@/components/cms/admin/AdminStatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LISTING_MATCH_STATUS_LABEL_MAP } from "@/constants/enum-options";
import { formatDate } from "@/lib/format";
import type { LeadSourceFilter } from "@/types/lead";
import type { ListingMatchSummary } from "@/types/listing-match";

type AdminLeadMatchesSectionProps = {
  candidates: ListingMatchSummary[];
  source: LeadSourceFilter;
  sourceListingTitle?: string;
  counterpartTypeLabel: string;
  updating: boolean;
  onAddCandidate: () => void;
  onPromote: (matchId: number) => void;
  onReject: (matchId: number) => void;
  onUnmatch: (matchId: number) => void;
  onRemoveCandidate: (matchId: number) => void;
};

function MetaTile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-hairline bg-app/55 rounded-xl border px-3 py-2.5">
      <p className="text-secondary text-[11px] font-semibold tracking-[0.16em] uppercase">
        {label}
      </p>
      <p className="text-heading mt-1 text-sm leading-5 font-medium wrap-break-word">
        {value}
      </p>
    </div>
  );
}

export default function AdminLeadMatchesSection({
  candidates,
  source,
  sourceListingTitle,
  counterpartTypeLabel,
  updating,
  onAddCandidate,
  onPromote,
  onReject,
  onUnmatch,
  onRemoveCandidate,
}: AdminLeadMatchesSectionProps) {
  const hasSourceListing = sourceListingTitle && sourceListingTitle !== "—";

  return (
    <section className="surface-panel border-hairline overflow-hidden rounded-2xl border">
      <div className="border-hairline flex flex-wrap items-start justify-between gap-4 border-b px-5 py-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-heading text-base font-semibold tracking-[-0.02em]">
              Đề xuất
            </h2>
            <span className="text-secondary border-hairline bg-subtle rounded-full border px-2.5 py-1 text-xs font-semibold">
              {candidates.length}
            </span>
          </div>
          <p className="text-secondary text-sm leading-6">
            {hasSourceListing
              ? `Danh sách các tin ${counterpartTypeLabel.toLowerCase()} đang được ghép với lead này.`
              : "Danh sách các đề xuất của lead."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onAddCandidate}
          className="gap-2"
        >
          <Plus className="size-3.5" />
          Thêm đề xuất
        </Button>
      </div>

      {candidates.length === 0 ? (
        <div className="px-5 py-12">
          <div className="border-hairline bg-app/40 rounded-2xl border border-dashed px-6 py-10 text-center">
            <p className="text-heading text-sm font-medium">
              Chưa có đề xuất nào cho lead này.
            </p>
            <p className="text-secondary mt-2 text-sm">
              Thêm một đề xuất mới để bắt đầu quá trình ghép lead.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-hairline divide-y">
          {candidates.map((match) => {
            const counterpart =
              source === "PROPERTY" ? match.rentRequest : match.property;
            const counterpartHref = counterpart?.slug
              ? source === "PROPERTY"
                ? `/can-thue/${counterpart.slug}`
                : `/cho-thue/${counterpart.slug}`
              : null;
            const isCandidate = match.status === "CANDIDATE";
            const isMatched = match.status === "MATCHED";
            const isRejected = match.status === "REJECTED";
            const isCounterpartMatched = counterpart?.isMatched ?? false;
            const counterpartContactName =
              counterpart?.contactName ?? "Chưa cập nhật";
            const counterpartContactPhone =
              counterpart?.contactPhone ?? "Chưa cập nhật";

            return (
              <article key={match.id} className="px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <AdminStatusBadge
                        tone={listingMatchStatusBadgeToneMap[match.status]}
                      >
                        {LISTING_MATCH_STATUS_LABEL_MAP[match.status]}
                      </AdminStatusBadge>
                      {isCandidate && isCounterpartMatched ? (
                        <span className="border-destructive/20 bg-danger-soft/70 text-danger rounded-full border px-2.5 py-1 text-xs font-medium">
                          Đã ghép ở lead khác
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      {counterpart ? (
                        counterpartHref ? (
                          <Link
                            href={counterpartHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-body hover:text-primary inline-flex items-start gap-1 text-base leading-6 font-semibold hover:underline"
                          >
                            <span className="min-w-0 flex-1 wrap-break-word">
                              {counterpart.title}
                            </span>
                          </Link>
                        ) : (
                          <p className="text-heading text-base leading-6 font-semibold">
                            {counterpart.title}
                          </p>
                        )
                      ) : (
                        <p className="text-secondary text-sm">
                          Không tìm thấy tin đối ứng.
                        </p>
                      )}

                      {counterpart ? (
                        <p className="text-secondary text-sm leading-6">
                          {[
                            `ID #${counterpart.id}`,
                            counterpartContactName,
                            counterpartContactPhone,
                          ].join(" · ")}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      <MetaTile
                        label="Ngày tạo"
                        value={formatDate(match.createdAt)}
                      />
                      <MetaTile
                        label="Phù hợp lúc"
                        value={
                          match.matchedAt
                            ? formatDate(match.matchedAt)
                            : "Chưa xác nhận"
                        }
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                    {isCandidate ? (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onPromote(match.id)}
                          disabled={updating || isCounterpartMatched}
                          className="gap-1.5"
                          title={
                            isCounterpartMatched
                              ? `${counterpartTypeLabel} này đã được ghép ở lead khác`
                              : undefined
                          }
                        >
                          <CheckCircle2 className="size-3.5" />
                          Phù hợp
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReject(match.id)}
                          disabled={updating}
                          className="gap-1.5"
                        >
                          <CircleX className="size-3.5" />
                          Không phù hợp
                        </Button>
                      </>
                    ) : null}

                    {isMatched ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updating}
                            className="gap-1.5"
                          >
                            <Undo2 className="size-3.5" />
                            Hủy ghép
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Hủy ghép đề xuất này?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tin cho thuê và tin cần thuê sẽ được bỏ ghép. Lead
                              sẽ quay về trạng thái chờ xử lý.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={updating}>
                              Hủy
                            </AlertDialogCancel>
                            <AlertDialogAction
                              disabled={updating}
                              onClick={() => onUnmatch(match.id)}
                            >
                              {updating ? "Đang hủy..." : "Xác nhận hủy ghép"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : null}

                    {isRejected ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updating}
                            className="text-destructive hover:text-destructive gap-1.5"
                          >
                            <X className="size-3.5" />
                            Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Xóa đề xuất này?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Đề xuất ID {match.id} sẽ bị xóa khỏi danh sách.
                              Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={updating}>
                              Hủy
                            </AlertDialogCancel>
                            <AlertDialogAction
                              disabled={updating}
                              onClick={() => onRemoveCandidate(match.id)}
                            >
                              {updating ? "Đang xóa..." : "Xác nhận xóa"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
