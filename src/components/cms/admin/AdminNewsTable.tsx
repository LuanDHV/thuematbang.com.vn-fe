"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import {
  createColumnsFromFields,
  type FieldConfig,
} from "@/components/cms/admin/column-generator";
import { createPaginationChangeHandler } from "@/lib/utils";
import type { News } from "@/types/news";

type AdminNewsTableProps = {
  items: News[];
  currentPage: number;
  totalPages: number;
};

export default function AdminNewsTable({
  items,
  currentPage,
  totalPages,
}: AdminNewsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  async function handleDeleteNews(id: string | number) {
    console.info("Delete news requested", { id });
  }

  const fields = useMemo<FieldConfig<News>[]>(
    () => [
      {
        key: "title",
        header: "Bài viết",
        fieldType: "text",
        accessor: (item) => item.title,
      },
      {
        key: "category",
        header: "Danh mục",
        fieldType: "text",
        accessor: (item) => item.category?.name ?? "Chưa có danh mục",
      },
      {
        key: "isFeatured",
        header: "Nổi bật",
        fieldType: "text",
        accessor: (item) => item.isFeatured,
      },
      {
        key: "status",
        header: "Trạng thái",
        fieldType: "text",
        accessor: (item) => item.status,
      },
      {
        key: "viewCount",
        header: "Lượt xem",
        fieldType: "text",
        accessor: (item) => item.viewCount,
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
        getEditHref: (item) => `/admin/tin-tuc/${item.id}`,
        onDelete: handleDeleteNews,
      },
    ],
    [],
  );

  const columns = useMemo(
    () =>
      createColumnsFromFields<News>({
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
