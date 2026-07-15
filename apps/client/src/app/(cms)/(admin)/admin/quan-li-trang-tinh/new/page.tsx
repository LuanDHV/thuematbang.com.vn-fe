import type { Metadata } from "next";

import { createStaticPageAction } from "@/actions/admin-crud.actions";
import AdminStaticPageForm from "@/components/cms/admin/AdminStaticPageForm";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Tạo trang tĩnh",
  description: "Tạo nội dung HTML cho trang tĩnh trong CMS Admin.",
  pathname: "/admin/quan-li-trang-tinh/new",
});

export default function AdminStaticPageCreatePage() {
  return (
    <section className="layout-container layout-section-sm">
      <AdminStaticPageForm
        submitAction={createStaticPageAction}
        title="Tạo trang tĩnh"
        description="Nhập site code và nội dung HTML để xuất bản trang mới."
        submitLabel="Tạo mới"
        defaultValues={{
          siteCode: "",
          content: "",
          isPublished: true,
        }}
      />
    </section>
  );
}
