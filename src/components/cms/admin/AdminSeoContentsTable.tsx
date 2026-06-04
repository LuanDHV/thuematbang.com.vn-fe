"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import {
  createColumnsFromFields,
  type FieldConfig,
} from "@/components/cms/admin/column-generator";
import { createPaginationChangeHandler } from "@/lib/utils";
import type { SeoContent } from "@/types/seo-content";

type AdminSeoContentsTableProps = {
  items: SeoContent[];
  currentPage: number;
  totalPages: number;
};

export default function AdminSeoContentsTable({
  items,
  currentPage,
  totalPages,
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
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (item) => `/admin/seo-contents/${item.id}`,
        onDelete: handleDeleteSeoContent,
      },
    ],
    [],
  );

  const columns = useMemo(
    () =>
      createColumnsFromFields<SeoContent>({
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
    />
  );
}
