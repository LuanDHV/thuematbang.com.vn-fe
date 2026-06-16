"use client";

import { useMemo, useState } from "react";

import {
  createFaqAction,
  deleteFaqAction,
  updateFaqAction,
} from "@/actions/admin-crud.actions";
import FaqFormDialog from "@/components/cms/admin/AdminFaqFormDialog";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import type { PageValue } from "@/constants/enum-values";
import { useToast } from "@/components/ui/use-toast";
import type { FaqItem } from "@/types/faq";
import { createPaginationChangeHandler } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AdminFaqsTableProps = {
  items: FaqItem[];
  currentPage: number;
  totalPages: number;
  toolbar?: AdminTableToolbar;
};

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

export default function AdminFaqsTable({
  items,
  currentPage,
  totalPages,
  toolbar,
}: AdminFaqsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const { toast } = useToast();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  const fields = useMemo<FieldConfig<FaqItem>[]>(() => {
    async function handleDeleteFaq(id: string | number) {
      await deleteFaqAction(id);
      toast({
        title: "Đã xóa FAQ",
        description: "Câu hỏi thường gặp đã được xóa thành công.",
        variant: "success",
      });
    }

    return [
      {
        key: "page",
        header: "Trang",
        fieldType: "text",
        accessor: (item) => item.page,
      },
      {
        key: "question",
        header: "Câu hỏi",
        fieldType: "text",
        accessor: (item) => truncateText(item.question, 70),
      },
      {
        key: "answer",
        header: "Trả lời",
        fieldType: "text",
        accessor: (item) => truncateText(item.answer, 90),
      },
      {
        key: "sortOrder",
        header: "Thứ tự",
        fieldType: "text",
        accessor: (item) => item.sortOrder,
      },
      {
        key: "updatedAt",
        header: "Cập nhật",
        fieldType: "date",
        accessor: (item) => item.updatedAt,
        mobileHidden: true,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        onEdit: (_id, item) => {
          setEditingFaq(item);
        },
        onDelete: handleDeleteFaq,
      },
    ];
  }, [toast]);

  const toolbarConfig = toolbar
    ? {
        ...toolbar,
        onActionClick: toolbar.actionLabel
          ? () => {
              setEditingFaq(null);
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

      <FaqFormDialog
        open={createOpen || Boolean(editingFaq)}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) setEditingFaq(null);
        }}
        title={editingFaq ? "Chỉnh sửa FAQ" : "Tạo FAQ"}
        description="Quản lý câu hỏi thường gặp."
        submitLabel={editingFaq ? "Cập nhật" : "Tạo mới"}
        defaultValues={
          editingFaq
            ? {
                page: editingFaq.page as PageValue,
                question: editingFaq.question,
                answer: editingFaq.answer,
                sortOrder: editingFaq.sortOrder,
              }
            : undefined
        }
        onSubmit={async (values) => {
          if (editingFaq) {
            return updateFaqAction(editingFaq.id, values);
          }

          return createFaqAction(values);
        }}
      />
    </>
  );
}
