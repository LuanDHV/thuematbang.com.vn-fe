import AdminLeadsTable from "@/components/cms/admin/AdminLeadsTable";
import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import {
  resolvePaginationServer,
  resolveSearchQueryValue,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { leadService } from "@/services/lead.service";
import type { LeadStatus } from "@/types/enums";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const statusValue = resolveSearchParamValue(resolvedSearchParams, "status");
  const limit = 10;
  const status =
    statusValue &&
    (
      ["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "REJECTED"] as LeadStatus[]
    ).includes(statusValue as LeadStatus)
      ? (statusValue as LeadStatus)
      : undefined;

  const result = await leadService
    .getAll({
      page: currentPage,
      limit,
      filters: {
        q: searchQuery,
        status,
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="Quản lí leads"
        searchPlaceholder="Tìm kiếm tên, email hoặc sđt"
        actionLabel="Tạo mới"
        key={searchValue ?? ""}
        searchValue={searchValue}
      />

      <AdminLeadsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
