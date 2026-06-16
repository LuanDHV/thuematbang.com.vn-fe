import type { Metadata } from "next";
import { connection } from "next/server";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import { buildPropertyFilterBreadcrumbs } from "@/lib/listing/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { faqService } from "@/services/faq.service";
import { seoContentService } from "@/services/seo-content.service";
import { rentRequestService } from "@/services/rent-request.service";
import SafeFetch from "@/components/common/SafeFetch";

export const metadata: Metadata = createPageMetadata({
  title: "Cần thuê mặt bằng",
  description: "Tổng hợp nhu cầu cần thuê mặt bằng, văn phòng và nhà phố.",
  pathname: "/can-thue",
});

export default async function CanThuePage() {
  await connection();

  const [seoRes, faqRes] = await Promise.all([
    seoContentService.getByPage("can-thue").catch(() => ({ data: null })),
    faqService.getByPage("can-thue").catch(() => ({ data: { page: "can-thue", faqs: [] } })),
  ]);

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
