"use client";

import { useCallback, useMemo } from "react";
import { PUBLISH_STATUS_LABEL_MAP } from "@/constants/enum-options";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { deleteRentRequestAction } from "@/actions/admin-crud.actions";
import AdminEntityCell from "@/components/cms/admin/AdminEntityCell";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import AdminStatusBadge, {
  type AdminBadgeTone,
} from "@/components/cms/admin/AdminStatusBadge";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import { useToast } from "@/components/ui/use-toast";
import { RENT_REQUEST_COVER_IMAGE } from "@/constants/rent-request";
import {
  formatAreaValue,
  formatLocationParts,
  formatListingPrice,
} from "@/lib/format";
import { createPaginationChangeHandler } from "@/lib/pagination";
import type { PublishStatus } from "@/types/enums";
import type { RentRequest } from "@/types/rent-request";

type AdminRentRequestsTableProps = {
  items: RentRequest[];
  currentPage: number;
  totalPages: number;
  toolbar?: AdminTableToolbar;
};

const statusToneMap: Record<PublishStatus, AdminBadgeTone> = {
  DRAFT: "muted",
  PUBLISHED: "success",
  ARCHIVED: "neutral",
};

export default function AdminRentRequestsTable({
  items,
  currentPage,
  totalPages,
  toolbar,
}: AdminRentRequestsTableProps) {
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

  const handleDeleteRentRequest = useCallback(
    async (id: string | number) => {
      await deleteRentRequestAction(id);
      toast({
        title: "Đã xóa tin cần thuê",
        description: "Tin cần thuê đã được xóa thành công.",
        variant: "success",
      });
    },
    [toast],
  );

  const fields = useMemo<FieldConfig<RentRequest>[]>(
    () => [
      {
        key: "title",
        header: "Nhu cầu",
        fieldType: "text",
        render: ({ row }) => (
          <AdminEntityCell
            imageUrl={RENT_REQUEST_COVER_IMAGE}
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
        key: "location",
        header: "Khu vực mong muốn",
        fieldType: "text",
        accessor: (item) =>
          formatLocationParts([
            item.desiredWard?.name,
            item.desiredProvince?.name,
          ]),
      },
      {
        key: "budget",
        header: "Ngân sách",
        fieldType: "text",
        accessor: (item) =>
          formatListingPrice(item.budget, {
            fallback: "Đang cập nhật",
            amount: item.budgetAmount,
            unit: item.budgetUnit,
          }),
      },
      {
        key: "desiredArea",
        header: "Diện tích",
        fieldType: "text",
        accessor: (item) => formatAreaValue(item.desiredArea),
      },
      {
        key: "status",
        header: "Trạng thái",
        fieldType: "text",
        accessor: (item) => item.status,
        render: ({ row }) => (
          <AdminStatusBadge tone={statusToneMap[row.status]}>
            {PUBLISH_STATUS_LABEL_MAP[row.status]}
          </AdminStatusBadge>
        ),
      },
      {
        key: "isMatched",
        header: "Khớp",
        fieldType: "text",
        accessor: (item) => item.isMatched,
        render: ({ row }) => (
          <AdminStatusBadge tone={row.isMatched ? "success" : "muted"}>
            {row.isMatched ? "Đã khớp" : "Chưa khớp"}
          </AdminStatusBadge>
        ),
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
        getEditHref: (item) => `/admin/quan-li-tin-can-thue/${item.id}`,
        onDelete: handleDeleteRentRequest,
      },
    ],
    [handleDeleteRentRequest],
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


