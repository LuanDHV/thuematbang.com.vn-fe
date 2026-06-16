import type { Metadata } from "next";

import { createNewsAction } from "@/actions/admin-crud.actions";
import AdminNewsForm from "@/components/cms/admin/AdminNewsForm";
import CmsBackLink from "@/components/cms/shared/CmsBackLink";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";

export const metadata: Metadata = createPageMetadata({
  title: "Tạo tin tức",
  description: "Tạo tin tức trong CMS Admin.",
  pathname: "/admin/quan-li-tin-tuc/new",
});

export default async function AdminNewsCreatePage() {
  const categoriesResponse = await categoryService.getAll({
    filters: {
      type: "NEWS",
    },
    revalidate: 300,
  });

  const categories = categoriesResponse.data ?? [];

  return (
    <section className="layout-container layout-section-sm">
      <div className="mb-4">
        <CmsBackLink href="/admin/quan-li-tin-tuc" />
      </div>
      <AdminNewsForm
        categories={categories}
        submitAction={createNewsAction}
        title="Tạo tin tức"
        description="Nhập nội dung bài viết mới cho CMS."
        submitLabel="Tạo mới"
      />
    </section>
  );
}
