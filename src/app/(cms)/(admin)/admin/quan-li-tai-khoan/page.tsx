import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import AdminUsersTable from "@/components/cms/admin/AdminUsersTable";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { userService } from "@/services/user.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminNguoiDungPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const limit = 10;

  const result = await userService
    .getAdminUsers({
      page: currentPage,
      limit,
    })
    .catch(() => ({ data: [], meta: undefined }));

  const users = result.data ?? [];
  const totalItems = result.meta?.total ?? users.length;
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="Quản lí tài khoản"
        searchPlaceholder="Tìm kiếm người dùng"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminUsersTable
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    </section>
  );
}
