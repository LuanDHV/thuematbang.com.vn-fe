"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { deleteStaticPageAction } from "@/actions/admin-crud.actions";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import AdminStatusBadge from "@/components/cms/admin/AdminStatusBadge";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import { useToast } from "@/components/ui/use-toast";
import { createPaginationChangeHandler } from "@/lib/pagination";
import type { StaticPage } from "@/types/static-page";

type AdminStaticPagesTableProps = {
  items: StaticPage[];
  currentPage: number;
  totalPages: number;
  toolbar?: AdminTableToolbar;
};

export default function AdminStaticPagesTable({
  items,
  currentPage,
  totalPages,
  toolbar,
}: AdminStaticPagesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  const handleDelete = useCallback(
    async (id: string | number) => {
      await deleteStaticPageAction(id);
      toast({
        title: "Đã xóa trang tĩnh",
        description: "Trang tĩnh đã được xóa thành công.",
        variant: "success",
      });
    },
    [toast],
  );

  const fields = useMemo<FieldConfig<StaticPage>[]>(
    () => [
      {
        key: "siteCode",
        header: "Trang",
        fieldType: "text",
        accessor: (item) => item.siteCode,
      },
      {
        key: "isPublished",
        header: "Trạng thái",
        fieldType: "text",
        accessor: (item) => item.isPublished,
        render: ({ row }) => (
          <AdminStatusBadge tone={row.isPublished ? "success" : "muted"}>
            {row.isPublished ? "Đang hiển thị" : "Ẩn"}
          </AdminStatusBadge>
        ),
      },
      {
        key: "updatedAt",
        header: "Cập nhật",
        fieldType: "date",
        accessor: (item) => item.updatedAt,
        mobileHidden: true,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (item) => `/admin/quan-li-trang-tinh/${item.id}`,
        onDelete: handleDelete,
      },
    ],
    [handleDelete],
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
