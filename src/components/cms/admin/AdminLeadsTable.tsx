"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { LEAD_STATUS_LABEL_MAP } from "@/constants/enum-options";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  createLeadAction,
  deleteLeadAction,
  updateLeadAction,
} from "@/actions/admin-crud.actions";
import LeadFormDialog from "@/components/cms/admin/AdminLeadFormDialog";
import AdminStatusBadge, {
  leadStatusBadgeToneMap,
} from "@/components/cms/admin/AdminStatusBadge";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import { createPaginationChangeHandler } from "@/lib/pagination";
import { useToast } from "@/components/ui/use-toast";
import type { Lead, LeadSourceFilter } from "@/types/lead";

type AdminLeadsTableProps = {
  items: Lead[];
  currentPage: number;
  totalPages: number;
  source: LeadSourceFilter;
  toolbar?: AdminTableToolbar;
};

export default function AdminLeadsTable({
  items,
  currentPage,
  totalPages,
  source,
  toolbar,
}: AdminLeadsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const { toast } = useToast();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  const handleDeleteLead = useCallback(
    async (id: string | number) => {
      await deleteLeadAction(id);
      toast({
        title: "Đã xóa lead",
        description: "Lead đã được xóa thành công.",
        variant: "success",
      });
    },
    [toast],
  );

  const detailPrefix =
    source === "PROPERTY"
      ? "/admin/quan-li-leads/cho-thue"
      : "/admin/quan-li-leads/can-thue";

  const fields = useMemo<FieldConfig<Lead>[]>(
    () => [
      {
        key: "fullName",
        header: "Họ và tên",
        fieldType: "text",
        accessor: (item) => item.fullName,
      },
      {
        key: "phone",
        header: "Số điện thoại",
        fieldType: "text",
        accessor: (item) => item.phone,
      },
      {
        key: "sourceId",
        header: source === "PROPERTY" ? "ID Cho thuê" : "ID Cần thuê",
        fieldType: "text",
        accessor: (item) => {
          if (source === "PROPERTY") return item.propertyId ?? "—";
          return item.rentRequestId ?? "—";
        },
        render: ({ row }) => {
          const listingId =
            source === "PROPERTY" ? row.propertyId : row.rentRequestId;
          if (!listingId) return <span className="text-secondary">—</span>;
          return (
            <Link
              href={`${detailPrefix}/${row.id}`}
              className="text-primary font-medium hover:underline"
            >
              #{listingId}
            </Link>
          );
        },
      },

      {
        key: "createdAt",
        header: "Ngày tạo",
        fieldType: "date",
        accessor: (item) => item.createdAt,
      },
      {
        key: "userId",
        header: "ID người dùng",
        fieldType: "text",
        accessor: (item) => item.userId,
      },
      {
        key: "status",
        header: "Trạng thái",
        fieldType: "text",
        accessor: (item) => item.status,
        render: ({ row }) => (
          <AdminStatusBadge tone={leadStatusBadgeToneMap[row.status]}>
            {LEAD_STATUS_LABEL_MAP[row.status]}
          </AdminStatusBadge>
        ),
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        onEdit: (_id, item) => {
          setEditingLead(item);
        },
        onDelete: handleDeleteLead,
      },
    ],
    [detailPrefix, handleDeleteLead, source],
  );

  const toolbarConfig = toolbar
    ? {
        ...toolbar,
        onActionClick: toolbar.actionLabel
          ? () => {
              setEditingLead(null);
              setCreateOpen(true);
            }
          : toolbar.onActionClick,
      }
    : toolbar;

  return (
    <>
      <AdminDataTable
        data={items}
        fields={fields}
        getRowId={(item) => item.id}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        toolbar={toolbarConfig}
      />

      <LeadFormDialog
        open={createOpen || Boolean(editingLead)}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) setEditingLead(null);
        }}
        title={editingLead ? "Chỉnh sửa lead" : "Tạo lead"}
        description="Quản lý lead từ CMS."
        submitLabel={editingLead ? "Cập nhật" : "Tạo mới"}
        source={source}
        defaultValues={
          editingLead
            ? {
                fullName: editingLead.fullName,
                phone: editingLead.phone,
                status: editingLead.status,
                userId: editingLead.userId ?? undefined,
                propertyId:
                  source === "PROPERTY"
                    ? (editingLead.propertyId ?? undefined)
                    : undefined,
                rentRequestId:
                  source === "RENT_REQUEST"
                    ? (editingLead.rentRequestId ?? undefined)
                    : undefined,
              }
            : undefined
        }
        onSubmit={async (values) => {
          if (editingLead) {
            return updateLeadAction(editingLead.id, values);
          }

          return createLeadAction(values);
        }}
      />
    </>
  );
}
