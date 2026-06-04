"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import {
  createColumnsFromFields,
  type FieldConfig,
} from "@/components/cms/admin/column-generator";
import {
  createPaginationChangeHandler,
  formatBudgetRange,
  formatLocationParts,
} from "@/lib/utils";
import type { RentRequest } from "@/types/rent-request";

type AdminRentRequestsTableProps = {
  items: RentRequest[];
  currentPage: number;
  totalPages: number;
};

export default function AdminRentRequestsTable({
  items,
  currentPage,
  totalPages,
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
        accessor: (item) => item.title,
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
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
        fieldType: "date",
        accessor: (item) => item.createdAt,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (item) => `/admin/can-thue/${item.id}`,
        onDelete: handleDeleteRentRequest,
      },
    ],
    [],
  );

  const columns = useMemo(
    () =>
      createColumnsFromFields<RentRequest>({
        fields,
        getRowId: (item) => item.id,
      }),
    [fields],
  );

  return (
    <AdminDataTable
      data={items}
      columns={columns}
      fields={fields}
      getRowId={(item) => item.id}
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
