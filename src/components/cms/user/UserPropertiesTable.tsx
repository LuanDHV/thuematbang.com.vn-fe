"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Copy, ExternalLink, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import type { Property } from "@/types/property";
import type { PublishStatus } from "@/types/enums";

type UserPropertiesTableProps = {
  items: Property[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

const currencyFormatter = new Intl.NumberFormat("vi-VN");
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatCurrency(item: Property) {
  if (item.isNegotiable) return "Thỏa thuận";
  if (typeof item.price !== "number") return "Chưa cập nhật";
  return `${currencyFormatter.format(item.price)} đ`;
}

function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}

function getStatusLabel(status: PublishStatus) {
  switch (status) {
    case "PUBLISHED":
      return "Đã đăng";
    case "DRAFT":
      return "Bản nháp";
    case "ARCHIVED":
      return "Đã lưu trữ";
    default:
      return status;
  }
}

function getStatusVariant(status: PublishStatus) {
  switch (status) {
    case "PUBLISHED":
      return "success";
    case "DRAFT":
      return "warning";
    case "ARCHIVED":
      return "muted";
    default:
      return "outline";
  }
}

function getPublicPath(item: Property) {
  return `/cho-thue/${item.slug}`;
}

function PropertyActions({
  item,
  copied,
  onCopy,
}: {
  item: Property;
  copied: boolean;
  onCopy: (item: Property) => void;
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
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/api/v1/properties/slug/${encodeURIComponent(item.slug)}`} target="_blank" rel="noreferrer">
            <ExternalLink className="size-4" />
            Xem API
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function UserPropertiesTable({
  items,
  currentPage,
  totalPages,
  totalItems,
}: UserPropertiesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      published: items.filter((item) => item.status === "PUBLISHED").length,
      negotiable: items.filter((item) => item.isNegotiable).length,
    }),
    [items],
  );

  const handleCopy = async (item: Property) => {
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
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="surface-card p-4">
          <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
            Tổng tin
          </p>
          <p className="text-heading mt-2 text-2xl font-semibold tracking-[-0.03em]">
            {totalItems}
          </p>
        </article>
        <article className="surface-card p-4">
          <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
            Đang hiển thị
          </p>
          <p className="text-heading mt-2 text-2xl font-semibold tracking-[-0.03em]">
            {items.length}
          </p>
        </article>
        <article className="surface-card p-4">
          <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
            Đã đăng
          </p>
          <p className="text-heading mt-2 text-2xl font-semibold tracking-[-0.03em]">
            {stats.published}
          </p>
        </article>
        <article className="surface-card p-4">
          <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
            Có thương lượng
          </p>
          <p className="text-heading mt-2 text-2xl font-semibold tracking-[-0.03em]">
            {stats.negotiable}
          </p>
        </article>
      </div>

      <div className="surface-panel overflow-hidden">
        <div className="border-b border-hairline px-4 py-4 md:px-5">
          <div className="space-y-2">
            <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
              Tin cho thuê của tôi
            </h2>
            <p className="text-secondary text-sm">
              Dữ liệu thật từ endpoint `/me/properties`.
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Tin đăng</TableHead>
              <TableHead className="w-[18%]">Danh mục</TableHead>
              <TableHead className="w-[18%]">Khu vực</TableHead>
              <TableHead className="w-[12%]">Giá</TableHead>
              <TableHead className="w-[12%]">Trạng thái</TableHead>
              <TableHead className="w-[10%]">Ngày tạo</TableHead>
              <TableHead className="text-right">Tác vụ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => {
                const isCopied = copiedSlug === item.slug;
                const locationParts = [
                  item.ward?.name,
                  item.province?.name,
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
                    <TableCell className="align-top text-sm text-body">
                      {item.category?.name || "Chưa có danh mục"}
                    </TableCell>
                    <TableCell className="align-top text-sm text-body">
                      {locationParts.length > 0
                        ? locationParts.join(", ")
                        : "Chưa cập nhật"}
                    </TableCell>
                    <TableCell className="align-top text-sm text-body">
                      {formatCurrency(item)}
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant={getStatusVariant(item.status)}>
                        {getStatusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top text-sm text-body">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <div className="flex justify-end">
                        <PropertyActions
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
                      Endpoint `/me/properties` chưa trả về bản ghi nào.
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
