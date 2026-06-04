"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import { type FieldConfig } from "@/components/cms/admin/column-generator";
import { createPaginationChangeHandler } from "@/lib/utils";
import type { Banner } from "@/types/banner";

type AdminBannersTableProps = {
  items: Banner[];
  currentPage: number;
  totalPages: number;
};

export default function AdminBannersTable({
  items,
  currentPage,
  totalPages,
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
        key: "imageUrl",
        header: "Banner",
        fieldType: "image",
        accessor: (item) => item.imageUrl,
      },
      {
        key: "title",
        header: "Tiêu đề",
        fieldType: "text",
        accessor: (item) => item.title,
      },
      {
        key: "page",
        header: "Page",
        fieldType: "text",
        accessor: (item) => item.page,
      },
      {
        key: "position",
        header: "Position",
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
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (item) => `/admin/banners/${item.id}`,
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
    />
  );
}
