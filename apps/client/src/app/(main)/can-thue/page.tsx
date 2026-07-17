import type { Metadata } from "next";
import { connection } from "next/server";
import { cache } from "react";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import PageStructuredData from "@/components/common/PageStructuredData";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import { buildPropertyFilterBreadcrumbs } from "@/lib/listing/flat-url";
import { buildLatestListingTitle, createPageMetadata } from "@/lib/metadata";
import { buildWebPageSchema } from "@/lib/seo";
import { faqService } from "@/services/faq.service";
import { rentRequestService } from "@/services/rent-request.service";
import { seoContentService } from "@/services/seo-content.service";

const RENT_REQUEST_PATH = "/can-thue";
const RENT_REQUEST_TITLE = buildLatestListingTitle("Nhu cầu thuê bất động sản");
const RENT_REQUEST_SCHEMA_TITLE = buildLatestListingTitle("Cần thuê mặt bằng");
const RENT_REQUEST_DESCRIPTION =
  "Tìm nhanh các nhu cầu cần thuê bất động sản mới nhất, từ mặt bằng kinh doanh, văn phòng đến kho xưởng và căn hộ, giúp bạn kết nối đúng khách hàng theo khu vực, ngân sách và diện tích phù hợp.";

const resolveSeoContent = cache(async (path: string) => {
  const response = await seoContentService
    .resolveByPath(path)
    .catch(() => ({ data: null }));
  return response.data;
});

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await resolveSeoContent(RENT_REQUEST_PATH);

  return createPageMetadata({
    title: seoData?.metaTitle || RENT_REQUEST_TITLE,
    description: seoData?.metaDescription || RENT_REQUEST_DESCRIPTION,
    pathname: seoData?.targetPath || RENT_REQUEST_PATH,
  });
}

export default async function CanThuePage() {
  await connection();

  const [seoRes, faqRes] = await Promise.all([
    resolveSeoContent(RENT_REQUEST_PATH).then((data) => ({ data })),
    faqService
      .getByPage("can-thue")
      .catch(() => ({ data: { page: "can-thue", faqs: [] } })),
  ]);

  return (
    <>
      <PageStructuredData
        schemas={[
          buildWebPageSchema({
            title: seoRes.data?.metaTitle || RENT_REQUEST_SCHEMA_TITLE,
            description:
              seoRes.data?.metaDescription || RENT_REQUEST_DESCRIPTION,
            url: seoRes.data?.targetPath || RENT_REQUEST_PATH,
            schemaType: "CollectionPage",
          }),
        ]}
      />

      <SafeFetch
        fetcher={rentRequestService.getAll({
          filters: {
            status: "PUBLISHED",
            sortBy: "createdAt",
            sortOrder: "desc",
          },
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

      <PageFaq faqData={faqRes.data} />
      <PageSeoContent seoData={seoRes.data} />
    </>
  );
}
