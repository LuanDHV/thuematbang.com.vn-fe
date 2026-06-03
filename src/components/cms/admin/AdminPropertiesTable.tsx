"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import AdminDataTable from "@/components/cms/admin/data-table";
import {
  createColumnsFromFields,
  type FieldConfig,
} from "@/components/cms/admin/column-generator";
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

async function handleDeleteProperty(id: string | number) {
  console.info("Delete property requested", { id });
}

export default function AdminPropertiesTable({
  properties,
  currentPage,
  totalPages,
}: AdminPropertiesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fields = useMemo<FieldConfig<Property>[]>(
    () => [
      {
        key: "title",
        header: "Tin đăng",
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
        key: "status",
        header: "Trạng thái",
        fieldType: "badge",
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
        getEditHref: (property) => `/admin/cho-thue/${property.id}/edit`,
        onDelete: handleDeleteProperty,
      },
    ],
    [],
  );

  const columns = useMemo(
    () =>
      createColumnsFromFields<Property>({
        fields,
        getRowId: (property) => property.id,
      }),
    [fields],
  );
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  return (
    <AdminDataTable
      data={properties}
      columns={columns}
      fields={fields}
      getRowId={(property) => property.id}
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      emptyTitle="Không có dữ liệu"
      emptyDescription="Endpoint hiện tại chưa trả về bản ghi nào cho trang này."
    />
  );
}
