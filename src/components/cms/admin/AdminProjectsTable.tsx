"use client";

import { useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { deleteProjectAction } from "@/actions/admin-crud.actions";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import AdminStatusBadge, {
  publishStatusBadgeToneMap,
} from "@/components/cms/admin/AdminStatusBadge";
import { PUBLISH_STATUS_LABEL_MAP } from "@/constants/enum-options";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import { formatLocationParts, formatNegotiablePrice } from "@/lib/format";
import { createPaginationChangeHandler } from "@/lib/pagination";
import { useToast } from "@/components/ui/use-toast";
import type { Project } from "@/types/project";
import AdminEntityCell from "./AdminEntityCell";

type AdminProjectsTableProps = {
  items: Project[];
  currentPage: number;
  totalPages: number;
  toolbar?: AdminTableToolbar;
};

export default function AdminProjectsTable({
  items,
  currentPage,
  totalPages,
  toolbar,
}: AdminProjectsTableProps) {
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

  const handleDeleteProject = useCallback(
    async (id: string | number) => {
      await deleteProjectAction(id);
      toast({
        title: "Đã xóa dự án",
        description: "Dự án đã được xóa thành công.",
        variant: "success",
      });
    },
    [toast],
  );

function getPrimaryProjectImage(project: Project) {
  return (
    project.images?.find((image) => image.sortOrder === 1)?.imageUrl ??
    project.images?.[0]?.imageUrl ??
    null
  );
}

  const fields = useMemo<FieldConfig<Project>[]>(
    () => [
      {
        key: "name",
        header: "Dự án",
        fieldType: "text",
        render: ({ row }) => (
          <AdminEntityCell
            imageUrl={getPrimaryProjectImage(row)}
            title={row.name}
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
        key: "location",
        header: "Khu vực",
        fieldType: "text",
        accessor: (item) =>
          formatLocationParts([item.ward?.name, item.province?.name]),
      },
      {
        key: "price",
        header: "Giá",
        fieldType: "text",
        accessor: (item) =>
          formatNegotiablePrice(item.price, item.isNegotiable, {
            amount: item.priceAmount,
            unit: item.priceUnit,
          }),
      },
      {
        key: "viewCount",
        header: "Lượt xem",
        fieldType: "number",
        accessor: (item) => item.viewCount,
        mobileHidden: true,
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
        fieldType: "date",
        accessor: (item) => item.createdAt,
        mobileHidden: true,
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
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (item) => `/admin/quan-li-du-an/${item.id}`,
        onDelete: handleDeleteProject,
      },
    ],
    [handleDeleteProject],
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
