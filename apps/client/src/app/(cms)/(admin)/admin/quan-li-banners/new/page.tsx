import type { Metadata } from "next";

import { createBannerAction } from "@/actions/admin-crud.actions";
import AdminBannerCreateForm from "@/components/cms/admin/AdminBannerCreateForm";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Tạo banner",
  description: "Tạo banner mới trong CMS Admin.",
  pathname: "/admin/quan-li-banners/new",
});

export default function AdminBannerCreatePage() {
  return (
    <section className="layout-container layout-section-sm">
      <AdminBannerCreateForm
        submitAction={createBannerAction}
        title="Tạo banner"
        description="Nhập thông tin cần thiết để tạo banner mới."
        submitLabel="Tạo mới"
      />
    </section>
  );
}
