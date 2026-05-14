import type { Metadata } from "next";
import { buildPropertyFilterBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import PropertyFilterSection from "@/components/filter/PropertyFilterSection";
import { mockProperties } from "@/mocks";
import PageSeoContent from "@/components/common/PageSeoContent";
import PageFaq from "@/components/common/PageFaq";
import { pageSeoFaq } from "@/mocks/pageSeoFaq";

export const metadata: Metadata = createPageMetadata({
  title: "Cho thuê mặt bằng",
  description: "Tổng hợp mặt bằng cho thuê mới nhất trên toàn quốc.",
  pathname: "/cho-thue",
});

export default function ChoThuePage() {
  const pageContent = pageSeoFaq["cho-thue"];
  const rentalOutProperties = mockProperties.filter(
    (property) => property.listingType === "RENT_OUT",
  );

  return (
    <>
      <PropertyFilterSection
        title="Cho thuê bất động sản"
        properties={rentalOutProperties}
        basePath="/cho-thue"
        breadcrumbItems={buildPropertyFilterBreadcrumbs("/cho-thue")}
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
