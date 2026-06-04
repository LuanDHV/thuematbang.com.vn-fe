import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import AdminPropertiesTable from "@/components/cms/admin/AdminPropertiesTable";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { propertyService } from "@/services/property.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminChoThuePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const limit = 10;

  const result = await propertyService
    .getAll({
      page: currentPage,
      limit,
      filters: {
        sortBy: "priorityStatus",
        sortOrder: "desc",
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const properties = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="Quản lí tin cho thuê"
        searchPlaceholder="Tìm kiếm tin cho thuê"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminPropertiesTable
        properties={properties}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
