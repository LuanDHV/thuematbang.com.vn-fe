"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import { type FieldConfig } from "@/components/cms/admin/column-generator";
import {
  createPaginationChangeHandler,
  formatLocationParts,
  formatNegotiablePrice,
} from "@/lib/utils";
import type { Property } from "@/types/property";

type AdminPropertiesTableProps = {
  properties: Property[];
  currentPage: number;
  totalPages: number;
};

export default function AdminPropertiesTable({
  properties,
  currentPage,
  totalPages,
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
        accessor: (property) => property.title,
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
          formatLocationParts([
            property.street?.name,
            property.ward?.name,
            property.province?.name,
          ]),
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
        header: "Loại Tin",
        fieldType: "text",
        accessor: (property) => property.priorityStatus,
      },
      {
        key: "status",
        header: "Trạng thái",
        fieldType: "text",
        accessor: (property) => property.status,
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
        fieldType: "date",
        accessor: (property) => property.createdAt,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (property) => `/admin/cho-thue/${property.id}`,
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
    />
  );
}
