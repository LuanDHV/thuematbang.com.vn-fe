import type { Metadata } from "next";
import { connection } from "next/server";
import { cache } from "react";
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

const PROPERTY_PATH = "/cho-thue";
const PROPERTY_TITLE = buildLatestListingTitle("Bất động sản cho thuê");
const PROPERTY_DESCRIPTION =
  "Khám phá tin bất động sản cho thuê mới nhất, bao gồm nhiều lựa chọn theo khu vực, diện tích, giá thuê và nhu cầu thực tế.";

const resolveSeoContent = cache(async (path: string) => {
  const response = await seoContentService
    .resolveByPath(path)
    .catch(() => ({ data: null }));
  return response.data;
});

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await resolveSeoContent(PROPERTY_PATH);

  return createPageMetadata({
    title: seoData?.metaTitle || PROPERTY_TITLE,
    description: seoData?.metaDescription || PROPERTY_DESCRIPTION,
    pathname: seoData?.targetPath || PROPERTY_PATH,
    image: seoData?.metaImageUrl || undefined,
  });
}

export default async function ChoThuePage() {
  await connection();

  const [seoRes, faqRes] = await Promise.all([
    resolveSeoContent(PROPERTY_PATH).then((data) => ({ data })),
    faqService
      .getByPage("cho-thue")
      .catch(() => ({ data: { page: "cho-thue", faqs: [] } })),
  ]);

  return (
    <>
      <PageStructuredData
        schemas={[
          buildWebPageSchema({
            title: seoRes.data?.metaTitle || PROPERTY_TITLE,
            description: seoRes.data?.metaDescription || PROPERTY_DESCRIPTION,
            url: seoRes.data?.targetPath || PROPERTY_PATH,
            image: seoRes.data?.metaImageUrl || undefined,
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
