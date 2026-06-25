import type { Metadata } from "next";

import { createRentRequestAction } from "@/actions/listing-create.actions";
import { RentRequestCreateForm } from "@/components/listing-form/RentRequestCreateForm";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";

export const metadata: Metadata = createPageMetadata({
  title: "Đăng tin cần thuê",
  description: "Đăng tin cần thuê bất động sản nhanh chóng và dễ dàng.",
  pathname: "/dang-tin/can-thue",
});

export default async function DangTinCanThuePage() {
  const [categoriesResponse, provinces] = await Promise.all([
    categoryService.getAll({
      filters: {
        type: "RENT_REQUEST",
      },
      revalidate: 300,
    }),
    locationService.getProvinces(),
  ]);

  const rentRequestCategories = categoriesResponse.data ?? [];

  return (
    <section className="layout-container layout-section-sm">
      <RentRequestCreateForm
        categories={rentRequestCategories}
        provinces={provinces}
        submitAction={createRentRequestAction}
        title="Thông tin nhu cầu cần thuê"
        description="Hãy mô tả rõ nhu cầu để tin cần thuê dễ được đối tác phù hợp nhìn thấy."
        submitLabel="Đăng yêu cầu thuê"
      />
    </section>
  );
}
