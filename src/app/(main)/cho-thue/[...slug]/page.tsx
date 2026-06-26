import type { Metadata } from "next";
import { cache } from "react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PageStructuredData from "@/components/common/PageStructuredData";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import DetailTwoColumnLayout from "@/components/listing-detail/DetailTwoColumnLayout";
import PropertyDetailContent from "@/components/listing-detail/property/PropertyDetailContent";
import PropertyDetailSidebar from "@/components/listing-detail/property/PropertyDetailSidebar";
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
import { readAuthCookies } from "@/lib/server/auth-cookies";
import { faqService } from "@/services/faq.service";
import { Property } from "@/types/property";
import { propertyService } from "@/services/property.service";
import { locationService } from "@/services/location.service";
import { seoContentService } from "@/services/seo-content.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

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

  return imageUrls.length > 0 ? imageUrls : ["/imgs/wallpaper-1.jpg"];
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
      "Chi tiết tin đăng cho thuê.",
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

  return createPageMetadata({
    title: buildLatestListingTitle("Bất động sản cho thuê"),
    description: "Danh sách  bất động sản cho thuê mới nhất.",
    pathname: rawSlug ? `/cho-thue/${rawSlug}` : "/cho-thue",
  });
}

export default async function DynamicChoThuePage({ params }: PageProps) {
  const { slug } = await params;
  const { rawSlug, page } = parseListingPagedSlugSegments(slug);
  const { accessToken } = await readAuthCookies();
  const isLoggedIn = Boolean(accessToken);

  const [seoRes, faqRes] = await Promise.all([
    seoContentService.getByPage("cho-thue").catch(() => ({ data: null })),
    faqService
      .getByPage("cho-thue")
      .catch(() => ({ data: { page: "cho-thue", faqs: [] } })),
  ]);

  const property = await resolvePropertyIfDetailSlug(rawSlug);

  if (property) {
    let properties: Property[] = [];

    try {
      const { data } = await propertyService.getAll({
        page: 1,
        limit: 24,
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

    const hasCoordinates =
      typeof property.latitude === "number" &&
      typeof property.longitude === "number";

    const mapSrc = hasCoordinates
      ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`
      : null;

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
                "Chi tiết tin đăng cho thuê.",
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
              contactPhone={property.contactPhone}
              isLoggedIn={isLoggedIn}
              relatedCategoryProvinceLinks={relatedCategoryProvinceLinks}
            />
          }
        />
      </article>
    );
  }

  const locationContext =
    await locationService.resolvePropertyFilterLocationContext(rawSlug);

  const listFetcher = rawSlug
    ? propertyService.getAllByFlatSlug({
        flatSlug: rawSlug,
        page,
        limit: 24,
      })
    : propertyService.getAll({
        page,
        limit: 24,
      });

  const paginationBasePath = rawSlug ? `/cho-thue/${rawSlug}` : "/cho-thue";

  return (
    <>
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
          );
        }}
      </SafeFetch>

      <PageSeoContent seoData={seoRes.data} />
      <PageFaq faqData={faqRes.data} />
    </>
  );
}
