"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Copy, ExternalLink, MoreHorizontal } from "lucide-react";

import AdminPriorityBadge, {
  type AdminPriorityTone,
} from "@/components/cms/admin/AdminPriorityBadge";
import AdminStatusBadge, {
  publishStatusBadgeToneMap,
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
  createPaginationChangeHandler,
  formatDateDisplay,
  formatLocationParts,
  formatNegotiablePrice,
} from "@/lib/utils";
import type { PropertyPriority, PublishStatus } from "@/types/enums";
import type { Property } from "@/types/property";

type UserPropertiesTableProps = {
  items: Property[];
  currentPage: number;
  totalPages: number;
};

const priorityToneMap: Record<PropertyPriority, AdminPriorityTone> = {
  FREE: "free",
  STANDARD: "standard",
  PREMIUM: "premium",
};

const priorityLabelMap: Record<PropertyPriority, string> = {
  FREE: "Miễn phí",
  STANDARD: "Tiêu chuẩn",
  PREMIUM: "Cao cấp",
};

const statusLabelMap: Record<PublishStatus, string> = {
  DRAFT: "Nháp",
  PUBLISHED: "Đã đăng",
  ARCHIVED: "Lưu trữ",
};

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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function UserPropertiesTable({
  items,
  currentPage,
  totalPages,
}: UserPropertiesTableProps) {
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

  const handleCopy = async (item: Property) => {
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
          Tin cho thuê của tôi
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Tin cho thuê</TableHead>
            <TableHead className="w-[18%]">Danh mục</TableHead>
            <TableHead className="w-[18%]">Khu vực</TableHead>
            <TableHead className="w-[12%]">Giá</TableHead>
            <TableHead className="w-[12%]">Loại tin</TableHead>
            <TableHead className="w-[12%]">Trạng thái</TableHead>
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
                    {formatLocationParts([item.ward?.name, item.province?.name])}
                  </TableCell>
                  <TableCell className="align-top text-sm text-body">
                    {formatNegotiablePrice(item.price, item.isNegotiable)}
                  </TableCell>
                  <TableCell className="align-top">
                    <AdminPriorityBadge tone={priorityToneMap[item.priorityStatus]}>
                      {priorityLabelMap[item.priorityStatus]}
                    </AdminPriorityBadge>
                  </TableCell>
                  <TableCell className="align-top">
                    <AdminStatusBadge tone={publishStatusBadgeToneMap[item.status]}>
                      {statusLabelMap[item.status]}
                    </AdminStatusBadge>
                  </TableCell>
                  <TableCell className="align-top text-sm text-body">
                    {formatDateDisplay(item.createdAt)}
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
              <TableCell colSpan={8} className="py-14 text-center">
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
          colSpan={8}
        />
      </Table>
    </section>
  );
}
