"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/data-table";
import AdminStatusBadge, {
  type AdminBadgeTone,
} from "@/components/cms/admin/AdminStatusBadge";
import { type FieldConfig } from "@/components/cms/admin/column-generator";
import {
  createPaginationChangeHandler,
  formatBudgetRange,
  formatLocationParts,
} from "@/lib/utils";
import type { RentRequestStatus } from "@/types/enums";
import type { RentRequest } from "@/types/rent-request";
import AdminEntityCell from "./AdminEntityCell";

type AdminRentRequestsTableProps = {
  items: RentRequest[];
  currentPage: number;
  totalPages: number;
  toolbar?: AdminTableToolbar;
};

const statusToneMap: Record<RentRequestStatus, AdminBadgeTone> = {
  ACTIVE: "success",
  MATCHED: "info",
  CLOSED: "muted",
  EXPIRED: "warning",
};

const statusLabelMap: Record<RentRequestStatus, string> = {
  ACTIVE: "Đang tìm",
  MATCHED: "Đã khớp",
  CLOSED: "Đã đóng",
  EXPIRED: "Hết hạn",
};

export default function AdminRentRequestsTable({
  items,
  currentPage,
  totalPages,
  toolbar,
}: AdminRentRequestsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  async function handleDeleteRentRequest(id: string | number) {
    console.info("Delete rent request requested", { id });
  }

  const fields = useMemo<FieldConfig<RentRequest>[]>(
    () => [
      {
        key: "title",
        header: "Nhu cầu",
        fieldType: "text",
        render: ({ row }) => (
          <AdminEntityCell
            imageUrl={row.imageUrl}
            title={row.title}
            slug={row.slug}
          />
        ),
      },
      {
        key: "category",
        header: "Danh mục",
        fieldType: "text",
        accessor: (item) => item.category?.name ?? "Chưa có danh mục",
      },
      {
        key: "location",
        header: "Khu vực mong muốn",
        fieldType: "text",
        accessor: (item) =>
          formatLocationParts([
            item.desiredWard?.name,
            item.desiredProvince?.name,
          ]),
      },
      {
        key: "budget",
        header: "Ngân sách",
        fieldType: "text",
        accessor: (item) => formatBudgetRange(item.minBudget, item.maxBudget),
      },
      {
        key: "status",
        header: "Trạng thái",
        fieldType: "text",
        accessor: (item) => item.status,
        render: ({ row }) => (
          <AdminStatusBadge tone={statusToneMap[row.status]}>
            {statusLabelMap[row.status]}
          </AdminStatusBadge>
        ),
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
        fieldType: "date",
        accessor: (item) => item.createdAt,
        mobileHidden: true,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (item) => `/admin/quan-li-tin-can-thue/${item.id}`,
        onDelete: handleDeleteRentRequest,
      },
    ],
    [],
  );

  return (
    <AdminDataTable
      data={items}
      fields={fields}
      getRowId={(item) => item.id}
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      toolbar={toolbar}
    />
  );
}
