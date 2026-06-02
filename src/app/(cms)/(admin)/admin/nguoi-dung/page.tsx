import AdminUsersTable from "@/components/cms/admin/AdminUsersTable";
import { resolveAdminPage } from "@/lib/admin-page";
import { readAuthCookies } from "@/app/api/v1/_utils/auth";
import { userService } from "@/services/user.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminNguoiDungPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolveAdminPage(resolvedSearchParams);
  const limit = 10;
  const { accessToken } = await readAuthCookies();

  const result = await userService
    .getAdminUsers({
      page: currentPage,
      limit,
    }, {
      accessToken: accessToken ?? "",
    })
    .catch(() => ({ data: [], meta: undefined }));

  const users = result.data ?? [];
  const totalItems = result.meta?.total ?? users.length;
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
          CMS Admin
        </p>
        <h1 className="text-heading text-xl font-semibold tracking-[-0.03em] md:text-2xl">
          Quản lý người dùng
        </h1>
        <p className="text-secondary text-sm leading-7 md:text-base">
          Dữ liệu người dùng được lấy từ endpoint admin riêng để làm mẫu cho các
          module CRUD sau này.
        </p>
      </div>

      <AdminUsersTable
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    </section>
  );
}
