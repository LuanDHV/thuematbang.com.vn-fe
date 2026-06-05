import AdminSeoContentsTable from "@/components/cms/admin/AdminSeoContentsTable";
import {
  resolvePaginationServer,
  resolveSearchQueryValue,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { seoContentService } from "@/services/seo-content.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminSeoContentsPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const result = await seoContentService
    .getAll({
      page: currentPage,
      limit: 10,
      filters: {
        q: searchQuery,
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminSeoContentsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
        toolbar={{
          title: "Quản lí nội dung SEO",
          searchPlaceholder: "Tìm kiếm theo nội dung SEO",
          searchValue,
          actionLabel: "Tạo mới",
        }}
      />
    </section>
  );
}
