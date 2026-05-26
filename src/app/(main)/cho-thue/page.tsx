import type { Metadata } from "next";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import SafeFetch from "@/components/common/SafeFetch";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import { buildPropertyFilterBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/constants/pageSeoFaq";
import { propertyService } from "@/services/property.service";

export const metadata: Metadata = createPageMetadata({
  title: "Cho thuê mặt bằng",
  description: "Tổng hợp mặt bằng cho thuê mới nhất trên toàn quốc.",
  pathname: "/cho-thue",
});

export default async function ChoThuePage() {
  // Load static SEO/FAQ content for rental listing page.
  const pageContent = pageSeoFaq["cho-thue"];
  console.log("[server] Fetch properties", {
    limit: 8,
  });
  return (
    <>
      <SafeFetch
        fetcher={propertyService.getAll({
          limit: 24,
        })}
      >
        {(response) => (
          <ListingFilterSection
            title="Cho thuê bất động sản"
            properties={response.data ?? []}
            listingMode="property"
            serverDriven
            basePath="/cho-thue"
            breadcrumbItems={buildPropertyFilterBreadcrumbs("/cho-thue")}
            paginationMeta={response.meta}
          />
        )}
      </SafeFetch>
      <PageSeoContent content={pageContent.seoContent} />
      <PageFaq
        title={pageContent.faqTitle}
        description={pageContent.faqDescription}
        items={pageContent.faqs}
      />
    </>
  );
}
