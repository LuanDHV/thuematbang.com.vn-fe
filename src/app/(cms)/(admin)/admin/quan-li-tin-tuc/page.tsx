import AdminNewsTable from "@/components/cms/admin/AdminNewsTable";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
  resolveSearchQueryValue,
} from "@/lib/server-side";
import { newsService } from "@/services/news.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminTinTucPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const limit = 10;

  const result = await newsService
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

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminNewsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
        toolbar={{
          title: "Quản lý tin tức",
          searchPlaceholder: "Tìm kiếm theo tiêu đề hoặc slug",
          searchValue,
          actionLabel: "Tạo mới",
          actionHref: "/admin/quan-li-tin-tuc/new",
        }}
      />
    </section>
  );
}
