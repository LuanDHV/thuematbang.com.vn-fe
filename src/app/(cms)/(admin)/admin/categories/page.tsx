import AdminCategoriesTable from "@/components/cms/admin/AdminCategoriesTable";
import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import { resolveSearchParamValue } from "@/lib/server-side";
import { categoryService } from "@/services/category.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function matchesText(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const result = await categoryService
    .getAll()
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const filteredItems = searchValue
    ? items.filter(
        (item) =>
          matchesText(item.name, searchValue) ||
          matchesText(item.slug, searchValue) ||
          matchesText(item.type, searchValue),
      )
    : items;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="CMS Admin"
        title="Quản lý danh mục"
        description="Danh sách taxonomy theo type để kiểm tra nội dung hiển thị và cấu trúc slug."
        searchPlaceholder="Tìm kiếm danh mục"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminCategoriesTable items={filteredItems} />
    </section>
  );
}
