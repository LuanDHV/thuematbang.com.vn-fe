import AdminPropertiesTable from "@/components/cms/admin/AdminPropertiesTable";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
  resolveSearchQueryValue,
} from "@/lib/server/server-side";
import { propertyService } from "@/services/property.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminChoThuePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);

  const limit = 10;

  const result = await propertyService
    .getAll({
      page: currentPage,
      limit,
      filters: {
        q: searchQuery,

        sortBy: "viewCount",
        sortOrder: "desc",
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const properties = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminPropertiesTable
        properties={properties}
        currentPage={currentPage}
        totalPages={totalPages}
        toolbar={{
          title: "Quản lí tin cho thuê",
          searchPlaceholder: "Tìm kiếm theo tên, mã hoặc slug",
          searchValue,
          actionLabel: "Tạo mới",
          actionHref: "/admin/quan-li-tin-cho-thue/new",
        }}
      />
    </section>
  );
}
