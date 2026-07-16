import type { Metadata } from "next";
import { connection } from "next/server";
import PageStructuredData from "@/components/common/PageStructuredData";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import SafeFetch from "@/components/common/SafeFetch";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import RandomLuckyPropertiesSection from "@/components/listing-client/RandomLuckyPropertiesSection";
import { buildPropertyFilterBreadcrumbs } from "@/lib/listing/flat-url";
import { buildLatestListingTitle, createPageMetadata } from "@/lib/metadata";
import { buildWebPageSchema } from "@/lib/seo";
import { faqService } from "@/services/faq.service";
import { seoContentService } from "@/services/seo-content.service";
import { propertyService } from "@/services/property.service";

export const metadata: Metadata = createPageMetadata({
  title: buildLatestListingTitle("Bất động sản cho thuê"),
  description:
    "Khám phá tin bất động sản cho thuê mới nhất, bao gồm mặt bằng, văn phòng, kho xưởng, căn hộ và nhiều lựa chọn theo khu vực, diện tích, giá thuê và nhu cầu thực tế.",
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
      <PageStructuredData
        schemas={[
          buildWebPageSchema({
            title: buildLatestListingTitle("Bất động sản cho thuê"),
            description:
              "Khám phá tin bất động sản cho thuê mới nhất, bao gồm mặt bằng, văn phòng, kho xưởng, căn hộ và nhiều lựa chọn theo khu vực, diện tích, giá thuê và nhu cầu thực tế.",
            url: "/cho-thue",
            schemaType: "CollectionPage",
          }),
        ]}
      />

      <SafeFetch
        fetcher={propertyService.getAll({
          filters: {
            status: "PUBLISHED",
            sortBy: "priorityStatus",
            sortOrder: "desc",
          },
          limit: 24,
        })}
        debugLabel="Properties Response"
      >
        {(response) => {
          const properties = response.data ?? [];

          return (
            <>
              <ListingFilterSection
                properties={properties}
                listingMode="property"
                basePath="/cho-thue"
                breadcrumbItems={buildPropertyFilterBreadcrumbs("/cho-thue")}
                paginationMeta={response.meta}
              />
              <RandomLuckyPropertiesSection
                excludeIds={properties.map((property) => property.id)}
              />
            </>
          );
        }}
      </SafeFetch>
      <PageFaq faqData={faqRes.data} />
      <PageSeoContent seoData={seoRes.data} />
    </>
  );
}
