import AdminUsersTable from "@/components/cms/admin/AdminUsersTable";
import {
  resolvePaginationServer,
  resolveSearchQueryValue,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { userService } from "@/services/user.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminNguoiDungPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const limit = 10;

  const result = await userService
    .getAdminUsers({
      page: currentPage,
      limit,
      filters: {
        q: searchQuery,
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const users = result.data ?? [];
  const totalItems = result.meta?.total ?? users.length;
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminUsersTable
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        toolbar={{
          title: "Quản lí tài khoản",
          searchPlaceholder: "Tìm kiếm tên, email hoặc sđt",
          searchValue,
          actionLabel: "Tạo mới",
        }}
      />
    </section>
  );
}
