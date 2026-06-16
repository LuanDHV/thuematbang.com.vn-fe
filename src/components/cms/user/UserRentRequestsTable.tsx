"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PUBLISH_STATUS_LABEL_MAP } from "@/constants/enum-options";
import { Copy, ExternalLink, MoreHorizontal, Pencil } from "lucide-react";

import AdminStatusBadge, {
  type AdminBadgeTone,
} from "@/components/cms/admin/AdminStatusBadge";
import { TablePaginationFooter } from "@/components/common/Pagination";
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
  formatDateDisplay,
  formatLocationParts,
  formatAreaValue,
  formatVndAmount,
} from "@/lib/format";
import { createPaginationChangeHandler } from "@/lib/pagination";
import type { RentRequest } from "@/types/rent-request";
import type { PublishStatus } from "@/types/enums";

type UserRentRequestsTableProps = {
  items: RentRequest[];
  currentPage: number;
  totalPages: number;
};

const statusToneMap: Record<PublishStatus, AdminBadgeTone> = {
  DRAFT: "muted",
  PUBLISHED: "success",
  ARCHIVED: "neutral",
};

function getPublicPath(item: RentRequest) {
  return `/can-thue/${item.slug}`;
}

function RentRequestActions({
  item,
  copied,
  onCopy,
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
        <DropdownMenuItem asChild>
          <Link href={`/quan-li-tai-khoan/cau-thue/${item.id}`}>
            <Pencil className="size-4" />
            Chỉnh sửa
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={getPublicPath(item)} target="_blank" rel="noreferrer">
            <ExternalLink className="size-4" />
            Mở trang public
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onCopy(item)}>
          <Copy className="size-4" />
          {copied ? "Đã sao chép" : "Sao chép link"}
        </DropdownMenuItem>
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
      <div className="border-b border-hairline px-4 py-4 md:px-5">
        <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
          Tin cần thuê của tôi
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Nhu cầu</TableHead>
            <TableHead className="w-[18%]">Danh mục</TableHead>
            <TableHead className="w-[18%]">Khu vực mong muốn</TableHead>
            <TableHead className="w-[12%]">Ngân sách</TableHead>
            <TableHead className="w-[12%]">Diện tích</TableHead>
            <TableHead className="w-[12%]">Trạng thái</TableHead>
            <TableHead className="w-[12%]">Khớp</TableHead>
            <TableHead className="w-[10%]">Ngày tạo</TableHead>
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
                  <TableCell className="align-top text-sm text-body">
                    {item.category?.name || "Chưa có danh mục"}
                  </TableCell>
                  <TableCell className="align-top text-sm text-body">
                    {formatLocationParts([
                      item.desiredWard?.name,
                      item.desiredProvince?.name,
                    ])}
                  </TableCell>
                  <TableCell className="align-top text-sm text-body">
                    {formatVndAmount(item.budget, "Đang cập nhật")}
                  </TableCell>
                  <TableCell className="align-top text-sm text-body">
                    {formatAreaValue(item.desiredArea)}
                  </TableCell>
                  <TableCell className="align-top">
                    <AdminStatusBadge tone={statusToneMap[item.status]}>
                      {PUBLISH_STATUS_LABEL_MAP[item.status]}
                    </AdminStatusBadge>
                  </TableCell>
                  <TableCell className="align-top">
                    <AdminStatusBadge tone={item.isMatched ? "success" : "muted"}>
                      {item.isMatched ? "Đã khớp" : "Chưa khớp"}
                    </AdminStatusBadge>
                  </TableCell>
                  <TableCell className="align-top text-sm text-body">
                    {formatDateDisplay(item.createdAt)}
                  </TableCell>
                  <TableCell className="align-top text-right">
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
                    Endpoint `/me/rent-requests` chưa trả về bản ghi nào.
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
          colSpan={8}
        />
      </Table>
    </section>
  );
}


