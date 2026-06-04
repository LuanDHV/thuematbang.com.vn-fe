"use client";

import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import { type FieldConfig } from "@/components/cms/admin/column-generator";
import type { Category } from "@/types/category";

type AdminCategoriesTableProps = {
  items: Category[];
  currentPage: number;
  totalPages: number;
};

export default function AdminCategoriesTable({
  items,
  currentPage,
  totalPages,
}: AdminCategoriesTableProps) {
  async function handleDeleteCategory(id: string | number) {
    console.info("Delete category requested", { id });
  }

  const fields = useMemo<FieldConfig<Category>[]>(
    () => [
      {
        key: "name",
        header: "Tên danh mục",
        fieldType: "text",
        accessor: (item) => item.name,
      },
      {
        key: "type",
        header: "Type",
        fieldType: "text",
        accessor: (item) => item.type,
      },
      {
        key: "slug",
        header: "Slug",
        fieldType: "text",
        accessor: (item) => item.slug,
      },
      {
        key: "priority",
        header: "Ưu tiên",
        fieldType: "text",
        accessor: (item) => item.priority,
      },
      {
        key: "isActive",
        header: "Trạng thái",
        fieldType: "text",
        accessor: (item) => item.isActive,
      },
      {
        key: "createdAt",
        header: "Tạo lúc",
        fieldType: "date",
        accessor: (item) => item.createdAt,
      },
      {
        key: "updatedAt",
        header: "Cập nhật",
        fieldType: "date",
        accessor: (item) => item.updatedAt,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (item) => `/admin/quan-li-danh-muc/${item.id}`,
        onDelete: handleDeleteCategory,
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
      onPageChange={() => {}}
    />
  );
}
