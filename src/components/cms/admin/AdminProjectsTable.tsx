"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import { type FieldConfig } from "@/components/cms/admin/column-generator";
import {
  createPaginationChangeHandler,
  formatLocationParts,
  formatVndAmount,
} from "@/lib/utils";
import type { Project } from "@/types/project";

type AdminProjectsTableProps = {
  items: Project[];
  currentPage: number;
  totalPages: number;
};

export default function AdminProjectsTable({
  items,
  currentPage,
  totalPages,
}: AdminProjectsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  async function handleDeleteProject(id: string | number) {
    console.info("Delete project requested", { id });
  }

  const fields = useMemo<FieldConfig<Project>[]>(
    () => [
      {
        key: "name",
        header: "Dự án",
        fieldType: "text",
        accessor: (item) => item.name,
      },
      {
        key: "category",
        header: "Danh mục",
        fieldType: "text",
        accessor: (item) => item.category?.name ?? "Chưa có danh mục",
      },
      {
        key: "location",
        header: "Khu vực",
        fieldType: "text",
        accessor: (item) =>
          formatLocationParts([item.ward?.name, item.province?.name]),
      },
      {
        key: "price",
        header: "Giá",
        fieldType: "text",
        accessor: (item) => formatVndAmount(item.price),
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
        getEditHref: (item) => `/admin/du-an/${item.id}`,
        onDelete: handleDeleteProject,
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
    />
  );
}
