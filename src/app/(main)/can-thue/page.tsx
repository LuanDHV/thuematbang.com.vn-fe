import type { Metadata } from "next";
import { buildPropertyFilterBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import PropertyFilterSection from "@/components/filter/PropertyFilterSection";
import { mockProperties } from "@/mocks";
import PageSeoContent from "@/components/common/PageSeoContent";
import PageFaq from "@/components/common/PageFaq";
import { pageSeoFaq } from "@/mocks/pageSeoFaq";

export const metadata: Metadata = createPageMetadata({
  title: "Cần thuê mặt bằng",
  description: "Tổng hợp nhu cầu cần thuê mặt bằng, văn phòng và nhà phố.",
  pathname: "/can-thue",
});

export default function CanThuePage() {
  const pageContent = pageSeoFaq["can-thue"];
  const rentalDemandProperties = mockProperties.filter(
    (property) => property.listingType === "RENT_WANTED",
  );

  return (
    <>
      <PropertyFilterSection
        title="Cần thuê bất động sản"
        properties={rentalDemandProperties}
        basePath="/can-thue"
        breadcrumbItems={buildPropertyFilterBreadcrumbs("/can-thue")}
      />
      <PageSeoContent content={pageContent.seoContent} />
      <PageFaq
        title={pageContent.faqTitle}
        description={pageContent.faqDescription}
        items={pageContent.faqs}
      />
    </>
  );
}
