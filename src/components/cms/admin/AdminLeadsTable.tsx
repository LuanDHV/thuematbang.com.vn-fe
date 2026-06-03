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
import type { Lead } from "@/types/lead";
import type { LeadStatus } from "@/types/enums";
import { TablePaginationFooter } from "@/components/common/Pagination";

type AdminLeadsTableProps = {
  items: Lead[];
  currentPage: number;
  totalPages: number;
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}

function truncate(value: string, maxLength = 90) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}…`;
}

function getStatusLabel(status: LeadStatus) {
  switch (status) {
    case "NEW":
      return "Mới";
    case "CONTACTED":
      return "Đã liên hệ";
    case "QUALIFIED":
      return "Đủ điều kiện";
    case "CLOSED":
      return "Đã đóng";
    case "REJECTED":
      return "Từ chối";
    default:
      return status;
  }
}

function getStatusVariant(status: LeadStatus) {
  switch (status) {
    case "NEW":
      return "warning";
    case "CONTACTED":
      return "default";
    case "QUALIFIED":
      return "success";
    case "CLOSED":
      return "muted";
    case "REJECTED":
      return "destructive";
    default:
      return "outline";
  }
}

function formatRelatedEntity(value?: number | null) {
  return typeof value === "number" ? `#${value}` : "Chưa có";
}

function getMailto(email?: string | null) {
  return email ? `mailto:${email}` : undefined;
}

function getTel(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

function formatSource(source: string) {
  return source.replace(/_/g, " ");
}

function LeadPagination({
  currentPage,
  totalPages,
}: Pick<AdminLeadsTableProps, "currentPage" | "totalPages">) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (page <= 1) nextParams.delete("page");
    else nextParams.set("page", String(page));

    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <TablePaginationFooter
      page={currentPage}
      totalPages={totalPages}
      onChange={handlePageChange}
      colSpan={8}
    />
  );
}

export default function AdminLeadsTable({
  items,
  currentPage,
  totalPages,
}: AdminLeadsTableProps) {
  const newCount = items.filter((item) => item.status === "NEW").length;
  const contactedCount = items.filter((item) => item.status === "CONTACTED").length;
  const sourceCount = new Set(items.map((item) => item.source)).size;

  const sortedItems = [...items].sort((left, right) =>
    new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  return (
    <section className="space-y-5">
      <div className="surface-panel overflow-hidden">
        <div className="border-hairline border-b px-4 py-4 md:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
                Lead liên hệ
              </h2>
              <p className="text-secondary mt-1 text-sm">
                Dữ liệu liên hệ từ form và tương tác người dùng, có phân trang
                theo backend.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{items.length} lead</Badge>
              <Badge variant="outline">{newCount} mới</Badge>
              <Badge variant="outline">{contactedCount} đã liên hệ</Badge>
              <Badge variant="secondary">{sourceCount} nguồn</Badge>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[18%]">Khách hàng</TableHead>
              <TableHead className="w-[18%]">Liên hệ</TableHead>
              <TableHead className="w-[12%]">Nguồn</TableHead>
              <TableHead className="w-[10%]">Trạng thái</TableHead>
              <TableHead className="w-[12%]">Property</TableHead>
              <TableHead className="w-[12%]">User</TableHead>
              <TableHead className="w-[18%]">Ghi chú</TableHead>
              <TableHead className="w-[10%]">Tạo lúc</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <p className="text-heading text-sm font-semibold">
                        {item.fullName}
                      </p>
                      <p className="text-secondary text-xs">ID: {item.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <a
                        href={getTel(item.phone)}
                        className="text-body text-sm font-medium hover:underline"
                      >
                        {item.phone}
                      </a>
                      {item.email ? (
                        <a
                          href={getMailto(item.email) ?? "#"}
                          className="text-secondary text-xs hover:underline"
                        >
                          {item.email}
                        </a>
                      ) : (
                        <p className="text-secondary text-xs">Không có email</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm">
                      {formatSource(item.source)}
                    </span>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant={getStatusVariant(item.status)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm">
                      {formatRelatedEntity(item.propertyId)}
                    </span>
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm">
                      {formatRelatedEntity(item.userId)}
                    </span>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="text-body text-sm leading-6">
                      {item.message ? truncate(item.message) : "Không có ghi chú"}
                    </p>
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm">
                      {formatDate(item.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-14 text-center">
                  <div className="space-y-2">
                    <p className="text-heading text-base font-semibold">
                      Không có dữ liệu
                    </p>
                    <p className="text-secondary text-sm">
                      Endpoint leads hiện chưa trả về bản ghi nào.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <LeadPagination currentPage={currentPage} totalPages={totalPages} />
        </Table>
      </div>
    </section>
  );
}
