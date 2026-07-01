"use client";

import { useCallback, useMemo, useState } from "react";
import { CATEGORY_TYPE_LABEL_MAP } from "@/constants/enum-options";

import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/actions/admin-crud.actions";
import CategoryFormDialog from "@/components/cms/admin/AdminCategoryFormDialog";
import AdminStatusBadge, {
  type AdminBadgeTone,
} from "@/components/cms/admin/AdminStatusBadge";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import { useToast } from "@/components/ui/use-toast";
import type { Category } from "@/types/category";
import type { CategoryType } from "@/types/enums";

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

export default function AdminCategoriesTable({
  items,
  currentPage,
  totalPages,
  toolbar,
}: AdminCategoriesTableProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const handleDeleteCategory = useCallback(
    async (id: string | number) => {
      await deleteCategoryAction(id);
      toast({
        title: "Đã xóa danh mục",
        description: "Danh mục đã được xóa thành công.",
        variant: "success",
      });
    },
    [toast],
  );

  const createDefaults = useMemo(
    () => ({
      type: "PROPERTY" as const,
      isActive: true,
    }),
    [],
  );

  const editingDefaults = useMemo(
    () =>
      editingCategory
        ? {
            type: editingCategory.type,
            name: editingCategory.name,
            slug: editingCategory.slug,
            priority: editingCategory.priority,
            isActive: editingCategory.isActive,
          }
        : createDefaults,
    [createDefaults, editingCategory],
  );

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
            {CATEGORY_TYPE_LABEL_MAP[row.type]}
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
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        onEdit: (_id, item) => {
          setEditingCategory(item);
        },
        onDelete: handleDeleteCategory,
      },
    ],
    [handleDeleteCategory],
  );

  const toolbarConfig = toolbar
    ? {
        ...toolbar,
        onActionClick: toolbar.actionLabel
          ? () => {
              setEditingCategory(null);
              setCreateOpen(true);
            }
          : toolbar.onActionClick,
      }
    : toolbar;

  return (
    <>
      <AdminDataTable
        data={items}
        fields={fields}
        getRowId={(item) => item.id}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={() => {}}
        toolbar={toolbarConfig}
      />

      <CategoryFormDialog
        open={createOpen || Boolean(editingCategory)}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) setEditingCategory(null);
        }}
        title={editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục"}
        description="Quản lý danh mục hiển thị trong CMS."
        submitLabel={editingCategory ? "Cập nhật" : "Tạo mới"}
        defaultValues={editingDefaults}
        onSubmit={async (values) => {
          if (editingCategory) {
            return updateCategoryAction(editingCategory.id, values);
          }

          return createCategoryAction(values);
        }}
      />
    </>
  );
}
