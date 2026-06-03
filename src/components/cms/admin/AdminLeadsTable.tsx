"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import {
  createColumnsFromFields,
  type FieldConfig,
} from "@/components/cms/admin/column-generator";
import { createPaginationChangeHandler, formatTextSource } from "@/lib/utils";
import type { Lead } from "@/types/lead";

type AdminLeadsTableProps = {
  items: Lead[];
  currentPage: number;
  totalPages: number;
};

export default function AdminLeadsTable({
  items,
  currentPage,
  totalPages,
}: AdminLeadsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  async function handleDeleteLead(id: string | number) {
    console.info("Delete lead requested", { id });
  }

  const fields = useMemo<FieldConfig<Lead>[]>(
    () => [
      {
        key: "fullName",
        header: "Khách hàng",
        fieldType: "text",
        accessor: (item) => item.fullName,
      },
      {
        key: "phone",
        header: "Điện thoại",
        fieldType: "text",
        accessor: (item) => item.phone,
      },
      {
        key: "email",
        header: "Email",
        fieldType: "text",
        accessor: (item) => item.email ?? "Không có email",
      },
      {
        key: "source",
        header: "Nguồn",
        fieldType: "text",
        accessor: (item) => formatTextSource(item.source),
      },
      {
        key: "status",
        header: "Trạng thái",
        fieldType: "text",
        accessor: (item) => item.status,
      },
      {
        key: "propertyId",
        header: "Property",
        fieldType: "text",
        accessor: (item) => item.propertyId ?? "Chưa có",
      },
      {
        key: "userId",
        header: "User",
        fieldType: "text",
        accessor: (item) => item.userId ?? "Chưa có",
      },
      {
        key: "message",
        header: "Ghi chú",
        fieldType: "text",
        accessor: (item) => item.message ?? "Không có ghi chú",
      },
      {
        key: "createdAt",
        header: "Tạo lúc",
        fieldType: "date",
        accessor: (item) => item.createdAt,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (item) => `/admin/leads/${item.id}`,
        onDelete: handleDeleteLead,
      },
    ],
    [],
  );

  const columns = useMemo(
    () =>
      createColumnsFromFields<Lead>({
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
      emptyTitle="Không có dữ liệu"
      emptyDescription="Endpoint leads hiện chưa trả về bản ghi nào."
    />
  );
}
