import type { Metadata } from "next";
import { connection } from "next/server";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import SafeFetch from "@/components/common/SafeFetch";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import { buildPropertyFilterBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { faqService } from "@/services/faq.service";
import { seoContentService } from "@/services/seo-content.service";
import { propertyService } from "@/services/property.service";

export const metadata: Metadata = createPageMetadata({
  title: "Cho thuê mặt bằng",
  description: "Tổng hợp mặt bằng cho thuê mới nhất trên toàn quốc.",
  pathname: "/cho-thue",
});

export default async function ChoThuePage() {
  await connection();

  const [seoRes, faqRes] = await Promise.all([
    seoContentService.getByPage("cho-thue").catch(() => ({ data: null })),
    faqService
      .getByPage("cho-thue")
      .catch(() => ({ data: { page: "cho-thue", faqs: [] } })),
  ]);

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
      <PageSeoContent seoData={seoRes.data} />
      <PageFaq
        title={seoRes.data?.faqTitle}
        description={seoRes.data?.faqDescription}
        faqData={faqRes.data}
      />
    </>
  );
}
