"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import StatusBadge, {
  leadStatusBadgeToneMap,
  listingMatchStatusBadgeToneMap,
} from "@/components/cms/shared/StatusBadge";
import {
  Pagination,
  TablePaginationFooter,
} from "@/components/common/Pagination";
import {
  LEAD_STATUS_LABEL_MAP,
  LISTING_MATCH_STATUS_LABEL_MAP,
} from "@/constants/enum-options";
import { formatDateDisplay } from "@/lib/format";
import { createPaginationChangeHandler } from "@/lib/pagination";
import type { Lead } from "@/types/lead";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  items: Lead[];
  currentPage: number;
  totalPages: number;
  title: string;
  detailBasePath?: string;
};

function sourceTitle(item: Lead) {
  return item.property?.title ?? item.rentRequest?.title ?? "-";
}

function sourceCode(item: Lead) {
  return item.property?.displayCode ?? item.rentRequest?.displayCode ?? "-";
}

function proposalSummary(item: Lead) {
  const proposals = item.listingMatches ?? [];
  if (!proposals.length) return "0";
  const won =
    proposals.find((proposal) => proposal.status === "DEAL_WON") ??
    proposals.find((proposal) => proposal.status === "NEGOTIATING") ??
    proposals.find((proposal) => proposal.status === "QUALIFIED");
  if (won) return LISTING_MATCH_STATUS_LABEL_MAP[won.status];
  return String(proposals.length);
}

export default function UserMarketplaceCasesTable({
  items,
  currentPage,
  totalPages,
  title,
  detailBasePath = "/quan-li-tai-khoan/ho-so",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  return (
    <section className="surface-panel overflow-hidden">
      <div className="border-hairline border-b px-4 py-4 md:px-5">
        <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
          {title}
        </h2>
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Mã tin</TableHead>
              <TableHead>Thông tin liên hệ</TableHead>
              <TableHead>Tin đăng </TableHead>
              <TableHead className="w-40">Trạng thái</TableHead>
              <TableHead className="w-32">Số đề xuất</TableHead>
              <TableHead className="w-32">Ngày tạo</TableHead>
              <TableHead className="w-32 text-right">Tác vụ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length ? (
              items.map((item) => (
                <TableRow key={item.id} className="cursor-pointer">
                  <TableCell className="text-sm font-medium">
                    {sourceCode(item)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {item.fullName}
                      <p className="text-secondary text-xs">{item.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-body text-sm">{sourceTitle(item)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={leadStatusBadgeToneMap[item.status]}>
                      {LEAD_STATUS_LABEL_MAP[item.status]}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {proposalSummary(item)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDateDisplay(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`${detailBasePath}/${item.id}`}
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Xem chi tiết
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-14 text-center">
                  <div className="space-y-2">
                    <p className="text-heading text-base font-semibold">
                      Không có hồ sơ
                    </p>
                    <p className="text-secondary text-sm">
                      Chưa có dữ liệu phù hợp với tab này.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TablePaginationFooter
            page={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
            colSpan={7}
          />
        </Table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {items.length ? (
          items.map((item) => (
            <article
              key={item.id}
              className="surface-card cursor-pointer space-y-3 p-4"
              onClick={() => router.push(`${detailBasePath}/${item.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Link
                    href={`${detailBasePath}/${item.id}`}
                    className="text-heading hover:text-primary text-sm font-semibold transition-colors"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {item.fullName}
                  </Link>
                  <p className="text-secondary text-xs">{item.phone}</p>
                </div>
                <StatusBadge tone={leadStatusBadgeToneMap[item.status]}>
                  {LEAD_STATUS_LABEL_MAP[item.status]}
                </StatusBadge>
              </div>
              <div className="grid gap-2 text-sm">
                <p>
                  <span className="text-secondary">Mã tin:</span>{" "}
                  {sourceCode(item)}
                </p>
                <p>
                  <span className="text-secondary">Tin gốc:</span>{" "}
                  {sourceTitle(item)}
                </p>
                <p>
                  <span className="text-secondary">Số đề xuất:</span>{" "}
                  {proposalSummary(item)}
                </p>
                <p>
                  <span className="text-secondary">Ngày tạo:</span>{" "}
                  {formatDateDisplay(item.createdAt)}
                </p>
                <p>
                  <Link
                    href={`${detailBasePath}/${item.id}`}
                    className="text-primary text-sm font-medium"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Xem chi tiết
                  </Link>
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="surface-card px-4">
            <div className="space-y-2 py-14 text-center">
              <p className="text-heading text-base font-semibold">
                Không có hồ sơ
              </p>
              <p className="text-secondary text-sm">
                Chưa có dữ liệu phù hợp với tab này.
              </p>
            </div>
          </div>
        )}

        {totalPages > 1 ? (
          <div className="pt-2">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
