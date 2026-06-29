import type { Metadata } from "next";

import { createRentRequestAction } from "@/actions/listing-create.actions";
import { RentRequestCreateForm } from "@/components/listing-form/RentRequestCreateForm";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";

export const metadata: Metadata = createPageMetadata({
  title: "Đăng tin cần thuê",
  description:
    "Đăng tin cần thuê bất động sản nhanh chóng và dễ dàng, giúp bạn mô tả rõ nhu cầu tìm mặt bằng, văn phòng hay kho xưởng để tiếp cận đúng đối tác phù hợp hơn.",
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
        description="Cung cấp thông tin nhu cầu thuê chi tiết để tăng khả năng kết nối với đối tác phù hợp."
        submitLabel="Đăng yêu cầu thuê"
      />
    </section>
  );
}
