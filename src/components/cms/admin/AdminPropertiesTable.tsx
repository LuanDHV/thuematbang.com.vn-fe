"use client";

import { useCallback, useMemo } from "react";
import {
  PROPERTY_PRIORITY_LABEL_MAP,
  PUBLISH_STATUS_LABEL_MAP,
} from "@/constants/enum-options";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { deletePropertyAction } from "@/actions/property.actions";
import AdminEntityCell from "@/components/cms/admin/AdminEntityCell";
import AdminPriorityBadge, {
  type AdminPriorityTone,
} from "@/components/cms/admin/AdminPriorityBadge";
import AdminStatusBadge, {
  publishStatusBadgeToneMap,
} from "@/components/cms/admin/AdminStatusBadge";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import { formatLocationParts, formatNegotiablePrice } from "@/lib/format";
import { createPaginationChangeHandler } from "@/lib/pagination";
import { useToast } from "@/components/ui/use-toast";
import type { PropertyPriority } from "@/types/enums";
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
  const { toast } = useToast();

  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  const handleDeleteProperty = useCallback(
    async (id: string | number) => {
      await deletePropertyAction(id);
      toast({
        title: "Đã xóa tin cho thuê",
        description: "Tin cho thuê đã được xóa thành công.",
        variant: "success",
      });
    },
    [toast],
  );

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
          formatNegotiablePrice(property.price, property.isNegotiable, {
            amount: property.priceAmount,
            unit: property.priceUnit,
          }),
      },
      {
        key: "priorityStatus",
        header: "Loại tin",
        fieldType: "text",
        accessor: (property) => property.priorityStatus,
        render: ({ row }) => (
          <AdminPriorityBadge tone={priorityToneMap[row.priorityStatus]}>
            {PROPERTY_PRIORITY_LABEL_MAP[row.priorityStatus]}
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
            {PUBLISH_STATUS_LABEL_MAP[row.status]}
          </AdminStatusBadge>
        ),
      },
      {
        key: "viewCount",
        header: "Lượt xem",
        fieldType: "number",
        accessor: (property) => property.viewCount,
        mobileHidden: true,
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
    [handleDeleteProperty],
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
