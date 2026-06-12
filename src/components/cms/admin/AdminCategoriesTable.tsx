"use client";

import { useMemo } from "react";
import AdminStatusBadge, {
  type AdminBadgeTone,
} from "@/components/cms/admin/AdminStatusBadge";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import type { CategoryType } from "@/types/enums";
import type { Category } from "@/types/category";

type AdminCategoriesTableProps = {
  items: Category[];
  currentPage: number;
  totalPages: number;
  toolbar?: AdminTableToolbar;
};

function getActiveTone(isActive: boolean): AdminBadgeTone {
  return isActive ? "success" : "muted";
}

function getActiveLabel(isActive: boolean) {
  return isActive ? "Đang bật" : "Đang tắt";
}

const typeToneMap: Record<CategoryType, AdminBadgeTone> = {
  PROPERTY: "info",
  RENT_REQUEST: "warning",
  PROJECT: "success",
  NEWS: "muted",
};

const typeLabelMap: Record<CategoryType, string> = {
  PROPERTY: "Cho thuê",
  RENT_REQUEST: "Cần thuê",
  PROJECT: "Dự án",
  NEWS: "Tin tức",
};

export default function AdminCategoriesTable({
  items,
  currentPage,
  totalPages,
  toolbar,
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
        header: "Loại danh mục",
        fieldType: "text",
        accessor: (item) => item.type,
        render: ({ row }) => (
          <AdminStatusBadge tone={typeToneMap[row.type]}>
            {typeLabelMap[row.type]}
          </AdminStatusBadge>
        ),
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
        render: ({ row }) => (
          <AdminStatusBadge tone={getActiveTone(row.isActive)}>
            {getActiveLabel(row.isActive)}
          </AdminStatusBadge>
        ),
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
      toolbar={toolbar}
    />
  );
}
