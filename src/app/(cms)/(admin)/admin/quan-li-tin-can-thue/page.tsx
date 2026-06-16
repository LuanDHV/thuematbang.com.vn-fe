import AdminRentRequestsTable from "@/components/cms/admin/AdminRentRequestsTable";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
  resolveSearchQueryValue,
} from "@/lib/server-side";
import { rentRequestService } from "@/services/rent-request.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCanThuePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const limit = 10;

  const result = await rentRequestService
    .getAll({
      page: currentPage,
      limit,
      filters: {
        q: searchQuery,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminRentRequestsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
        toolbar={{
          title: "Quản lí tin cần thuê",
          searchPlaceholder: "Tìm kiếm theo tên hoặc slug",
          searchValue,
          actionLabel: "Tạo mới",
          actionHref: "/admin/quan-li-tin-can-thue/new",
        }}
      />
    </section>
  );
}
