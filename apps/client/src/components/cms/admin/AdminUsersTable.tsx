"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AUTH_PROVIDER_LABEL_MAP, USER_ROLE_LABEL_MAP } from "@/constants/enum-options";
import AdminStatusBadge, {
  type AdminBadgeTone,
} from "@/components/cms/admin/AdminStatusBadge";
import AdminDataTable, {
  type AdminTableToolbar,
} from "@/components/cms/admin/DataTable";
import { type FieldConfig } from "@/components/cms/admin/ColumnGenerator";
import { createPaginationChangeHandler } from "@/lib/pagination";
import type { AuthProvider, UserRole } from "@/types/enums";
import type { User } from "@/types/user";

type AdminUsersTableProps = {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  toolbar?: AdminTableToolbar;
};

const roleToneMap: Record<UserRole, AdminBadgeTone> = {
  ADMIN: "success",
  AGENT: "info",
  CUSTOMER: "warning",
};

const providerToneMap: Record<AuthProvider, AdminBadgeTone> = {
  GOOGLE: "info",
  LOCAL: "warning",
};

export default function AdminUsersTable({
  users,
  currentPage,
  totalPages,
  toolbar,
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
        key: "createdAt",
        header: "Ngày tạo",
        fieldType: "date",
        accessor: (user) => user.createdAt,
        mobileHidden: true,
      },
      {
        key: "role",
        header: "Vai trò",
        fieldType: "text",
        accessor: (user) => user.role,
        render: ({ row }) => (
          <AdminStatusBadge tone={roleToneMap[row.role]}>
            {USER_ROLE_LABEL_MAP[row.role]}
          </AdminStatusBadge>
        ),
      },
      {
        key: "authProvider",
        header: "Nguồn tạo",
        fieldType: "text",
        accessor: (user) => user.authProvider,
        render: ({ row }) =>
          row.authProvider ? (
            <AdminStatusBadge tone={providerToneMap[row.authProvider]}>
              {AUTH_PROVIDER_LABEL_MAP[row.authProvider]}
            </AdminStatusBadge>
          ) : (
            "—"
          ),
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (user) => `/admin/quan-li-tai-khoan/${user.id}`,
        editLabel: "Đổi vai trò",
      },
    ],
    [],
  );

  return (
    <AdminDataTable
      data={users}
      fields={fields}
      getRowId={(user) => user.id}
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      toolbar={toolbar}
    />
  );
}

