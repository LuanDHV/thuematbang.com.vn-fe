import AdminBannersTable from "@/components/cms/admin/AdminBannersTable";
import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { bannersService } from "@/services/banners.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function matchesText(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export default async function AdminBannersPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const limit = 10;

  const result = await bannersService
    .getAll({
      page: currentPage,
      limit,
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;
  const filteredItems = searchValue
    ? items.filter(
        (item) =>
          matchesText(item.title, searchValue) ||
          matchesText(item.page, searchValue) ||
          matchesText(item.position, searchValue) ||
          matchesText(item.targetLink ?? "", searchValue),
      )
    : items;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="CMS Admin"
        title="Quản lý banner"
        description="Banner hiển thị theo page và position, có phân trang từ backend."
        searchPlaceholder="Tìm kiếm banner"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminBannersTable
        items={filteredItems}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
