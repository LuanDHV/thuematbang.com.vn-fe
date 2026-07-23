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

export default async function UserSentLeadsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const currentTab = resolveTab(resolvedSearchParams?.tab);
  const result = await leadService
    .getMySentLeads({
      type: currentTab,
      page: currentPage,
      limit: 10,
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <div className="surface-panel space-y-4 p-4 md:p-5">
        <div className="space-y-1">
          <h1 className="text-heading text-2xl font-semibold">
            Liên hệ đã gửi
          </h1>
          <p className="text-secondary text-sm">
            Theo dõi các liên hệ bạn đã gửi và trạng thái xử lý hiện tại.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/quan-li-tai-khoan/lien-he-da-gui?tab=PROPERTY"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === "PROPERTY"
                ? "bg-primary text-white"
                : "text-body border bg-white"
            }`}
          >
            Liên hệ cho thuê
          </Link>
          <Link
            href="/quan-li-tai-khoan/lien-he-da-gui?tab=RENT_REQUEST"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === "RENT_REQUEST"
                ? "bg-primary text-white"
                : "text-body border bg-white"
            }`}
          >
            Liên hệ cần thuê
          </Link>
        </div>
      </div>

      <UserMarketplaceCasesTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
        title={
          currentTab === "PROPERTY" ? "Liên hệ cho thuê" : "Liên hệ cần thuê"
        }
        detailBasePath="/quan-li-tai-khoan/lien-he-da-gui"
      />
    </section>
  );
}
