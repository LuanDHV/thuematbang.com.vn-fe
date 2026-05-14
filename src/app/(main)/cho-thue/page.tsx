import type { Metadata } from "next";
import ContentSEO from "@/components/cho-thue/ContentSEO";
import FAQ from "@/components/cho-thue/FAQ";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { createPageMetadata } from "@/lib/metadata";
import PropertyFilterSection from "@/components/filter/PropertyFilterSection";
import { mockProperties } from "@/mocks";

export const metadata: Metadata = createPageMetadata({
  title: "Cho thuê mặt bằng",
  description: "Tổng hợp mặt bằng cho thuê mới nhất trên toàn quốc.",
  pathname: "/cho-thue",
});

export default function ChoThuePage() {
  const rentalOutProperties = mockProperties.filter(
    (property) => property.listingType === "RENT_OUT",
  );

  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <DynamicBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Cho thuê" },
          ]}
        />
      </div>
      <PropertyFilterSection
        stickyFilter
        title="Cho thuê bất động sản"
        properties={rentalOutProperties}
        basePath="/cho-thue"
      />
      <ContentSEO />
      <FAQ />
    </>
  );
}
