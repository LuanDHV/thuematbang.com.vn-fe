import type { Metadata } from "next";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import { buildPropertyFilterBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/constants/pageSeoFaq";
import { rentRequestService } from "@/services/rent-request.service";
import SafeFetch from "@/components/common/SafeFetch";

export const metadata: Metadata = createPageMetadata({
  title: "Cần thuê mặt bằng",
  description: "Tổng hợp nhu cầu cần thuê mặt bằng, văn phòng và nhà phố.",
  pathname: "/can-thue",
});

export default async function CanThuePage() {
  // Load static SEO/FAQ content for rent request page.
  const pageContent = pageSeoFaq["can-thue"];
  console.log("[server] Fetch rent requests", {
    limit: 8,
  });

  return (
    <>
      <SafeFetch
        fetcher={rentRequestService.getAll({
          limit: 24,
        })}
      >
        {(response) => (
          <ListingFilterSection
            title="Cần thuê bất động sản"
            properties={response.data ?? []}
            listingMode="rentRequest"
            serverDriven
            basePath="/can-thue"
            breadcrumbItems={buildPropertyFilterBreadcrumbs("/can-thue")}
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
