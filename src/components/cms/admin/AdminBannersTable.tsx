"use client";

import { useCallback, useMemo, useState } from "react";

import {
  deleteBannerAction,
  updateBannerAction,
} from "@/actions/admin-crud.actions";
import BannerFormDialog from "@/components/cms/admin/AdminBannerFormDialog";
import AdminStatusBadge, {
  type AdminBadgeTone,
} from "@/components/cms/admin/AdminStatusBadge";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import type { PageValue } from "@/constants/enum-values";
import { useToast } from "@/components/ui/use-toast";
import type { Banner } from "@/types/banner";
import { createPaginationChangeHandler } from "@/lib/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminEntityCell from "./AdminEntityCell";

type AdminBannersTableProps = {
  items: Banner[];
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

export default function AdminBannersTable({
  items,
  currentPage,
  totalPages,
  toolbar,
}: AdminBannersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const { toast } = useToast();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  const handleDeleteBanner = useCallback(
    async (id: string | number) => {
      await deleteBannerAction(id);
      toast({
        title: "Đã xóa banner",
        description: "Banner đã được xóa thành công.",
        variant: "success",
      });
    },
    [toast],
  );

  const fields = useMemo<FieldConfig<Banner>[]>(
    () => [
      {
        key: "title",
        header: "Tiêu đề",
        fieldType: "text",
        render: ({ row }) => (
          <AdminEntityCell imageUrl={row.imageUrl} title={row.title} />
        ),
      },
      {
        key: "page",
        header: "Trang hiển thị",
        fieldType: "text",
        accessor: (item) => item.page,
      },
      {
        key: "position",
        header: "Vị trí hiển thị",
        fieldType: "text",
        accessor: (item) => item.position,
      },
      {
        key: "sortOrder",
        header: "Sort",
        fieldType: "text",
        accessor: (item) => item.sortOrder,
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
        key: "targetLink",
        header: "Target link",
        fieldType: "text",
        accessor: (item) => item.targetLink ?? "Chưa có",
      },
      {
        key: "createdAt",
        header: "Tạo lúc",
        fieldType: "date",
        accessor: (item) => item.createdAt,
        mobileHidden: true,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        onEdit: (_id, item) => {
          setEditingBanner(item);
        },
        onDelete: handleDeleteBanner,
      },
    ],
    [handleDeleteBanner],
  );

  const toolbarConfig = toolbar
    ? {
        ...toolbar,
        actionHref: toolbar.actionLabel
          ? "/admin/quan-li-banners/new"
          : toolbar.actionHref,
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
        onPageChange={handlePageChange}
        toolbar={toolbarConfig}
      />

      <BannerFormDialog
        open={Boolean(editingBanner)}
        onOpenChange={(open) => {
          if (!open) setEditingBanner(null);
        }}
        title="Chỉnh sửa banner"
        description="Quản lý banner hiển thị trên website."
        submitLabel="Cập nhật"
        existingImageUrl={editingBanner?.imageUrl}
        existingImagePublicId={editingBanner?.imagePublicId ?? null}
        resourceId={editingBanner?.id}
        defaultValues={
          editingBanner
            ? {
                title: editingBanner.title,
                targetLink: editingBanner.targetLink ?? "",
                page: editingBanner.page as PageValue,
                position: editingBanner.position,
                sortOrder: editingBanner.sortOrder,
                isActive: editingBanner.isActive,
              }
            : undefined
        }
        onSubmit={async (payload) => {
          if (!editingBanner) {
            throw new Error("Không có banner để cập nhật.");
          }

          return updateBannerAction(editingBanner.id, payload);
        }}
      />
    </>
  );
}


