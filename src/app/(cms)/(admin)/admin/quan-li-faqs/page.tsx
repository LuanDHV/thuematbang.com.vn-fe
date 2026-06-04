import AdminFaqsTable from "@/components/cms/admin/AdminFaqsTable";
import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import {
  resolvePaginationServer,
  resolveSearchQueryValue,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { faqService } from "@/services/faq.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminFaqsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const result = await faqService
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
      <AdminListToolbar
        eyebrow="Quản lí FAQS"
        searchPlaceholder="Tìm kiếm theo câu hỏi"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminFaqsTable
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
