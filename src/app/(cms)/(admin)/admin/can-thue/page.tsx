import AdminRentRequestsTable from "@/components/cms/admin/AdminRentRequestsTable";
import { rentRequestService } from "@/services/rent-request.service";
import { resolveAdminPage } from "@/lib/admin-page";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCanThuePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolveAdminPage(resolvedSearchParams);
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
  const totalItems = result.meta?.total ?? items.length;
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
          CMS Admin
        </p>
        <h1 className="text-heading text-xl font-semibold tracking-[-0.03em] md:text-2xl">
          Quản lý cần thuê
        </h1>
        <p className="text-secondary text-sm leading-7 md:text-base">
          Danh sách nhu cầu cần thuê thật từ API để kiểm tra luồng admin.
        </p>
      </div>

      <AdminRentRequestsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    </section>
  );
}
