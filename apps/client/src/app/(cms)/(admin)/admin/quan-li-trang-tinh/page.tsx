import type { Metadata } from "next";

import AdminStaticPagesTable from "@/components/cms/admin/AdminStaticPagesTable";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
  resolveSearchQueryValue,
} from "@/lib/server/server-side";
import { staticPageService } from "@/services/static-page.service";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Quản lý trang tĩnh",
  description: "Quản lý nội dung HTML của các trang tĩnh trên CMS Admin.",
  pathname: "/admin/quan-li-trang-tinh",
});

export default async function AdminStaticPagesPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const result = await staticPageService
    .getAll({
      page: currentPage,
      limit: 10,
      filters: {
        q: searchQuery,
      },
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;

  return (
    <section className="space-y-5">
      <AdminStaticPagesTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
        toolbar={{
          title: "Quản lý trang tĩnh",
          searchPlaceholder: "Tìm kiếm theo site code",
          searchValue,
          actionLabel: "Tạo mới",
          actionHref: "/admin/quan-li-trang-tinh/new",
        }}
      />
    </section>
  );
}
