import type { Metadata } from "next";
import { cache } from "react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import DetailTwoColumnLayout from "@/components/listing-detail/DetailTwoColumnLayout";
import PropertyDetailContent from "@/components/listing-detail/property/PropertyDetailContent";
import PropertyDetailSidebar from "@/components/listing-detail/property/PropertyDetailSidebar";
import {
  buildPropertyFilterBreadcrumbs,
  isLikelyPropertyFilterSlug,
  parsePagedSlugSegments,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { readAuthCookies } from "@/lib/server/auth-cookies";
import { pageSeoFaqService } from "@/services/page-seo-faq.service";
import { Property } from "@/types/property";
import { propertyService } from "@/services/property.service";
import { locationService } from "@/services/location.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

type LocationContext = {
  provinces: { name: string; slug: string }[];
  wards: { name: string; slug: string }[];
};

function buildLocationContextFromProperties(
  properties: Property[],
): LocationContext {
  const provinces = Array.from(
    new Map(
      properties
        .filter((item) => item.province?.name && item.province?.slug)
        .map((item) => [item.province!.slug, item.province!]),
    ).values(),
  ).map((province) => ({
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

const resolveLocationContext = cache(async (): Promise<LocationContext> => {
  try {
    const provinces = await locationService.getProvinces();

    const wardsByProvince = await Promise.all(
      provinces.map((province) => locationService.getWards(province.id)),
    );

    return {
      provinces: provinces.map((item) => ({
        name: item.name,
        slug: item.slug,
      })),
      wards: wardsByProvince.flat().map((item) => ({
        name: item.name,
        slug: item.slug,
      })),
    };
  } catch {
    return { provinces: [], wards: [] };
  }
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { rawSlug } = parsePagedSlugSegments(slug);
  const property = await resolvePropertyIfDetailSlug(rawSlug);

  if (property) {
    const propertyDescription =
      property.content?.replace(/<[^>]+>/g, "").trim() ||
      "Chi tiết tin đăng cho thuê.";

    const image = extractPropertyImages(property)[0];

    return createPageMetadata({
      title: property.title,
      description: propertyDescription,
      pathname: `/cho-thue/${property.slug}`,
      image,
      type: "article",
    });
  }

  return createPageMetadata({
    title: "Cho thuê mặt bằng",
    description: "Danh sách cho thuê bất động sản theo bộ lọc.",
    pathname: `/cho-thue/${slug.join("/")}`,
  });
}

export default async function DynamicChoThuePage({ params }: PageProps) {
  const { slug } = await params;
  const { rawSlug, page } = parsePagedSlugSegments(slug);
  const { accessToken } = await readAuthCookies();
  const isLoggedIn = Boolean(accessToken);
  const pageContent = await pageSeoFaqService.getPageSeoFaq("cho-thue");
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
      .filter((item) => item.isFeatured)
      .slice(0, 6);

    const viewedProperties = relatedProperties.slice(0, 3);

    const galleryImages = extractPropertyImages(property);

    const hasCoordinates =
      typeof property.latitude === "number" &&
      typeof property.longitude === "number";

    const mapSrc = hasCoordinates
      ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`
      : null;

    const citySlug = property.province?.slug;

    const relatedCategoryCityLinks = citySlug
      ? properties
          .filter(
            (item) =>
              item.provinceId === property.provinceId &&
              item.category?.slug &&
              item.category?.name,
          )
          .map((item) => ({
            label: `${item.category?.name} khu vực ${property.province?.name}`,
            href: `/cho-thue/${item.category?.slug}-khu-vuc-${citySlug}`,
          }))
          .filter(
            (item, index, arr) =>
              arr.findIndex((x) => x.href === item.href) === index,
          )
      : [];

    return (
      <article className="layout-container layout-section-sm">
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
              relatedCategoryCityLinks={relatedCategoryCityLinks}
            />
          }
        />
      </article>
    );
  }

  const initialFilters = parsePropertyFilterSlug(rawSlug);

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
  const locationContext = await resolveLocationContext();

  return (
    <>
      <SafeFetch fetcher={listFetcher} debugLabel="Properties Dynamic Response">
        {(response) => {
          const properties = response.data ?? [];

          const fallbackLocationContext =
            buildLocationContextFromProperties(properties);

          const breadcrumbLocationContext =
            locationContext.provinces.length || locationContext.wards.length
              ? locationContext
              : fallbackLocationContext;

          return (
            <ListingFilterSection
              properties={properties}
              listingMode="property"
              serverDriven
              basePath="/cho-thue"
              paginationBasePath={paginationBasePath}
              initialFilters={initialFilters}
              breadcrumbItems={buildPropertyFilterBreadcrumbs(
                "/cho-thue",
                rawSlug,
                breadcrumbLocationContext,
              )}
              paginationMeta={response.meta}
            />
          );
        }}
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
