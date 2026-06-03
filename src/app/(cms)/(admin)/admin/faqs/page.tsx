import AdminFaqsTable from "@/components/cms/admin/AdminFaqsTable";
import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import {
  resolvePaginationServer,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { faqService } from "@/services/faq.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function matchesText(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export default async function AdminFaqsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvePaginationServer(resolvedSearchParams);
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const result = await faqService
    .getAll({
      page: currentPage,
      limit: 10,
    })
    .catch(() => ({ data: [], meta: undefined }));

  const items = result.data ?? [];
  const totalPages = result.meta?.totalPage ?? 1;
  const filteredItems = searchValue
    ? items.filter(
        (item) =>
          matchesText(item.page, searchValue) ||
          matchesText(item.question, searchValue) ||
          matchesText(item.answer, searchValue),
      )
    : items;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="CMS Admin"
        title="Quản lý FAQ"
        description="Danh sách câu hỏi thường gặp theo trang để kiểm tra nội dung public và SEO."
        searchPlaceholder="Tìm kiếm FAQ"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminFaqsTable
        items={filteredItems}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
