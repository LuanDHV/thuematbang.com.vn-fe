import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import AdminRentRequestsTable from "@/components/cms/admin/AdminRentRequestsTable";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { rentRequestService } from "@/services/rent-request.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCanThuePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const limit = 10;

  const result = await rentRequestService
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
        eyebrow="Quản lí tin cần thuê"
        searchPlaceholder="Tìm kiếm tin cần thuê"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminRentRequestsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
