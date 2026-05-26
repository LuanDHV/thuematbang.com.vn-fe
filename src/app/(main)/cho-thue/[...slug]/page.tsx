import type { Metadata } from "next";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import PropertyDetailContent from "@/components/listing-detail/property/PropertyDetailContent";
import PropertyDetailSidebar from "@/components/listing-detail/property/PropertyDetailSidebar";
import {
  buildPropertyFilterBreadcrumbs,
  isLikelyPropertyFilterSlug,
  parsePagedSlugSegments,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/constants/pageSeoFaq";
import { Property } from "@/types/property";
import { propertyService } from "@/services/property.service";
import { locationService } from "@/services/location.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};
const RELATED_ITEMS_LIMIT = 24;

// Build province/ward label sources from current payload as breadcrumb fallback.
function buildLocationContextFromProperties(properties: Property[]) {
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

  if (imageUrls.length > 0) return imageUrls;
  return ["/imgs/wallpaper-1.jpg"];
}

async function resolveProperty(rawSlug: string) {
  try {
    return await propertyService.getBySlug(rawSlug);
  } catch {
    return null;
  }
}

async function resolvePropertyIfDetailSlug(rawSlug?: string) {
  // A filter-like slug should be handled by listing mode, not detail mode.
  if (!rawSlug || isLikelyPropertyFilterSlug(rawSlug)) {
    return null;
  }
  return resolveProperty(rawSlug);
}

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
  // Parse slug + optional /pN segment from dynamic route.
  const { slug } = await params;
  const { rawSlug, page } = parsePagedSlugSegments(slug);
  const pageContent = pageSeoFaq["cho-thue"];
  const property = await resolvePropertyIfDetailSlug(rawSlug);

  // Detail branch: render a single property page when slug is a real property slug.
  if (property) {
    let properties: Property[] = [];
    try {
      // Fetch related properties for detail sidebar blocks.
      const pagePayload = await propertyService.getAll({
        page: 1,
        limit: RELATED_ITEMS_LIMIT,
      });
      properties = pagePayload.data ?? [];
    } catch {
      properties = [];
    }

    const poster = property.user ?? undefined;
    const locationText = [
      property.addressDetail,
      property.ward?.name,
      property.province?.name,
    ]
      .filter(Boolean)
      .join(", ");

    const rentalOutProperties = properties.filter(
      (item) => item.id !== property.id,
    );
    const featuredProperties = properties
      .filter((item) => item.isFeatured)
      .slice(0, 6);
    const viewedProperties = rentalOutProperties.slice(0, 3);
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
            label: `${item.category?.name}  khu vực ${property.province?.name}`,
            href: `/cho-thue/${item.category?.slug}-khu-vuc-${citySlug}`,
          }))
          .filter(
            (item, index, arr) =>
              arr.findIndex((x) => x.href === item.href) === index,
          )
      : [];

    return (
      <article className="mx-auto max-w-7xl px-4 py-8">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Cho thuê", href: "/cho-thue" },
            { label: property.title },
          ]}
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          <PropertyDetailContent
            property={property}
            locationText={locationText}
            galleryImages={galleryImages}
            mapSrc={mapSrc}
            featuredProperties={featuredProperties}
            viewedProperties={viewedProperties}
          />
          <PropertyDetailSidebar
            poster={poster}
            isLoggedIn
            relatedCategoryCityLinks={relatedCategoryCityLinks}
          />
        </div>
      </article>
    );
  }

  const initialFilters = parsePropertyFilterSlug(rawSlug);
  // Listing branch: fetch paginated data from API using parsed page.
  const listFetcher = rawSlug
    ? propertyService.getAllByFlatSlug({
        flatSlug: rawSlug,
        page,
        limit: RELATED_ITEMS_LIMIT,
      })
    : propertyService.getAll({ page, limit: RELATED_ITEMS_LIMIT });
  const paginationBasePath = rawSlug ? `/cho-thue/${rawSlug}` : "/cho-thue";
  let locationContext: ReturnType<typeof buildLocationContextFromProperties> = {
    provinces: [],
    wards: [],
  };
  try {
    // Prefer canonical location labels from API for breadcrumb accuracy.
    const provinces = await locationService.getProvinces();
    const wardsByProvince = await Promise.all(
      provinces.map((province) => locationService.getWards(province.id)),
    );
    locationContext = {
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
    locationContext = { provinces: [], wards: [] };
  }

  return (
    <>
      <SafeFetch fetcher={listFetcher}>
        {(response) => {
          // Fallback to payload-derived labels when location API is unavailable.
          const fallbackLocationContext = buildLocationContextFromProperties(
            response.data ?? [],
          );
          const breadcrumbLocationContext =
            locationContext.provinces.length || locationContext.wards.length
              ? locationContext
              : fallbackLocationContext;
          return (
            <ListingFilterSection
              title="Cho thuê bất động sản"
              properties={response.data ?? []}
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
      <PageSeoContent content={pageContent.seoContent} />
      <PageFaq
        title={pageContent.faqTitle}
        description={pageContent.faqDescription}
        items={pageContent.faqs}
      />
    </>
  );
}
