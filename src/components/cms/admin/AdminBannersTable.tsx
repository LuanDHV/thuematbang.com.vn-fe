"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePaginationFooter } from "@/components/common/Pagination";
import { createPaginationChangeHandler, formatDateDisplay } from "@/lib/utils";
import type { Banner } from "@/types/banner";

type AdminBannersTableProps = {
  items: Banner[];
  currentPage: number;
  totalPages: number;
};

function isExternalUrl(value?: string | null) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

export default function AdminBannersTable({
  items,
  currentPage,
  totalPages,
}: AdminBannersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCount = items.filter((item) => item.isActive).length;
  const pages = new Set(items.map((item) => item.page)).size;
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  return (
    <section className="space-y-5">
      <div className="surface-panel overflow-hidden">
        <div className="border-hairline border-b px-4 py-4 md:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
                Banner quảng cáo
              </h2>
              <p className="text-secondary mt-1 text-sm">
                Dữ liệu banner theo page, position, thứ tự hiển thị và trạng
                thái.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{items.length} banner</Badge>
              <Badge variant="outline">{activeCount} đang bật</Badge>
              <Badge variant="secondary">{pages} page</Badge>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[24%]">Banner</TableHead>
              <TableHead className="w-[12%]">Page</TableHead>
              <TableHead className="w-[12%]">Position</TableHead>
              <TableHead className="w-[10%]">Sort</TableHead>
              <TableHead className="w-[12%]">Trạng thái</TableHead>
              <TableHead className="w-[20%]">Target link</TableHead>
              <TableHead className="w-[10%]">Tạo lúc</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="align-top">
                    <div className="flex gap-3">
                      <CloudinaryImage
                        src={item.imageUrl}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="border-hairline rounded-xl border object-cover"
                      />
                      <div className="min-w-0 space-y-1">
                        <p className="text-heading line-clamp-2 text-sm font-semibold">
                          {item.title}
                        </p>
                        <p className="text-secondary text-xs">ID: {item.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm">{item.page}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm">{item.position}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm font-medium">
                      {item.sortOrder}
                    </span>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant={item.isActive ? "success" : "muted"}>
                      {item.isActive ? "Đang bật" : "Đã tắt"}
                    </Badge>
                  </TableCell>
                  <TableCell className="align-top">
                    {item.targetLink ? (
                      <a
                        href={item.targetLink}
                        target={
                          isExternalUrl(item.targetLink) ? "_blank" : undefined
                        }
                        rel={
                          isExternalUrl(item.targetLink)
                            ? "noreferrer"
                            : undefined
                        }
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        {item.targetLink}
                      </a>
                    ) : (
                      <span className="text-secondary text-sm">Chưa có</span>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm">
                      {formatDateDisplay(item.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-14 text-center">
                  <div className="space-y-2">
                    <p className="text-heading text-base font-semibold">
                      Không có dữ liệu
                    </p>
                    <p className="text-secondary text-sm">
                      Endpoint banners hiện chưa trả về bản ghi nào.
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
