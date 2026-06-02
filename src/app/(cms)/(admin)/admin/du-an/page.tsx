import AdminProjectsTable from "@/components/cms/admin/AdminProjectsTable";
import { projectService } from "@/services/project.service";
import { resolveAdminPage } from "@/lib/admin-page";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDuAnPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolveAdminPage(resolvedSearchParams);
  const limit = 10;

  const result = await projectService
    .getAll({
      page: currentPage,
      limit,
      filters: {
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalItems = result.meta?.total ?? items.length;
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
          CMS Admin
        </p>
        <h1 className="text-heading text-xl font-semibold tracking-[-0.03em] md:text-2xl">
          Quản lý dự án
        </h1>
        <p className="text-secondary text-sm leading-7 md:text-base">
          Bảng dự án lấy từ API thật, cùng hệ action menu với module tin đăng.
        </p>
      </div>

      <AdminProjectsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    </section>
  );
}
