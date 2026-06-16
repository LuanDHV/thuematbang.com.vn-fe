import type { Metadata } from "next";

import { createRentRequestAction } from "@/actions/listing-create.actions";
import { RentRequestCreateForm } from "@/components/listing-form/RentRequestCreateForm";
import CmsBackLink from "@/components/cms/shared/CmsBackLink";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";

export const metadata: Metadata = createPageMetadata({
  title: "Tạo tin cần thuê",
  description: "Tạo tin cần thuê trong CMS Admin.",
  pathname: "/admin/quan-li-tin-can-thue/new",
});

export default async function AdminRentRequestCreatePage() {
  const [categoriesResponse, provinces] = await Promise.all([
    categoryService.getAll({
      filters: {
        type: "RENT_REQUEST",
      },
      revalidate: 300,
    }),
    locationService.getProvinces(),
  ]);

  const categories = categoriesResponse.data ?? [];

  return (
    <section className="layout-container layout-section-sm">
      <div className="mb-4">
        <CmsBackLink href="/admin/quan-li-tin-can-thue" />
      </div>
      <RentRequestCreateForm
        categories={categories}
        provinces={provinces}
        submitAction={createRentRequestAction}
        title="Tạo tin cần thuê"
        description="Nhập đầy đủ dữ liệu để tạo một nhu cầu cần thuê mới."
        submitLabel="Tạo yêu cầu"
        mode="admin-edit-full"
        showSuccessDialog={false}
      />
    </section>
  );
}
