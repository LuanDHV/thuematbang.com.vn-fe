"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminEntityCell from "@/components/cms/admin/AdminEntityCell";
import AdminPriorityBadge, {
  type AdminPriorityTone,
} from "@/components/cms/admin/AdminPriorityBadge";
import AdminStatusBadge, {
  publishStatusBadgeToneMap,
} from "@/components/cms/admin/AdminStatusBadge";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/data-table";
import { type FieldConfig } from "@/components/cms/admin/column-generator";
import {
  createPaginationChangeHandler,
  formatLocationParts,
  formatNegotiablePrice,
} from "@/lib/utils";
import type { PropertyPriority, PublishStatus } from "@/types/enums";
import type { Property } from "@/types/property";

type AdminPropertiesTableProps = {
  properties: Property[];
  currentPage: number;
  totalPages: number;
  toolbar?: AdminTableToolbar;
};

const priorityToneMap: Record<PropertyPriority, AdminPriorityTone> = {
  FREE: "free",
  STANDARD: "standard",
  PREMIUM: "premium",
};

const priorityLabelMap: Record<PropertyPriority, string> = {
  FREE: "Miễn phí",
  STANDARD: "Tiêu chuẩn",
  PREMIUM: "Cao cấp",
};

const statusLabelMap: Record<PublishStatus, string> = {
  DRAFT: "Nháp",
  PUBLISHED: "Đã đăng",
  ARCHIVED: "Lưu trữ",
};

function getPrimaryPropertyImage(property: Property) {
  return (
    property.images?.find((image) => image.sortOrder === 0)?.imageUrl ??
    property.images?.[0]?.imageUrl ??
    null
  );
}

export default function AdminPropertiesTable({
  properties,
  currentPage,
  totalPages,
  toolbar,
}: AdminPropertiesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  async function handleDeleteProperty(id: string | number) {
    console.info("Delete property requested", { id });
  }

  const fields = useMemo<FieldConfig<Property>[]>(
    () => [
      {
        key: "title",
        header: "Tin cho thuê",
        fieldType: "text",
        render: ({ row }) => (
          <AdminEntityCell
            imageUrl={getPrimaryPropertyImage(row)}
            title={row.title}
            slug={row.slug}
          />
        ),
      },
      {
        key: "category",
        header: "Danh mục",
        fieldType: "text",
        accessor: (property) => property.category?.name ?? "Chưa có danh mục",
      },
      {
        key: "location",
        header: "Khu vực",
        fieldType: "text",
        accessor: (property) =>
          formatLocationParts([property.ward?.name, property.province?.name]),
      },
      {
        key: "price",
        header: "Giá",
        fieldType: "text",
        accessor: (property) =>
          formatNegotiablePrice(property.price, property.isNegotiable),
      },
      {
        key: "priorityStatus",
        header: "Loại tin",
        fieldType: "text",
        accessor: (property) => property.priorityStatus,
        render: ({ row }) => (
          <AdminPriorityBadge tone={priorityToneMap[row.priorityStatus]}>
            {priorityLabelMap[row.priorityStatus]}
          </AdminPriorityBadge>
        ),
      },
      {
        key: "status",
        header: "Trạng thái",
        fieldType: "text",
        accessor: (property) => property.status,
        render: ({ row }) => (
          <AdminStatusBadge tone={publishStatusBadgeToneMap[row.status]}>
            {statusLabelMap[row.status]}
          </AdminStatusBadge>
        ),
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
        fieldType: "date",
        accessor: (property) => property.createdAt,
        mobileHidden: true,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (property) => `/admin/quan-li-tin-cho-thue/${property.id}`,
        onDelete: handleDeleteProperty,
      },
    ],
    [],
  );

  return (
    <AdminDataTable
      data={properties}
      fields={fields}
      getRowId={(property) => property.id}
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      toolbar={toolbar}
    />
  );
}
