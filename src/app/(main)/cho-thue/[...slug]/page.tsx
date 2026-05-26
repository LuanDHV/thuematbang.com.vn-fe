import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import PropertyDetailContent from "@/components/listing-detail/property/PropertyDetailContent";
import PropertyDetailSidebar from "@/components/listing-detail/property/PropertyDetailSidebar";
import {
  buildPropertyFilterBreadcrumbs,
  parsePagedSlugSegments,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/constants/pageSeoFaq";
import { Property } from "@/types/property";
import { propertyService } from "@/services/property.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { rawSlug } = parsePagedSlugSegments(slug);
  const property = rawSlug ? await resolveProperty(rawSlug) : null;

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
  const limit = 12;
  const pageContent = pageSeoFaq["cho-thue"];
  const property = rawSlug ? await resolveProperty(rawSlug) : null;

  if (property) {
    let properties: Property[] = [];
    try {
      const pagePayload = await propertyService.getAll({ page: 1, limit: 24 });
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
  const listFetcher = rawSlug
    ? propertyService.getAllByFlatSlug({ flatSlug: rawSlug, page, limit })
    : propertyService.getAll({ page, limit });
  const paginationBasePath = rawSlug ? `/cho-thue/${rawSlug}` : "/cho-thue";

  return (
    <>
      <SafeFetch fetcher={listFetcher}>
        {(response) => {
          const rentalOutProperties = response.data ?? [];
          if (!rentalOutProperties.length) {
            notFound();
          }

          return (
            <ListingFilterSection
              title="Cho thuê bất động sản"
              properties={rentalOutProperties}
              listingMode="property"
              serverDriven
              basePath="/cho-thue"
              paginationBasePath={paginationBasePath}
              initialFilters={initialFilters}
              breadcrumbItems={buildPropertyFilterBreadcrumbs(
                "/cho-thue",
                rawSlug,
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
