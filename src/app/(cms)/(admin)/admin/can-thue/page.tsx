import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import AdminRentRequestsTable from "@/components/cms/admin/AdminRentRequestsTable";
import { resolveAdminPage, resolveSearchParamValue } from "@/lib/admin-page";
import { rentRequestService } from "@/services/rent-request.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCanThuePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolveAdminPage(resolvedSearchParams);
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
        eyebrow="CMS Admin"
        title="Quản lý cần thuê"
        description="Danh sách nhu cầu cần thuê thật từ API để kiểm tra luồng admin."
        searchPlaceholder="Tìm kiếm nhu cầu"
        createLabel="Tạo nhu cầu"
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
