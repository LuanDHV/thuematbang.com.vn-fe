"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Copy, ExternalLink, MoreHorizontal } from "lucide-react";

import { TablePaginationFooter } from "@/components/common/Pagination";
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
import { createPaginationChangeHandler, formatDateDisplay } from "@/lib/utils";
import type { News } from "@/types/news";

type AdminNewsTableProps = {
  items: News[];
  currentPage: number;
  totalPages: number;
};

function getPublicPath(item: News) {
  return `/tin-tuc/${item.slug}`;
}

function NewsActions({
  item,
  copied,
  onCopy,
}: {
  item: News;
  copied: boolean;
  onCopy: (item: News) => void;
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

export default function AdminNewsTable({
  items,
  currentPage,
  totalPages,
}: AdminNewsTableProps) {
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

  const publishedCount = items.filter(
    (item) => item.status === "PUBLISHED",
  ).length;
  const featuredCount = items.filter((item) => item.isFeatured).length;
  const totalViews = items.reduce((sum, item) => sum + item.viewCount, 0);

  const handleCopy = async (item: News) => {
    const publicUrl = `${window.location.origin}${getPublicPath(item)}`;
    await navigator.clipboard.writeText(publicUrl);
    setCopiedSlug(item.slug);
    window.setTimeout(() => {
      setCopiedSlug((current) => (current === item.slug ? null : current));
    }, 1800);
  };

  return (
    <section className="space-y-5">
      <div className="surface-panel overflow-hidden">
        <div className="border-hairline border-b px-4 py-4 md:px-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
                Tin tức từ API
              </h2>
              <p className="text-secondary text-sm">
                Dùng cho module tin tức nội dung và marketing.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{publishedCount} đã đăng</Badge>
              <Badge variant="outline">{featuredCount} nổi bật</Badge>
              <Badge variant="outline">{totalViews} lượt xem</Badge>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32%]">Bài viết</TableHead>
              <TableHead className="w-[16%]">Danh mục</TableHead>
              <TableHead className="w-[12%]">Nổi bật</TableHead>
              <TableHead className="w-[12%]">Trạng thái</TableHead>
              <TableHead className="w-[12%]">Lượt xem</TableHead>
              <TableHead className="w-[12%]">Ngày tạo</TableHead>
              <TableHead className="w-[2%] text-right">Tác vụ</TableHead>
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
                    <TableCell className="align-top">
                      <span className="text-body text-sm">
                        {item.category?.name || "Chưa có danh mục"}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant="outline">{String(item.isFeatured)}</Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant="outline">{item.status}</Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className="text-body text-sm font-medium">
                        {item.viewCount}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className="text-body text-sm">
                        {formatDateDisplay(item.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <div className="flex justify-end">
                        <NewsActions
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
                      Endpoint hiện tại chưa trả về bài viết nào.
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
