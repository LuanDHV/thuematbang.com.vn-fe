import type { Metadata } from "next";

import { createProjectAction } from "@/actions/admin-crud.actions";
import AdminProjectForm from "@/components/cms/admin/AdminProjectForm";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";

export const metadata: Metadata = createPageMetadata({
  title: "Tạo dự án",
  description: "Tạo dự án trong CMS Admin.",
  pathname: "/admin/quan-li-du-an/new",
});

export default async function AdminProjectCreatePage() {
  const [categoriesResponse, provinces] = await Promise.all([
    categoryService.getAll({
      filters: {
        type: "PROJECT",
      },
      revalidate: 300,
    }),
    locationService.getProvinces(),
  ]);

  const categories = categoriesResponse.data ?? [];

  return (
    <section className="layout-container layout-section-sm">
      <AdminProjectForm
        categories={categories}
        provinces={provinces}
        submitAction={createProjectAction}
        title="Tạo dự án"
        description="Nhập đầy đủ thông tin để tạo dự án mới."
        submitLabel="Tạo mới"
      />
    </section>
  );
}
