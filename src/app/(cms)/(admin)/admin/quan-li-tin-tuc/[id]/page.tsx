import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { updateNewsAction } from "@/actions/admin-crud.actions";
import AdminNewsForm from "@/components/cms/admin/AdminNewsForm";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";
import { newsService } from "@/services/news.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Chỉnh sửa tin tức",
  description: "Cập nhật tin tức trong CMS Admin.",
  pathname: "/admin/quan-li-tin-tuc",
});

export default async function AdminNewsEditPage({ params }: PageProps) {
  const { id } = await params;
  const newsId = Number(id);

  if (!Number.isInteger(newsId) || newsId <= 0) {
    notFound();
  }

  let news;
  try {
    news = await newsService.getById(newsId);
  } catch {
    notFound();
  }

  const categoriesResponse = await categoryService.getAll({
    filters: {
      type: "NEWS",
    },
    revalidate: 300,
  });

  const categories = categoriesResponse.data ?? [];

  return (
    <section className="layout-container layout-section-sm">
      <AdminNewsForm
        categories={categories}
        submitAction={updateNewsAction.bind(null, news.id)}
        title={`Chỉnh sửa tin tức #${news.id}`}
        description="Cập nhật nội dung bài viết tin tức."
        submitLabel="Lưu thay đổi"
        existingImageUrl={news.imageUrl}
        existingImagePublicId={news.imagePublicId ?? null}
        imageRequired={false}
        defaultValues={{
          categoryId: news.categoryId,
          title: news.title,
          slug: news.slug,
          summary: news.summary ?? "",
          content: news.content ?? "",
          status: news.status,
          isFeatured: news.isFeatured,
        }}
      />
    </section>
  );
}
