"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePaginationFooter } from "@/components/common/Pagination";
import {
  createPaginationChangeHandler,
  formatDateDisplay,
} from "@/lib/utils";
import type { SeoContent } from "@/types/seo-content";

type AdminSeoContentsTableProps = {
  items: SeoContent[];
  currentPage: number;
  totalPages: number;
};

function stripHtml(value?: string | null) {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength = 140) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}…`;
}

function formatPageLabel(page: string) {
  return page.replace(/-/g, " ");
}

export default function AdminSeoContentsTable({
  items,
  currentPage,
  totalPages,
}: AdminSeoContentsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  const withSeoCount = items.filter((item) => Boolean(item.seoContent)).length;
  const withFaqCount = items.filter(
    (item) => Boolean(item.faqTitle || item.faqDescription),
  ).length;

  return (
    <section className="space-y-5">
      <div className="surface-panel overflow-hidden">
        <div className="border-hairline border-b px-4 py-4 md:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
                Nội dung SEO
              </h2>
              <p className="text-secondary mt-1 text-sm">
                Kiểm tra nội dung SEO, tiêu đề FAQ và mô tả theo từng page.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{items.length} page</Badge>
              <Badge variant="outline">{withSeoCount} có SEO</Badge>
              <Badge variant="secondary">{withFaqCount} có FAQ</Badge>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[16%]">Page</TableHead>
              <TableHead className="w-[34%]">SEO content</TableHead>
              <TableHead className="w-[18%]">FAQ title</TableHead>
              <TableHead className="w-[22%]">FAQ description</TableHead>
              <TableHead className="w-[10%]">Cập nhật</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <p className="text-heading text-sm font-semibold">
                        {formatPageLabel(item.page)}
                      </p>
                      <p className="text-secondary text-xs">{item.page}</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="text-body text-sm leading-6">
                      {item.seoContent
                        ? truncate(stripHtml(item.seoContent))
                        : "Chưa có SEO content"}
                    </p>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="text-body text-sm leading-6">
                      {item.faqTitle || "Chưa có tiêu đề FAQ"}
                    </p>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="text-body text-sm leading-6">
                      {item.faqDescription || "Chưa có mô tả FAQ"}
                    </p>
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm">
                      {formatDateDisplay(item.updatedAt)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-14 text-center">
                  <div className="space-y-2">
                    <p className="text-heading text-base font-semibold">
                      Không có dữ liệu
                    </p>
                    <p className="text-secondary text-sm">
                      Endpoint seo-contents hiện chưa trả về bản ghi nào.
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
            colSpan={5}
          />
        </Table>
      </div>
    </section>
  );
}
