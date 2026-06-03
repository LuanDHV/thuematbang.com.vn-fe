import type { Metadata } from "next";
import { connection } from "next/server";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import { buildPropertyFilterBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaqService } from "@/services/page-seo-faq.service";
import { rentRequestService } from "@/services/rent-request.service";
import SafeFetch from "@/components/common/SafeFetch";

export const metadata: Metadata = createPageMetadata({
  title: "Cần thuê mặt bằng",
  description: "Tổng hợp nhu cầu cần thuê mặt bằng, văn phòng và nhà phố.",
  pathname: "/can-thue",
});

export default async function CanThuePage() {
  await connection();

  // Load static SEO/FAQ content for rent request page.
  const pageContent = await pageSeoFaqService.getPageSeoFaq("can-thue");

  return (
    <>
      <SafeFetch
        fetcher={rentRequestService.getAll({
          limit: 24,
        })}
        debugLabel="Rent-Requests Response"
      >
        {(response) => (
          <ListingFilterSection
            properties={response.data ?? []}
            listingMode="rentRequest"
            serverDriven
            basePath="/can-thue"
            breadcrumbItems={buildPropertyFilterBreadcrumbs("/can-thue")}
            paginationMeta={response.meta}
          />
        )}
      </SafeFetch>

      {pageContent.seoContent ? (
        <PageSeoContent content={pageContent.seoContent} />
      ) : null}
      {pageContent.faqs.length > 0 ? (
        <PageFaq
          title={pageContent.faqTitle}
          description={pageContent.faqDescription}
          items={pageContent.faqs}
        />
      ) : null}
    </>
  );
}
