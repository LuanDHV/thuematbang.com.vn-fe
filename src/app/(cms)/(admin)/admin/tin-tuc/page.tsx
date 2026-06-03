import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import AdminNewsTable from "@/components/cms/admin/AdminNewsTable";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { newsService } from "@/services/news.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminTinTucPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const limit = 10;

  const result = await newsService
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
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="CMS Admin"
        title="Quản lý tin tức"
        description="Bảng tin tức từ API thật để hoàn thiện content module admin."
        searchPlaceholder="Tìm kiếm bài viết"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminNewsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
