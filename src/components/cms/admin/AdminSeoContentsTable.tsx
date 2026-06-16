"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { deleteSeoContentAction } from "@/actions/admin-crud.actions";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import { createPaginationChangeHandler } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import type { SeoContent } from "@/types/seo-content";

type AdminSeoContentsTableProps = {
  items: SeoContent[];
  currentPage: number;
  totalPages: number;
  toolbar?: AdminTableToolbar;
};

export default function AdminSeoContentsTable({
  items,
  currentPage,
  totalPages,
  toolbar,
}: AdminSeoContentsTableProps) {
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

  const handleDeleteSeoContent = useCallback(
    async (id: string | number) => {
      await deleteSeoContentAction(id);
      toast({
        title: "Đã xóa nội dung SEO",
        description: "Nội dung SEO đã được xóa thành công.",
        variant: "success",
      });
    },
    [toast],
  );

  const fields = useMemo<FieldConfig<SeoContent>[]>(
    () => [
      {
        key: "page",
        header: "Page",
        fieldType: "text",
        accessor: (item) => item.page,
      },
      {
        key: "seoContent",
        header: "SEO content",
        fieldType: "text",
        accessor: (item) => item.seoContent ?? "Chưa có SEO content",
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
        getEditHref: (item) => `/admin/quan-li-noi-dung-seo/${item.id}`,
        onDelete: handleDeleteSeoContent,
      },
    ],
    [handleDeleteSeoContent],
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
