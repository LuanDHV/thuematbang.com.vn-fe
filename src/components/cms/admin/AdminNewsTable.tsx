"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/data-table";
import AdminStatusBadge, {
  type AdminBadgeTone,
  publishStatusBadgeToneMap,
} from "@/components/cms/admin/AdminStatusBadge";
import { type FieldConfig } from "@/components/cms/admin/column-generator";
import { createPaginationChangeHandler } from "@/lib/utils";
import type { PublishStatus } from "@/types/enums";
import type { News } from "@/types/news";
import AdminEntityCell from "./AdminEntityCell";

type AdminNewsTableProps = {
  items: News[];
  currentPage: number;
  totalPages: number;
  toolbar?: AdminTableToolbar;
};

const statusLabelMap: Record<PublishStatus, string> = {
  DRAFT: "Nháp",
  PUBLISHED: "Đã đăng",
  ARCHIVED: "Lưu trữ",
};

function getFeaturedTone(isFeatured: boolean): AdminBadgeTone {
  return isFeatured ? "warning" : "info";
}

function getFeaturedLabel(isFeatured: boolean) {
  return isFeatured ? "Nổi bật" : "Thường";
}

export default function AdminNewsTable({
  items,
  currentPage,
  totalPages,
  toolbar,
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
        render: ({ row }) => (
          <AdminEntityCell
            imageUrl={row.imageUrl}
            title={row.title}
            slug={row.slug}
          />
        ),
      },
      {
        key: "category",
        header: "Danh mục",
        fieldType: "text",
        accessor: (item) => item.category?.name ?? "Chưa có danh mục",
      },
      {
        key: "isFeatured",
        header: "Loại tin",
        fieldType: "text",
        accessor: (item) => item.isFeatured,
        render: ({ row }) => (
          <AdminStatusBadge tone={getFeaturedTone(row.isFeatured)}>
            {getFeaturedLabel(row.isFeatured)}
          </AdminStatusBadge>
        ),
      },
      {
        key: "status",
        header: "Trạng thái",
        fieldType: "text",
        accessor: (item) => item.status,
        render: ({ row }) => (
          <AdminStatusBadge tone={publishStatusBadgeToneMap[row.status]}>
            {statusLabelMap[row.status]}
          </AdminStatusBadge>
        ),
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
        mobileHidden: true,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (item) => `/admin/quan-li-tin-tuc/${item.id}`,
        onDelete: handleDeleteNews,
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
