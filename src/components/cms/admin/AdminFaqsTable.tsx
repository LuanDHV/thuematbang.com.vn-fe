"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import {
  createColumnsFromFields,
  type FieldConfig,
} from "@/components/cms/admin/column-generator";
import { createPaginationChangeHandler } from "@/lib/utils";
import type { FaqItem } from "@/types/faq";

type AdminFaqsTableProps = {
  items: FaqItem[];
  currentPage: number;
  totalPages: number;
};

export default function AdminFaqsTable({
  items,
  currentPage,
  totalPages,
}: AdminFaqsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  async function handleDeleteFaq(id: string | number) {
    console.info("Delete FAQ requested", { id });
  }

  const fields = useMemo<FieldConfig<FaqItem>[]>(
    () => [
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
        accessor: (item) => item.question,
      },
      {
        key: "answer",
        header: "Trả lời",
        fieldType: "text",
        accessor: (item) => item.answer,
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
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (item) => `/admin/faqs/${item.id}`,
        onDelete: handleDeleteFaq,
      },
    ],
    [],
  );

  const columns = useMemo(
    () =>
      createColumnsFromFields<FaqItem>({
        fields,
        getRowId: (item) => item.id,
      }),
    [fields],
  );

  return (
    <AdminDataTable
      data={items}
      columns={columns}
      fields={fields}
      getRowId={(item) => item.id}
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      emptyTitle="Không có dữ liệu"
      emptyDescription="Endpoint FAQs hiện chưa trả về bản ghi nào."
    />
  );
}
