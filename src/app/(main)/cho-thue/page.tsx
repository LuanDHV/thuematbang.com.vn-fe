import type { Metadata } from "next";
import { connection } from "next/server";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import SafeFetch from "@/components/common/SafeFetch";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import { buildPropertyFilterBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaqService } from "@/services/page-seo-faq.service";
import { propertyService } from "@/services/property.service";

export const metadata: Metadata = createPageMetadata({
  title: "Cho thuê mặt bằng",
  description: "Tổng hợp mặt bằng cho thuê mới nhất trên toàn quốc.",
  pathname: "/cho-thue",
});

export default async function ChoThuePage() {
  await connection();

  // Load static SEO/FAQ content for rental listing page.
  const pageContent = await pageSeoFaqService.getPageSeoFaq("cho-thue");

  return (
    <>
      <SafeFetch
        fetcher={propertyService.getAll({
          limit: 24,
        })}
        debugLabel="Properties Response"
      >
        {(response) => (
          <ListingFilterSection
            properties={response.data ?? []}
            listingMode="property"
            serverDriven
            basePath="/cho-thue"
            breadcrumbItems={buildPropertyFilterBreadcrumbs("/cho-thue")}
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
