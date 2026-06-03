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
import type { FaqItem } from "@/types/faq";

type AdminFaqsTableProps = {
  items: FaqItem[];
  currentPage: number;
  totalPages: number;
};

function truncate(value: string, maxLength = 120) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}…`;
}

export default function AdminFaqsTable({
  items,
  currentPage,
  totalPages,
}: AdminFaqsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  const pages = new Set(items.map((item) => item.page)).size;

  return (
    <section className="space-y-5">
      <div className="surface-panel overflow-hidden">
        <div className="border-hairline border-b px-4 py-4 md:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
                FAQ theo trang
              </h2>
              <p className="text-secondary mt-1 text-sm">
                Danh sách câu hỏi thường gặp, nội dung trả lời và thứ tự hiển thị.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{items.length} mục</Badge>
              <Badge variant="outline">{pages} trang</Badge>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[12%]">Trang</TableHead>
              <TableHead className="w-[30%]">Câu hỏi</TableHead>
              <TableHead className="w-[32%]">Trả lời</TableHead>
              <TableHead className="w-[10%]">Thứ tự</TableHead>
              <TableHead className="w-[16%]">Cập nhật</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="align-top">
                    <span className="text-body text-sm">{item.page}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="text-heading text-sm font-semibold">
                      {item.question}
                    </p>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="text-body text-sm leading-6">
                      {truncate(item.answer)}
                    </p>
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm font-medium">
                      {item.sortOrder}
                    </span>
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
                      Endpoint FAQs hiện chưa trả về bản ghi nào.
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
