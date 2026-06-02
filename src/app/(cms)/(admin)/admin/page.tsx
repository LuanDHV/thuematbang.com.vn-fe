import AdminPropertiesTable from "@/components/cms/admin/AdminPropertiesTable";
import { propertyService } from "@/services/property.service";

type AdminDashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function resolvePage(
  searchParams: Record<string, string | string[] | undefined> | undefined,
) {
  const pageValue = searchParams?.page;
  const rawPage = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const nextPage = Number.parseInt(rawPage ?? "1", 10);

  return Number.isFinite(nextPage) && nextPage > 0 ? nextPage : 1;
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePage(resolvedSearchParams);
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
  const publishedCount = properties.filter(
    (item) => item.status === "PUBLISHED",
  ).length;
  const negotiableCount = properties.filter((item) => item.isNegotiable).length;

  return (
    <section className="layout-section-sm space-y-5">
      <div className="space-y-2">
        <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
          Dashboard
        </p>
        <h1 className="text-heading text-xl font-semibold tracking-[-0.03em] md:text-2xl">
          Bảng điều khiển quản trị
        </h1>
        <p className="text-secondary text-sm leading-7 md:text-base">
          Dữ liệu thật từ API public, hiển thị bằng `shadcn table` và action
          menu theo từng dòng để làm mẫu cho các module CMS khác.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="surface-card p-4">
          <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
            Tổng tin
          </p>
          <p className="text-heading mt-2 text-2xl font-semibold tracking-[-0.03em]">
            {totalItems}
          </p>
        </article>
        <article className="surface-card p-4">
          <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
            Đang hiển thị
          </p>
          <p className="text-heading mt-2 text-2xl font-semibold tracking-[-0.03em]">
            {properties.length}
          </p>
        </article>
        <article className="surface-card p-4">
          <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
            Đã đăng
          </p>
          <p className="text-heading mt-2 text-2xl font-semibold tracking-[-0.03em]">
            {publishedCount}
          </p>
        </article>
        <article className="surface-card p-4">
          <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
            Có thương lượng
          </p>
          <p className="text-heading mt-2 text-2xl font-semibold tracking-[-0.03em]">
            {negotiableCount}
          </p>
        </article>
      </div>

      <AdminPropertiesTable
        properties={properties}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
