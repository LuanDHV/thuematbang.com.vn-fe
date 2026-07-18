import type { Metadata } from "next";
import { cache } from "react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PageStructuredData from "@/components/common/PageStructuredData";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import RandomLuckyPropertiesSection from "@/components/listing-client/RandomLuckyPropertiesSection";
import DetailTwoColumnLayout from "@/components/listing-detail/DetailTwoColumnLayout";
import PropertyDetailContent from "@/components/listing-detail/property/PropertyDetailContent";
import PropertyDetailSidebar from "@/components/listing-detail/property/PropertyDetailSidebar";
import {
  buildGoogleMapEmbedSrc,
  buildGoogleMapQuery,
} from "@/lib/location/google-map";
import {
  buildPropertyFilterBreadcrumbs,
  buildPropertyFilterPathFromRouteParts,
  isLikelyPropertyFilterSlug,
  parseListingPagedSlugSegments,
  parsePropertyFilterSlug,
} from "@/lib/listing/flat-url";
import {
  buildLatestListingTitle,
  buildPageTitle,
  createPageMetadata,
} from "@/lib/metadata";
import { buildMetaDescription, buildWebPageSchema } from "@/lib/seo";
import { faqService } from "@/services/faq.service";
import { Property } from "@/types/property";
import { propertyService } from "@/services/property.service";
import { locationService } from "@/services/location.service";
import { seoContentService } from "@/services/seo-content.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const PROPERTY_BASE_PATH = "/cho-thue";
const PROPERTY_LISTING_TITLE = buildLatestListingTitle("Bất động sản cho thuê");
const PROPERTY_LISTING_DESCRIPTION =
  "Danh sách bất động sản cho thuê mới nhất, giúp bạn lọc nhanh theo khu vực, diện tích, mức giá và loại hình phù hợp trước khi liên hệ.";

function buildSeoPath(rawSlug?: string) {
  return rawSlug ? `${PROPERTY_BASE_PATH}/${rawSlug}` : PROPERTY_BASE_PATH;
}

const resolveSeoContent = cache(async (path: string) => {
  const response = await seoContentService
    .resolveByPath(path)
    .catch(() => ({ data: null }));
  return response.data;
});

function buildLocationContextFromProperties(
  properties: Property[],
): Awaited<
  ReturnType<typeof locationService.resolvePropertyFilterLocationContext>
> {
  const provinces = Array.from(
    new Map(
      properties
        .filter((item) => item.province?.name && item.province?.slug)
        .map((item) => [item.province!.slug, item.province!]),
    ).values(),
  ).map((province) => ({
    id: province.id,
    name: province.name,
    slug: province.slug,
  }));

  const wards = Array.from(
    new Map(
      properties
        .filter((item) => item.ward?.name && item.ward?.slug)
        .map((item) => [item.ward!.slug, item.ward!]),
    ).values(),
  ).map((ward) => ({
    name: ward.name,
    slug: ward.slug,
    provinceId: ward.provinceId,
  }));

  return { provinces, wards };
}

function extractPropertyImages(property: Property) {
  const imageUrls =
    property.images
      ?.slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => image.imageUrl)
      .filter(Boolean) ?? [];

  return imageUrls.length > 0 ? imageUrls : ["/imgs/fallback.png"];
}

const resolveProperty = cache(async (rawSlug: string) => {
  try {
    return await propertyService.getBySlug(rawSlug);
  } catch {
    return null;
  }
});

async function resolvePropertyIfDetailSlug(rawSlug?: string) {
  if (!rawSlug) {
    return null;
  }

  try {
    return await resolveProperty(rawSlug);
  } catch {
    if (isLikelyPropertyFilterSlug(rawSlug)) {
      return null;
    }
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { rawSlug } = parseListingPagedSlugSegments(slug);
  const property = await resolvePropertyIfDetailSlug(rawSlug);

  if (property) {
    const locationText = [
      property.addressDetail,
      property.ward?.name,
      property.province?.name,
    ]
      .filter(Boolean)
      .join(", ");

    const propertyDescription = buildMetaDescription(
      [property.content, locationText, property.category?.name],
      "Xem chi tiết tin cho thuê, gồm vị trí, diện tích, giá thuê, mô tả tài sản và thông tin liên hệ để bạn đánh giá nhanh trước khi kết nối.",
    );

    const image = extractPropertyImages(property)[0];

    return createPageMetadata({
      title: buildPageTitle(property.title),
      description: propertyDescription,
      pathname: `/cho-thue/${property.slug}`,
      image,
      type: "article",
    });
  }

  const seoData = await resolveSeoContent(buildSeoPath(rawSlug));

  return createPageMetadata({
    title: seoData?.metaTitle || PROPERTY_LISTING_TITLE,
    description: seoData?.metaDescription || PROPERTY_LISTING_DESCRIPTION,
    pathname: seoData?.targetPath || buildSeoPath(rawSlug),
    image: seoData?.metaImageUrl || undefined,
  });
}

export default async function DynamicChoThuePage({ params }: PageProps) {
  const { slug } = await params;
  const { rawSlug, page } = parseListingPagedSlugSegments(slug);

  const faqRes = await faqService
    .getByPage("cho-thue")
    .catch(() => ({ data: { page: "cho-thue", faqs: [] } }));

  const property = await resolvePropertyIfDetailSlug(rawSlug);

  if (property) {
    let properties: Property[] = [];

    try {
      const { data } = await propertyService.getAll({
        page: 1,
        limit: 24,
        filters: {
          status: "PUBLISHED",
          sortBy: "priorityStatus",
          sortOrder: "desc",
        },
      });

      properties = data ?? [];
    } catch {
      properties = [];
    }

    const locationText = [
      property.addressDetail,
      property.ward?.name,
      property.province?.name,
    ]
      .filter(Boolean)
      .join(", ");

    const relatedProperties = properties.filter(
      (item) => item.id !== property.id,
    );

    const featuredProperties = relatedProperties
      .filter((item) => item.priorityStatus === "PREMIUM")
      .slice(0, 6);

    const viewedProperties = relatedProperties.slice(0, 3);

    const galleryImages = extractPropertyImages(property);

    const mapSrc = buildGoogleMapEmbedSrc({
      latitude: property.latitude,
      longitude: property.longitude,
      query: buildGoogleMapQuery([
        property.addressDetail,
        property.ward?.name,
        property.province?.name,
        "Vietnam",
      ]),
    });

    const provinceSlug = property.province?.slug;

    const relatedCategoryProvinceLinks = provinceSlug
      ? properties
          .filter(
            (item) =>
              item.provinceId === property.provinceId &&
              item.category?.slug &&
              item.category?.name,
          )
          .map((item) => ({
            label: `${item.category?.name} khu vuc ${property.province?.name}`,
            href: buildPropertyFilterPathFromRouteParts("/cho-thue", {
              categorySlug: item.category?.slug,
              provinceSlug,
            }),
          }))
          .filter(
            (item, index, arr) =>
              arr.findIndex((x) => x.href === item.href) === index,
          )
      : [];

    return (
      <article className="layout-container layout-section-sm">
        <PageStructuredData
          schemas={[
            buildWebPageSchema({
              title: buildPageTitle(property.title),
              description: buildMetaDescription(
                [property.content, locationText, property.category?.name],
                "Xem chi tiết tin cho thuê, gồm vị trí, diện tích, giá thuê, mô tả tài sản và thông tin liên hệ để bạn đánh giá nhanh trước khi kết nối.",
              ),
              url: `/cho-thue/${property.slug}`,
              image: galleryImages[0],
              datePublished: property.createdAt,
              dateModified: property.updatedAt,
            }),
          ]}
        />
        <DynamicBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Cho thuê", href: "/cho-thue" },
            { label: property.title },
          ]}
        />
        <DetailTwoColumnLayout
          main={
            <PropertyDetailContent
              property={property}
              locationText={locationText}
              galleryImages={galleryImages}
              mapSrc={mapSrc}
              featuredProperties={featuredProperties}
              viewedProperties={viewedProperties}
            />
          }
          aside={
            <PropertyDetailSidebar
              contactName={property.contactName}
              propertyId={property.id}
              relatedCategoryProvinceLinks={relatedCategoryProvinceLinks}
            />
          }
        />
      </article>
    );
  }

  const seoPath = buildSeoPath(rawSlug);
  const [seoRes, locationContext] = await Promise.all([
    resolveSeoContent(seoPath).then((data) => ({ data })),
    locationService.resolvePropertyFilterLocationContext(rawSlug),
  ]);

  const listFetcher = rawSlug
    ? propertyService.getAllByFlatSlug({
        flatSlug: rawSlug,
        page,
        limit: 24,
      })
    : propertyService.getAll({
        page,
        limit: 24,
        filters: {
          status: "PUBLISHED",
          sortBy: "priorityStatus",
          sortOrder: "desc",
        },
      });

  const paginationBasePath = rawSlug ? `/cho-thue/${rawSlug}` : "/cho-thue";

  return (
    <>
      <PageStructuredData
        schemas={[
          buildWebPageSchema({
            title: seoRes.data?.metaTitle || PROPERTY_LISTING_TITLE,
            description:
              seoRes.data?.metaDescription || PROPERTY_LISTING_DESCRIPTION,
            url: seoRes.data?.targetPath || seoPath,
            image: seoRes.data?.metaImageUrl || undefined,
            schemaType: "CollectionPage",
          }),
        ]}
      />

      <SafeFetch fetcher={listFetcher} debugLabel="Properties Dynamic Response">
        {(response) => {
          const properties = response.data ?? [];

          const fallbackLocationContext =
            buildLocationContextFromProperties(properties);

          const resolvedLocationContext = {
            provinces: locationContext.provinces.length
              ? locationContext.provinces
              : fallbackLocationContext.provinces,
            wards: locationContext.wards.length
              ? locationContext.wards
              : fallbackLocationContext.wards,
          };

          const initialFilters = parsePropertyFilterSlug(
            rawSlug,
            resolvedLocationContext,
          );

          return (
            <>
              <ListingFilterSection
                properties={properties}
                listingMode="property"
                basePath="/cho-thue"
                paginationBasePath={paginationBasePath}
                initialFilters={initialFilters}
                initialLocationContext={resolvedLocationContext}
                breadcrumbItems={buildPropertyFilterBreadcrumbs(
                  "/cho-thue",
                  rawSlug,
                  resolvedLocationContext,
                )}
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
