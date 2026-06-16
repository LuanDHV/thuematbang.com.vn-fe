import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { updateSeoContentAction } from "@/actions/admin-crud.actions";
import AdminSeoContentForm from "@/components/cms/admin/AdminSeoContentForm";
import CmsBackLink from "@/components/cms/shared/CmsBackLink";
import type { PageValue } from "@/constants/enum-values";
import { createPageMetadata } from "@/lib/metadata";
import { seoContentService } from "@/services/seo-content.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Chỉnh sửa nội dung SEO",
  description: "Cập nhật nội dung SEO trong CMS Admin.",
  pathname: "/admin/quan-li-noi-dung-seo",
});

export default async function AdminSeoContentEditPage({ params }: PageProps) {
  const { id } = await params;
  const seoContentId = Number(id);

  if (!Number.isInteger(seoContentId) || seoContentId <= 0) {
    notFound();
  }

  let seoContent;
  try {
    seoContent = await seoContentService.getById(seoContentId);
  } catch {
    notFound();
  }

  return (
    <section className="layout-container layout-section-sm">
      <div className="mb-4">
        <CmsBackLink href="/admin/quan-li-noi-dung-seo" />
      </div>
      <AdminSeoContentForm
        submitAction={updateSeoContentAction.bind(null, seoContent.id)}
        title={`Chỉnh sửa nội dung SEO #${seoContent.id}`}
        description="Cập nhật nội dung SEO cho một trang cụ thể."
        submitLabel="Lưu thay đổi"
        pageReadOnly
        defaultValues={{
          page: seoContent.page as PageValue,
          seoContent: seoContent.seoContent ?? "",
        }}
      />
    </section>
  );
}
