import { PropertyCreateForm } from "@/components/listing-form/property-create-form";
import { createPropertyAction } from "@/actions/listing-create.actions";
import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";
import { createPageMetadata } from "@/lib/metadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = createPageMetadata({
  title: "Đăng tin cho thuê",
  description: "Đăng tin cho thuê bất động sản nhanh chóng và dễ dàng.",
  pathname: "/dang-tin/cho-thue",
});

export default async function DangTinChoThuePage() {
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
      <PropertyCreateForm
        categories={propertyCategories}
        provinces={provinces}
        submitAction={createPropertyAction}
        title="Thông tin tin cho thuê"
        description="Hãy nhập đầy đủ thông tin cơ bản để tin đăng hiển thị rõ ràng hơn trên trang tìm kiếm."
        submitLabel="Đăng tin cho thuê"
      />
    </section>
  );
}
