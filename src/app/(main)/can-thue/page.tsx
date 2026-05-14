import type { Metadata } from "next";
import ContentSEO from "@/components/cho-thue/ContentSEO";
import FAQ from "@/components/cho-thue/FAQ";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { createPageMetadata } from "@/lib/metadata";

import PropertyFilterSection from "@/components/filter/PropertyFilterSection";
import { mockProperties } from "@/mocks";

export const metadata: Metadata = createPageMetadata({
  title: "Cần thuê mặt bằng",
  description: "Tổng hợp nhu cầu cần thuê mặt bằng, văn phòng và nhà phố.",
  pathname: "/can-thue",
});

export default function CanThuePage() {
  const rentalDemandProperties = mockProperties.filter(
    (property) => property.listingType === "RENT_WANTED",
  );

  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <DynamicBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Cần thuê" },
          ]}
        />
      </div>
      <PropertyFilterSection
        title="Cần thuê bất động sản"
        properties={rentalDemandProperties}
        basePath="/can-thue"
      />
      <ContentSEO />
      <FAQ />
    </>
  );
}
