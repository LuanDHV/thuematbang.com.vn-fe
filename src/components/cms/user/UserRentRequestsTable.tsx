"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ExternalLink, MoreHorizontal, Pencil } from "lucide-react";

import AdminStatusBadge, {
  type AdminBadgeTone,
} from "@/components/cms/admin/AdminStatusBadge";
import {
  Pagination,
  TablePaginationFooter,
} from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatAreaValue,
  formatDateDisplay,
  formatLocationParts,
  formatListingPrice,
} from "@/lib/format";
import { createPaginationChangeHandler } from "@/lib/pagination";
import { PUBLISH_STATUS_LABEL_MAP } from "@/constants/enum-options";
import type { ListingStatus } from "@/types/enums";
import type { RentRequest } from "@/types/rent-request";

type UserRentRequestsTableProps = {
  items: RentRequest[];
  currentPage: number;
  totalPages: number;
};

const statusToneMap: Record<ListingStatus, AdminBadgeTone> = {
  DRAFT: "muted",
  PENDING: "warning",
  PUBLISHED: "success",
  REJECTED: "danger",
  ARCHIVED: "neutral",
};

function getPublicPath(item: RentRequest) {
  return `/can-thue/${item.slug}`;
}

function RentRequestMobileCard({
  item,
  copied,
  onCopy,
}: {
  item: RentRequest;
  copied: boolean;
  onCopy: (item: RentRequest) => void;
}) {
  return (
    <article className="surface-card space-y-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <Link
            href={getPublicPath(item)}
            target="_blank"
            rel="noreferrer"
            className="text-heading hover:text-primary line-clamp-2 text-sm font-semibold transition-colors"
          >
            {item.title}
          </Link>
          <p className="text-secondary truncate text-xs">{item.slug}</p>
        </div>

        <RentRequestActions item={item} copied={copied} onCopy={onCopy} />
      </div>

      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-secondary text-xs font-medium">Danh mục</p>
          <p className="text-body">
            {item.category?.name || "Chưa có danh mục"}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-secondary text-xs font-medium">
            Khu vực mong muốn
          </p>
          <p className="text-body">
            {formatLocationParts([
              item.desiredWard?.name,
              item.desiredProvince?.name,
            ])}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-secondary text-xs font-medium">Ngân sách</p>
          <p className="text-body">
            {formatListingPrice(item.budget, {
              fallback: "Đang cập nhật",
              amount: item.budgetAmount,
              unit: item.budgetUnit,
              negotiable: item.isNegotiable,
              negotiableLabel: "Thỏa thuận",
            })}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-secondary text-xs font-medium">Diện tích</p>
          <p className="text-body">{formatAreaValue(item.desiredArea)}</p>
        </div>

        <div className="space-y-1">
          <p className="text-secondary text-xs font-medium">Ngày tạo</p>
          <p className="text-body">{formatDateDisplay(item.createdAt)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <AdminStatusBadge tone={item.isMatched ? "success" : "muted"}>
          {item.isMatched ? "Đã khớp" : "Chưa khớp"}
        </AdminStatusBadge>
        <AdminStatusBadge tone={statusToneMap[item.status]}>
          {PUBLISH_STATUS_LABEL_MAP[item.status]}
        </AdminStatusBadge>
      </div>
    </article>
  );
}

function RentRequestActions({
  item,
}: {
  item: RentRequest;
  copied: boolean;
  onCopy: (item: RentRequest) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Tác vụ cho ${item.title}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {item.status === "PUBLISHED" ? (
          <DropdownMenuItem asChild>
            <Link href={getPublicPath(item)} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              Xem bài public
            </Link>
          </DropdownMenuItem>
        ) : null}
        {item.status === "REJECTED" ? (
          <DropdownMenuItem asChild>
            <Link href={`/quan-li-tai-khoan/can-thue/${item.id}`}>
              <Pencil className="size-4" />
              Chỉnh sửa
            </Link>
          </DropdownMenuItem>
        ) : item.status === "PENDING" || item.status === "DRAFT" ? (
          <DropdownMenuItem asChild>
            <Link href={`/quan-li-tai-khoan/can-thue/${item.id}`}>
              <Pencil className="size-4" />
              Xem chi tiết
            </Link>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function UserRentRequestsTable({
  items,
  currentPage,
  totalPages,
}: UserRentRequestsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  const handleCopy = async (item: RentRequest) => {
    const publicUrl = `${window.location.origin}${getPublicPath(item)}`;
    await navigator.clipboard.writeText(publicUrl);
    setCopiedSlug(item.slug);
    window.setTimeout(() => {
      setCopiedSlug((current) => (current === item.slug ? null : current));
    }, 1800);
  };

  return (
    <section className="surface-panel overflow-hidden">
      <div className="border-hairline border-b px-4 py-4 md:px-5">
        <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
          Tin cần thuê của tôi
        </h2>
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Nhu cầu</TableHead>
              <TableHead className="w-1/6">Danh mục</TableHead>
              <TableHead className="w-1/6">Khu vực mong muốn</TableHead>
              <TableHead className="w-24">Ngân sách</TableHead>
              <TableHead className="w-24">Diện tích</TableHead>
              <TableHead className="w-24">Ngày tạo</TableHead>
              <TableHead className="w-24">Đã khớp</TableHead>
              <TableHead className="w-24">Trạng thái</TableHead>
              <TableHead className="text-right">Tác vụ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => {
                const isCopied = copiedSlug === item.slug;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="align-top">
                      <div className="space-y-1">
                        <Link
                          href={getPublicPath(item)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-heading hover:text-primary line-clamp-2 font-semibold transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-secondary text-xs">{item.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-body align-top text-sm">
                      {item.category?.name || "Chưa có danh mục"}
                    </TableCell>
                    <TableCell className="text-body align-top text-sm">
                      {formatLocationParts([
                        item.desiredWard?.name,
                        item.desiredProvince?.name,
                      ])}
                    </TableCell>
                    <TableCell className="text-body align-top text-sm">
                      {formatListingPrice(item.budget, {
                        fallback: "Đang cập nhật",
                        amount: item.budgetAmount,
                        unit: item.budgetUnit,
                        negotiable: item.isNegotiable,
                        negotiableLabel: "Thỏa thuận",
                      })}
                    </TableCell>
                    <TableCell className="text-body align-top text-sm">
                      {formatAreaValue(item.desiredArea)}
                    </TableCell>
                    <TableCell className="text-body align-top text-sm">
                      {formatDateDisplay(item.createdAt)}
                    </TableCell>

                    <TableCell className="align-top">
                      <AdminStatusBadge
                        tone={item.isMatched ? "success" : "muted"}
                      >
                        {item.isMatched ? "Đã khớp" : "Chưa khớp"}
                      </AdminStatusBadge>
                    </TableCell>
                    <TableCell className="align-top">
                      <AdminStatusBadge tone={statusToneMap[item.status]}>
                        {PUBLISH_STATUS_LABEL_MAP[item.status]}
                      </AdminStatusBadge>
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <div className="flex justify-end">
                        <RentRequestActions
                          item={item}
                          copied={isCopied}
                          onCopy={handleCopy}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="py-14 text-center">
                  <div className="space-y-2">
                    <p className="text-heading text-base font-semibold">
                      Không có dữ liệu
                    </p>
                    <p className="text-secondary text-sm">
                      Chưa có bản ghi nào.
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
            colSpan={9}
          />
        </Table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {items.length > 0 ? (
          items.map((item) => {
            const isCopied = copiedSlug === item.slug;
            return (
              <RentRequestMobileCard
                key={item.id}
                item={item}
                copied={isCopied}
                onCopy={handleCopy}
              />
            );
          })
        ) : (
          <div className="surface-card px-4">
            <div className="space-y-2 py-14 text-center">
              <p className="text-heading text-base font-semibold">
                Không có dữ liệu
              </p>
              <p className="text-secondary text-sm">Chưa có bản ghi nào.</p>
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
