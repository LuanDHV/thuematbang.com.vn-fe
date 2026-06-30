import AdminLeadsTable from "@/components/cms/admin/AdminLeadsTable";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
  resolveSearchQueryValue,
} from "@/lib/server/server-side";
import { leadService } from "@/services/lead.service";
import type { LeadSourceFilter } from "@/types/lead";
import type { LeadStatus } from "@/types/enums";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type AdminLeadsPageSectionProps = {
  source: LeadSourceFilter;
  pageTitle: string;
  tableTitle: string;
  pageDescription: string;
  searchPlaceholder: string;
};

export default async function AdminLeadsPageSection({
  source,
  pageTitle,
  tableTitle,
  pageDescription,
  searchPlaceholder,
  searchParams,
}: AdminLeadsPageSectionProps & PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const statusValue = resolveSearchParamValue(resolvedSearchParams, "status");
  const limit = 10;
  const status =
    statusValue &&
    (["NEW", "CONTACTED", "QUALIFIED", "REJECTED"] as LeadStatus[]).includes(
      statusValue as LeadStatus,
    )
      ? (statusValue as LeadStatus)
      : undefined;

  const result = await leadService
    .getAll({
      page: currentPage,
      limit,
      filters: {
        q: searchQuery,
        status,
        source,
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-heading text-2xl font-semibold tracking-[-0.03em]">
          {pageTitle}
        </h1>
        <p className="text-secondary text-sm">{pageDescription}</p>
      </header>

      <AdminLeadsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
        source={source}
        toolbar={{
          title: tableTitle,
          searchPlaceholder,
          searchValue,
          actionLabel: "Tạo mới",
        }}
      />
    </section>
  );
}
