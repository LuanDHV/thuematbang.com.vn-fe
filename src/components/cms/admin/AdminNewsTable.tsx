"use client";

import { useCallback, useMemo } from "react";
import { PUBLISH_STATUS_LABEL_MAP } from "@/constants/enum-options";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { deleteNewsAction } from "@/actions/admin-crud.actions";
import AdminEntityCell from "@/components/cms/admin/AdminEntityCell";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import AdminStatusBadge, {
  type AdminBadgeTone,
  publishStatusBadgeToneMap,
} from "@/components/cms/admin/AdminStatusBadge";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import { createPaginationChangeHandler } from "@/lib/pagination";
import { useToast } from "@/components/ui/use-toast";
import type { PublishStatus } from "@/types/enums";
import type { News } from "@/types/news";

type AdminNewsTableProps = {
  items: News[];
  currentPage: number;
  totalPages: number;
  toolbar?: AdminTableToolbar;
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
  const { toast } = useToast();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  const handleDeleteNews = useCallback(
    async (id: string | number) => {
      await deleteNewsAction(id);
      toast({
        title: "Đã xóa tin tức",
        description: "Bài viết đã được xóa thành công.",
        variant: "success",
      });
    },
    [toast],
  );

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
            {PUBLISH_STATUS_LABEL_MAP[row.status]}
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
    [handleDeleteNews],
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


