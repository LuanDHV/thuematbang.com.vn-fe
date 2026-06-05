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
import { createPaginationChangeHandler } from "@/lib/utils";
import type { Banner } from "@/types/banner";
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
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  async function handleDeleteBanner(id: string | number) {
    console.info("Delete banner requested", { id });
  }

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
        getEditHref: (item) => `/admin/quan-li-banners/${item.id}`,
        onDelete: handleDeleteBanner,
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
