import Link from "next/link";

import UserMarketplaceCasesTable from "@/components/cms/user/UserMarketplaceCasesTable";
import { leadService, type MarketplaceCaseType } from "@/services/lead.service";
import { resolvePaginationServer } from "@/lib/server/server-side";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function resolveTab(value: string | string[] | undefined): MarketplaceCaseType {
  const resolved = Array.isArray(value) ? value[0] : value;
  return resolved === "RENT_REQUEST" ? "RENT_REQUEST" : "PROPERTY";
}

export default async function UserMarketplaceCasesPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const currentTab = resolveTab(resolvedSearchParams?.tab);
  const result = await leadService
    .getMyMarketplaceCases({
      type: currentTab,
      page: currentPage,
      limit: 10,
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <div className="surface-panel p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/quan-li-tai-khoan/ho-so?tab=PROPERTY"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === "PROPERTY"
                ? "bg-primary text-white"
                : "bg-muted text-body"
            }`}
          >
            Hồ sơ liên hệ
          </Link>
          <Link
            href="/quan-li-tai-khoan/ho-so?tab=RENT_REQUEST"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === "RENT_REQUEST"
                ? "bg-primary text-white"
                : "bg-muted text-body"
            }`}
          >
            Hồ sơ nhu cầu
          </Link>
        </div>
      </div>

      <UserMarketplaceCasesTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
        title={currentTab === "PROPERTY" ? "Hồ sơ liên hệ" : "Hồ sơ nhu cầu"}
      />
    </section>
  );
}
