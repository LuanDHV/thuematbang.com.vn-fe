"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Copy, ExternalLink, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { TablePaginationFooter } from "@/components/common/Pagination";
import type { RentRequest } from "@/types/rent-request";
import type { RentRequestStatus } from "@/types/enums";

type AdminRentRequestsTableProps = {
  items: RentRequest[];
  currentPage: number;
  totalPages: number;
};

const currencyFormatter = new Intl.NumberFormat("vi-VN");
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatBudget(min?: number | null, max?: number | null) {
  if (typeof min !== "number" && typeof max !== "number") return "Chưa cập nhật";
  if (min && max) return `${currencyFormatter.format(min)} - ${currencyFormatter.format(max)} đ`;
  if (min) return `Từ ${currencyFormatter.format(min)} đ`;
  return `Đến ${currencyFormatter.format(max as number)} đ`;
}

function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}

function getStatusLabel(status: RentRequestStatus) {
  switch (status) {
    case "ACTIVE":
      return "Đang mở";
    case "MATCHED":
      return "Đã khớp";
    case "CLOSED":
      return "Đã đóng";
    case "EXPIRED":
      return "Hết hạn";
    default:
      return status;
  }
}

function getStatusVariant(status: RentRequestStatus) {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "MATCHED":
      return "default";
    case "CLOSED":
      return "muted";
    case "EXPIRED":
      return "warning";
    default:
      return "outline";
  }
}

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
        <Button variant="ghost" size="icon-sm" aria-label={`Tác vụ cho ${item.title}`}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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

export default function AdminRentRequestsTable({
  items,
  currentPage,
  totalPages,
}: AdminRentRequestsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const activeCount = items.filter((item) => item.status === "ACTIVE").length;
  const featuredCount = items.filter((item) => item.isFeatured).length;

  const handleCopy = async (item: RentRequest) => {
    const publicUrl = `${window.location.origin}${getPublicPath(item)}`;
    await navigator.clipboard.writeText(publicUrl);
    setCopiedSlug(item.slug);
    window.setTimeout(() => {
      setCopiedSlug((current) => (current === item.slug ? null : current));
    }, 1800);
  };

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (page <= 1) nextParams.delete("page");
    else nextParams.set("page", String(page));

    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <section className="space-y-5">
      <div className="surface-panel overflow-hidden">
        <div className="border-b border-hairline px-4 py-4 md:px-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
                Nhu cầu cần thuê từ API
              </h2>
              <p className="text-secondary text-sm">
                Dùng chung pattern table/action với các module admin khác.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{activeCount} đang mở</Badge>
              <Badge variant="outline">{featuredCount} nổi bật</Badge>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[28%]">Nhu cầu</TableHead>
              <TableHead className="w-[16%]">Danh mục</TableHead>
              <TableHead className="w-[18%]">Khu vực mong muốn</TableHead>
              <TableHead className="w-[12%]">Ngân sách</TableHead>
              <TableHead className="w-[12%]">Trạng thái</TableHead>
              <TableHead className="w-[12%]">Ngày tạo</TableHead>
              <TableHead className="w-[2%] text-right">Tác vụ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => {
                const isCopied = copiedSlug === item.slug;
                const locationParts = [
                  item.desiredWard?.name,
                  item.desiredProvince?.name,
                ].filter(Boolean);

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
                    <TableCell className="align-top">
                      <div className="space-y-1">
                        <span className="text-body text-sm">
                          {item.category?.name || "Chưa có danh mục"}
                        </span>
                        {item.isFeatured ? (
                          <Badge variant="success" className="w-fit">
                            Nổi bật
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className="text-body text-sm">
                        {locationParts.length > 0
                          ? locationParts.join(", ")
                          : "Chưa cập nhật"}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className="text-body text-sm font-medium">
                        {formatBudget(item.minBudget, item.maxBudget)}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant={getStatusVariant(item.status)}>
                        {getStatusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className="text-body text-sm">
                        {formatDate(item.createdAt)}
                      </span>
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
                <TableCell colSpan={7} className="py-14 text-center">
                  <div className="space-y-2">
                    <p className="text-heading text-base font-semibold">
                      Không có dữ liệu
                    </p>
                    <p className="text-secondary text-sm">
                      Endpoint hiện tại chưa trả về nhu cầu nào.
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
    </section>
  );
}
