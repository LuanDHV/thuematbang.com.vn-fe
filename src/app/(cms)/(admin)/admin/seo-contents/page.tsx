import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import AdminSeoContentsTable from "@/components/cms/admin/AdminSeoContentsTable";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { seoContentService } from "@/services/seo-content.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function matchesText(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export default async function AdminSeoContentsPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const result = await seoContentService
    .getAll({
      page: currentPage,
      limit: 10,
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;
  const filteredItems = searchValue
    ? items.filter(
        (item) =>
          matchesText(item.page, searchValue) ||
          matchesText(item.seoContent ?? "", searchValue),
      )
    : items;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="CMS Admin"
        title="Quản lý SEO content"
        description="Nội dung SEO và FAQ metadata theo từng page để kiểm soát hiển thị public."
        searchPlaceholder="Tìm kiếm page SEO"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminSeoContentsTable
        items={filteredItems}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
