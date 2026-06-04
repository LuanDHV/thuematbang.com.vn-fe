import AdminCategoriesTable from "@/components/cms/admin/AdminCategoriesTable";
import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import {
  resolveSearchQueryValue,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { categoryService } from "@/services/category.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const result = await categoryService
    .getAll({
      filters: {
        q: searchQuery,
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="Quản lí danh mục"
        searchPlaceholder="Tìm kiếm theo tên"
        actionLabel="Tạo mới"
        key={searchValue ?? ""}
        searchValue={searchValue}
      />

      <AdminCategoriesTable items={items} currentPage={1} totalPages={1} />
    </section>
  );
}
