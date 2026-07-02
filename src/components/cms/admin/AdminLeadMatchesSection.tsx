"use client";

import Link from "next/link";
import { CheckCircle2, CircleX, Plus, Undo2, X } from "lucide-react";

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
  return (
    <section className="surface-panel border-hairline rounded-2xl border">
      <div className="border-hairline flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div className="space-y-1">
          <h2 className="text-heading text-base font-semibold">
            Đề xuất
            <span className="text-secondary font-normal">
              ({candidates.length})
            </span>
          </h2>
          <p className="text-secondary text-sm">
            {sourceListingTitle
              ? `Danh sách các tin ${counterpartTypeLabel.toLowerCase()} được đề xuất với lead này.`
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
        <div className="px-5 py-12 text-center">
          <p className="text-secondary text-sm">
            Chưa có đề xuất nào cho lead này.
          </p>
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
                        <span className="text-destructive text-xs font-medium">
                          Đã ghép ở lead khác
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      {counterpart ? (
                        counterpartHref ? (
                          <Link
                            href={counterpartHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-body hover:text-primary inline-flex items-start gap-1 text-base font-semibold hover:underline"
                          >
                            <span className="min-w-0 flex-1">
                              {counterpart.title}
                            </span>
                          </Link>
                        ) : (
                          <p className="text-heading text-base font-semibold">
                            {counterpart.title}
                          </p>
                        )
                      ) : (
                        <p className="text-secondary text-sm">
                          Không tìm thấy tin đối ứng.
                        </p>
                      )}

                      {counterpart && (
                        <p className="text-secondary text-sm">
                          ID:{" "}
                          <span className="text-body">#{counterpart.id}</span>
                          {" · "}
                          Họ và tên:{" "}
                          <span className="text-body">
                            {counterpart.contactName}
                          </span>
                          {" · "}
                          ĐT:{" "}
                          <span className="text-body">
                            {counterpart.contactPhone}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="text-secondary flex flex-wrap items-center gap-3 text-xs">
                      <span>Ngày tạo: {formatDate(match.createdAt)}</span>
                      {match.matchedAt ? (
                        <span>Phù hợp lúc: {formatDate(match.matchedAt)}</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {isCandidate ? (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onPromote(match.id)}
                          disabled={updating || isCounterpartMatched}
                          className="gap-1"
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
                          className="gap-1"
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
                            className="gap-1"
                          >
                            <Undo2 className="size-3.5" />
                            Huỷ ghép
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Huỷ ghép đề xuất này?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tin cho thuê và tin cần thuê sẽ được bỏ ghép. Lead
                              sẽ quay về trạng thái chờ xử lý.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={updating}>
                              Huỷ
                            </AlertDialogCancel>
                            <AlertDialogAction
                              disabled={updating}
                              onClick={() => onUnmatch(match.id)}
                            >
                              {updating ? "Đang huỷ..." : "Xác nhận huỷ ghép"}
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
                            className="text-destructive hover:text-destructive gap-1"
                          >
                            <X className="size-3.5" />
                            Xoá
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Xoá đề xuất này?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Đề xuất ID {match.id} sẽ bị xoá khỏi danh sách.
                              Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={updating}>
                              Huỷ
                            </AlertDialogCancel>
                            <AlertDialogAction
                              disabled={updating}
                              onClick={() => onRemoveCandidate(match.id)}
                            >
                              {updating ? "Đang xoá..." : "Xác nhận xoá"}
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
