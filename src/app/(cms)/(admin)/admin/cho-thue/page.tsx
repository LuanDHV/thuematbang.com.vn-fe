import AdminPropertiesTable from "@/components/cms/admin/AdminPropertiesTable";
import { propertyService } from "@/services/property.service";
import { resolveAdminPage } from "@/lib/admin-page";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminChoThuePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolveAdminPage(resolvedSearchParams);
  const limit = 10;

  const result = await propertyService
    .getAll({
      page: currentPage,
      limit,
      filters: {
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const properties = result.data ?? [];
  const totalItems = result.meta?.total ?? properties.length;
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
          CMS Admin
        </p>
        <h1 className="text-heading text-xl font-semibold tracking-[-0.03em] md:text-2xl">
          Quản lý cho thuê
        </h1>
        <p className="text-secondary text-sm leading-7 md:text-base">
          Danh sách tin cho thuê lấy trực tiếp từ API public, dùng làm module
          mẫu cho admin.
        </p>
      </div>

      <AdminPropertiesTable
        properties={properties}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    </section>
  );
}
