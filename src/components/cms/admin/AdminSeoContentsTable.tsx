"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/data-table";
import { type FieldConfig } from "@/components/cms/admin/column-generator";
import { createPaginationChangeHandler } from "@/lib/utils";
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
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  async function handleDeleteSeoContent(id: string | number) {
    console.info("Delete SEO content requested", { id });
  }
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
