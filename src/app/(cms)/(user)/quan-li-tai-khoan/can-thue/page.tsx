import UserRentRequestsTable from "@/components/cms/user/UserRentRequestsTable";
import { resolveAdminPage } from "@/lib/admin-page";
import { rentRequestService } from "@/services/rent-request.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UserMyRentRequestsPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolveAdminPage(resolvedSearchParams);
  const limit = 10;

  const result = await rentRequestService
    .getMine({
      page: currentPage,
      limit,
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalItems = result.meta?.total ?? items.length;
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
          CMS User
        </p>
        <h1 className="text-heading text-xl font-semibold tracking-[-0.03em] md:text-2xl">
          Nhu cầu thuê của tôi
        </h1>
        <p className="text-secondary text-sm leading-7 md:text-base">
          Danh sách nhu cầu thuê của bạn sẽ được nối từ endpoint
          `/me/rent-requests`.
        </p>
      </div>

      <UserRentRequestsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    </section>
  );
}
