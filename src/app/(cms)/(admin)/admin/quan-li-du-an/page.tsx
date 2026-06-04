import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import AdminProjectsTable from "@/components/cms/admin/AdminProjectsTable";
import {
  resolvePaginationServer,
  resolveSearchQueryValue,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { projectService } from "@/services/project.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDuAnPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const limit = 10;

  const result = await projectService
    .getAll({
      page: currentPage,
      limit,
      filters: {
        q: searchQuery,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="Quản lí dự án"
        searchPlaceholder="Tìm kiếm theo tên hoặc slug"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminProjectsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
