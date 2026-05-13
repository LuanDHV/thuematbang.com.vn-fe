import type { Metadata } from "next";
import ContentSEO from "@/components/cho-thue/ContentSEO";
import FAQ from "@/components/cho-thue/FAQ";
import { createPageMetadata } from "@/lib/metadata";
import { mockProperties } from "../../mocks/properties";
import PropertyFilterSection from "@/components/filter/PropertyFilterSection";

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
      <PropertyFilterSection
        title="Cần thuê bất động sản"
        properties={rentalDemandProperties}
      />
      <ContentSEO />
      <FAQ />
    </>
  );
}
