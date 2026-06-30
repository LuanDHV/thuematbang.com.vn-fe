"use client";

import { useCallback, useMemo, useState } from "react";
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
import type { Lead } from "@/types/lead";

type AdminLeadsTableProps = {
  items: Lead[];
  currentPage: number;
  totalPages: number;
  toolbar?: AdminTableToolbar;
};

export default function AdminLeadsTable({
  items,
  currentPage,
  totalPages,
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

  const fields = useMemo<FieldConfig<Lead>[]>(
    () => [
      {
        key: "fullName",
        header: "Khách hàng",
        fieldType: "text",
        accessor: (item) => item.fullName,
      },
      {
        key: "phone",
        header: "Điện thoại",
        fieldType: "text",
        accessor: (item) => item.phone,
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
        key: "propertyId",
        header: "ID Cho thuê",
        fieldType: "text",
        accessor: (item) => item.propertyId ?? "Chưa có",
      },
      {
        key: "rentRequestId",
        header: "ID Cần thuê",
        fieldType: "text",
        accessor: (item) => item.rentRequestId ?? "Chưa có",
      },
      {
        key: "userId",
        header: "ID Tài khoản",
        fieldType: "text",
        accessor: (item) => item.userId ?? "Chưa có",
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
        onEdit: (_id, item) => {
          setEditingLead(item);
        },
        onDelete: handleDeleteLead,
      },
    ],
    [handleDeleteLead],
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
        defaultValues={
          editingLead
            ? {
                fullName: editingLead.fullName,
                phone: editingLead.phone,
                status: editingLead.status,
                userId: editingLead.userId ?? undefined,
                propertyId: editingLead.propertyId ?? undefined,
                rentRequestId: editingLead.rentRequestId ?? undefined,
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
