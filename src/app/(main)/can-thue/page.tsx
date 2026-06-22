import type { Metadata } from "next";
import { connection } from "next/server";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import PageStructuredData from "@/components/common/PageStructuredData";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import { buildPropertyFilterBreadcrumbs } from "@/lib/listing/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { buildWebPageSchema } from "@/lib/seo";
import { faqService } from "@/services/faq.service";
import { rentRequestService } from "@/services/rent-request.service";
import { seoContentService } from "@/services/seo-content.service";

export const metadata: Metadata = createPageMetadata({
  title: "Cần thuê bất động sản",
  description: "Tổng hợp nhu cầu cần thuê bất động sản mới nhất.",
  pathname: "/can-thue",
});

export default async function CanThuePage() {
  await connection();

  const [seoRes, faqRes] = await Promise.all([
    seoContentService.getByPage("can-thue").catch(() => ({ data: null })),
    faqService
      .getByPage("can-thue")
      .catch(() => ({ data: { page: "can-thue", faqs: [] } })),
  ]);

  return (
    <>
      <PageStructuredData
        schemas={[
          buildWebPageSchema({
            title: "Cần thuê bất động sản",
            description: "Tổng hợp nhu cầu cần thuê bất động sản mới nhất.",
            url: "/can-thue",
            schemaType: "CollectionPage",
          }),
        ]}
      />
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
            basePath="/can-thue"
            breadcrumbItems={buildPropertyFilterBreadcrumbs("/can-thue")}
            paginationMeta={response.meta}
          />
        )}
      </SafeFetch>

      <PageSeoContent seoData={seoRes.data} />
      <PageFaq faqData={faqRes.data} />
    </>
  );
}
