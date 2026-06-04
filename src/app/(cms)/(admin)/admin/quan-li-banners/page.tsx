import AdminBannersTable from "@/components/cms/admin/AdminBannersTable";
import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import {
  resolvePaginationServer,
  resolveSearchQueryValue,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { bannersService } from "@/services/banners.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminBannersPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const limit = 10;

  const result = await bannersService
    .getAll({
      page: currentPage,
      limit,
      filters: {
        q: searchQuery,
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="Quản lí banner"
        searchPlaceholder="Tìm kiếm theo tiêu đề"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminBannersTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
