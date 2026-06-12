import UserPropertiesTable from "@/components/cms/user/UserPropertiesTable";
import { resolvePaginationServer } from "@/lib/server-side";
import { propertyService } from "@/services/property.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UserMyPropertiesPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const limit = 10;

  const result = await propertyService
    .getMine({
      page: currentPage,
      limit,
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section>
      <UserPropertiesTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
