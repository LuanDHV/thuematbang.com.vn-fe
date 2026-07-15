import UserRentRequestsTable from "@/components/cms/user/UserRentRequestsTable";
import { resolvePaginationServer } from "@/lib/server/server-side";
import { rentRequestService } from "@/services/rent-request.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UserMyRentRequestsPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const limit = 10;

  const result = await rentRequestService
    .getMine({
      page: currentPage,
      limit,
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section>
      <UserRentRequestsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
