"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { updatePropertyAction } from "@/actions/property.actions";
import {
  PROPERTY_PRIORITY_LABEL_MAP,
  PUBLISH_STATUS_LABEL_MAP,
} from "@/constants/enum-options";
import { ExternalLink, EyeOff, MoreHorizontal, Pencil } from "lucide-react";

import AdminPriorityBadge, {
  type AdminPriorityTone,
} from "@/components/cms/admin/AdminPriorityBadge";
import AdminStatusBadge, {
  publishStatusBadgeToneMap,
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
  formatDateDisplay,
  formatLocationParts,
  formatNegotiablePrice,
} from "@/lib/format";
import { createPaginationChangeHandler } from "@/lib/pagination";
import type { PropertyPriority } from "@/types/enums";
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

function getPublicPath(item: Property) {
  return `/cho-thue/${item.slug}`;
}

function PropertyMobileCard({
  item,
  copied,
  onCopy,
}: {
  item: Property;
  copied: boolean;
  onCopy: (item: Property) => void;
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

        <PropertyActions item={item} copied={copied} onCopy={onCopy} />
      </div>

      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-secondary text-xs font-medium">Danh mục</p>
          <p className="text-body">
            {item.category?.name || "Chưa có danh mục"}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-secondary text-xs font-medium">Khu vực</p>
          <p className="text-body">
            {formatLocationParts([item.ward?.name, item.province?.name])}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-secondary text-xs font-medium">Giá</p>
          <p className="text-body">
            {formatNegotiablePrice(item.price, item.isNegotiable, {
              amount: item.priceAmount,
              unit: item.priceUnit,
            })}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-secondary text-xs font-medium">Ngày tạo</p>
          <p className="text-body">{formatDateDisplay(item.createdAt)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <AdminPriorityBadge tone={priorityToneMap[item.priorityStatus]}>
          {PROPERTY_PRIORITY_LABEL_MAP[item.priorityStatus]}
        </AdminPriorityBadge>
        <AdminStatusBadge tone={publishStatusBadgeToneMap[item.status]}>
          {PUBLISH_STATUS_LABEL_MAP[item.status]}
        </AdminStatusBadge>
      </div>
    </article>
  );
}

function PropertyActions({
  item,
}: {
  item: Property;
  copied: boolean;
  onCopy: (item: Property) => void;
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
          <>
            <DropdownMenuItem asChild>
              <Link href={getPublicPath(item)} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" />
                Xem bài public
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={async () => {
                await updatePropertyAction(item.id, { status: "ARCHIVED" });
                window.location.reload();
              }}
            >
              <EyeOff className="size-4" />
              Ẩn tin
            </DropdownMenuItem>
          </>
        ) : null}
        {item.status === "REJECTED" ? (
          <DropdownMenuItem asChild>
            <Link href={`/quan-li-tai-khoan/cho-thue/${item.id}`}>
              <Pencil className="size-4" />
              Chỉnh sửa
            </Link>
          </DropdownMenuItem>
        ) : item.status === "PENDING" ||
          item.status === "ARCHIVED" ||
          item.status === "DRAFT" ? (
          <DropdownMenuItem asChild>
            <Link href={`/quan-li-tai-khoan/cho-thue/${item.id}`}>
              <Pencil className="size-4" />
              Xem chi tiết
            </Link>
          </DropdownMenuItem>
        ) : null}
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
      <div className="border-hairline border-b px-4 py-4 md:px-5">
        <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
          Tin cho thuê của tôi
        </h2>
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Tin cho thuê</TableHead>
              <TableHead className="w-1/6">Danh mục</TableHead>
              <TableHead className="w-1/6">Khu vực</TableHead>
              <TableHead className="w-24">Giá</TableHead>
              <TableHead className="w-24">Loại tin</TableHead>
              <TableHead className="w-24">Trạng thái</TableHead>
              <TableHead className="w-24">Ngày tạo</TableHead>
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
                        item.ward?.name,
                        item.province?.name,
                      ])}
                    </TableCell>
                    <TableCell className="text-body align-top text-sm">
                      {formatNegotiablePrice(item.price, item.isNegotiable, {
                        amount: item.priceAmount,
                        unit: item.priceUnit,
                      })}
                    </TableCell>
                    <TableCell className="align-top">
                      <AdminPriorityBadge
                        tone={priorityToneMap[item.priorityStatus]}
                      >
                        {PROPERTY_PRIORITY_LABEL_MAP[item.priorityStatus]}
                      </AdminPriorityBadge>
                    </TableCell>
                    <TableCell className="align-top">
                      <AdminStatusBadge
                        tone={publishStatusBadgeToneMap[item.status]}
                      >
                        {PUBLISH_STATUS_LABEL_MAP[item.status]}
                      </AdminStatusBadge>
                    </TableCell>
                    <TableCell className="text-body align-top text-sm">
                      {formatDateDisplay(item.createdAt)}
                    </TableCell>
                    <TableCell className="text-right align-top">
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
            colSpan={8}
          />
        </Table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {items.length > 0 ? (
          items.map((item) => {
            const isCopied = copiedSlug === item.slug;

            return (
              <PropertyMobileCard
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
