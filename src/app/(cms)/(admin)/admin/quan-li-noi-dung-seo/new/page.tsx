import type { Metadata } from "next";

import { createSeoContentAction } from "@/actions/admin-crud.actions";
import AdminSeoContentForm from "@/components/cms/admin/AdminSeoContentForm";
import CmsBackLink from "@/components/cms/shared/CmsBackLink";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Tạo nội dung SEO",
  description: "Tạo nội dung SEO trong CMS Admin.",
  pathname: "/admin/quan-li-noi-dung-seo/new",
});

export default function AdminSeoContentCreatePage() {
  return (
    <section className="layout-container layout-section-sm">
      <div className="mb-4">
        <CmsBackLink href="/admin/quan-li-noi-dung-seo" />
      </div>
      <AdminSeoContentForm
        submitAction={createSeoContentAction}
        title="Tạo nội dung SEO"
        description="Nhập nội dung SEO cho từng trang hiển thị."
        submitLabel="Tạo mới"
      />
    </section>
  );
}
