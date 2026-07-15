"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArchiveRestore,
  EyeOff,
  MoreHorizontal,
  Pencil,
} from "lucide-react";

import { updatePropertyAction } from "@/actions/property.actions";
import PriorityBadge, {
  type PriorityTone,
} from "@/components/cms/shared/PriorityBadge";
import StatusBadge, {
  publishStatusBadgeToneMap,
} from "@/components/cms/shared/StatusBadge";
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
  PROPERTY_PRIORITY_LABEL_MAP,
  PUBLISH_STATUS_LABEL_MAP,
} from "@/constants/enum-options";
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

const priorityToneMap: Record<PropertyPriority, PriorityTone> = {
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
  onToggleVisibility,
  isUpdating,
}: {
  item: Property;
  copied: boolean;
  onCopy: (item: Property) => void;
  onToggleVisibility: (item: Property) => Promise<void>;
  isUpdating: boolean;
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

        <PropertyActions
          item={item}
          copied={copied}
          onCopy={onCopy}
          onToggleVisibility={onToggleVisibility}
          isUpdating={isUpdating}
        />
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
        <PriorityBadge tone={priorityToneMap[item.priorityStatus]}>
          {PROPERTY_PRIORITY_LABEL_MAP[item.priorityStatus]}
        </PriorityBadge>
        <StatusBadge tone={publishStatusBadgeToneMap[item.status]}>
          {PUBLISH_STATUS_LABEL_MAP[item.status]}
        </StatusBadge>
      </div>
    </article>
  );
}

function PropertyActions({
  item,
  onToggleVisibility,
  isUpdating,
}: {
  item: Property;
  copied: boolean;
  onCopy: (item: Property) => void;
  onToggleVisibility: (item: Property) => Promise<void>;
  isUpdating: boolean;
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
        {item.status === "PUBLISHED" || item.status === "ARCHIVED" ? (
          <DropdownMenuItem
            disabled={isUpdating}
            onSelect={(event) => {
              event.preventDefault();
              void onToggleVisibility(item);
            }}
          >
            {item.status === "PUBLISHED" ? (
              <EyeOff className="size-4" />
            ) : (
              <ArchiveRestore className="size-4" />
            )}
            {item.status === "PUBLISHED" ? "Ẩn tin" : "Hiện tin"}
          </DropdownMenuItem>
        ) : null}
        {item.status === "REJECTED" ||
        item.status === "PUBLISHED" ||
        item.status === "ARCHIVED" ? (
          <DropdownMenuItem asChild>
            <Link href={`/quan-li-tai-khoan/cho-thue/${item.id}`}>
              <Pencil className="size-4" />
              Chỉnh sửa
            </Link>
          </DropdownMenuItem>
        ) : item.status === "PENDING" || item.status === "DRAFT" ? (
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
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const copyResetTimerRef = useRef<number | null>(null);
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current !== null) {
        window.clearTimeout(copyResetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async (item: Property) => {
    const publicUrl = `${window.location.origin}${getPublicPath(item)}`;
    await navigator.clipboard.writeText(publicUrl);
    setCopiedSlug(item.slug);
    if (copyResetTimerRef.current !== null) {
      window.clearTimeout(copyResetTimerRef.current);
    }
    copyResetTimerRef.current = window.setTimeout(() => {
      setCopiedSlug((current) => (current === item.slug ? null : current));
      copyResetTimerRef.current = null;
    }, 1800);
  };

  const handleToggleVisibility = async (item: Property) => {
    const nextStatus = item.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";

    setUpdatingId(item.id);
    try {
      await updatePropertyAction(item.id, { status: nextStatus });
      router.refresh();
    } finally {
      setUpdatingId((current) => (current === item.id ? null : current));
    }
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
                      <PriorityBadge
                        tone={priorityToneMap[item.priorityStatus]}
                      >
                        {PROPERTY_PRIORITY_LABEL_MAP[item.priorityStatus]}
                      </PriorityBadge>
                    </TableCell>
                    <TableCell className="align-top">
                      <StatusBadge
                        tone={publishStatusBadgeToneMap[item.status]}
                      >
                        {PUBLISH_STATUS_LABEL_MAP[item.status]}
                      </StatusBadge>
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
                          onToggleVisibility={handleToggleVisibility}
                          isUpdating={updatingId === item.id}
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
                onToggleVisibility={handleToggleVisibility}
                isUpdating={updatingId === item.id}
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
