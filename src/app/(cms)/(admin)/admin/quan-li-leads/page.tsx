import AdminLeadsTable from "@/components/cms/admin/AdminLeadsTable";
import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { leadService } from "@/services/lead.service";
import type { LeadStatus } from "@/types/enums";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function matchesText(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
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
        status,
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;
  const filteredItems = searchValue
    ? items.filter(
        (item) =>
          matchesText(item.fullName, searchValue) ||
          matchesText(item.phone, searchValue) ||
          matchesText(item.email ?? "", searchValue) ||
          matchesText(item.source, searchValue) ||
          matchesText(item.status, searchValue) ||
          matchesText(item.message ?? "", searchValue) ||
          matchesText(String(item.propertyId ?? ""), searchValue) ||
          matchesText(String(item.userId ?? ""), searchValue),
      )
    : items;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="Quản lí leads"
        searchPlaceholder="Tìm kiếm lead"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminLeadsTable
        items={filteredItems}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
