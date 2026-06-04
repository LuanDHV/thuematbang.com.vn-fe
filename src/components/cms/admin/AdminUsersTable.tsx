"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import {
  createColumnsFromFields,
  type FieldConfig,
} from "@/components/cms/admin/column-generator";
import { createPaginationChangeHandler } from "@/lib/utils";
import type { User } from "@/types/user";

type AdminUsersTableProps = {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export default function AdminUsersTable({
  users,
  currentPage,
  totalPages,
}: AdminUsersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    searchParams,
    totalPages,
  );

  async function handleDeleteUser(id: string | number) {
    console.info("Delete user requested", { id });
  }

  const fields = useMemo<FieldConfig<User>[]>(
    () => [
      {
        key: "fullName",
        header: "Người dùng",
        fieldType: "text",
        accessor: (user) => user.fullName,
      },
      {
        key: "email",
        header: "Email",
        fieldType: "text",
        accessor: (user) => user.email,
      },
      {
        key: "phone",
        header: "Điện thoại",
        fieldType: "text",
        accessor: (user) => user.phone || "—",
      },
      {
        key: "role",
        header: "Vai trò",
        fieldType: "text",
        accessor: (user) => user.role,
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
        fieldType: "date",
        accessor: (user) => user.createdAt,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (user) => `/admin/nguoi-dung/${user.id}`,
        onDelete: handleDeleteUser,
      },
    ],
    [],
  );

  const columns = useMemo(
    () =>
      createColumnsFromFields<User>({
        fields,
        getRowId: (user) => user.id,
      }),
    [fields],
  );

  return (
    <AdminDataTable
      data={users}
      columns={columns}
      fields={fields}
      getRowId={(user) => user.id}
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
