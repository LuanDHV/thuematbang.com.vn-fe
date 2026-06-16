import type { Metadata } from "next";

import { createPropertyAction } from "@/actions/listing-create.actions";
import { PropertyCreateForm } from "@/components/listing-form/PropertyCreateForm";
import CmsBackLink from "@/components/cms/shared/CmsBackLink";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";

export const metadata: Metadata = createPageMetadata({
  title: "Tạo tin cho thuê",
  description: "Tạo tin cho thuê trong CMS Admin.",
  pathname: "/admin/quan-li-tin-cho-thue/new",
});

export default async function AdminPropertyCreatePage() {
  const [categoriesResponse, provinces] = await Promise.all([
    categoryService.getAll({
      filters: {
        type: "PROPERTY",
      },
      revalidate: 300,
    }),
    locationService.getProvinces(),
  ]);

  const propertyCategories = categoriesResponse.data ?? [];

  return (
    <section className="layout-container layout-section-sm">
      <div className="mb-4">
        <CmsBackLink href="/admin/quan-li-tin-cho-thue" />
      </div>
      <PropertyCreateForm
        categories={propertyCategories}
        provinces={provinces}
        submitAction={createPropertyAction}
        title="Tạo tin cho thuê"
        description="Nhập đầy đủ dữ liệu để tạo một tin cho thuê mới trong CMS."
        submitLabel="Tạo tin"
        mode="admin-edit-full"
        showSuccessDialog={false}
      />
    </section>
  );
}
