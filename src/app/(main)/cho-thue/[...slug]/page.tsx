import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import PropertyDetailContent from "@/components/listing-detail/property/PropertyDetailContent";
import PropertyDetailSidebar from "@/components/listing-detail/property/PropertyDetailSidebar";
import {
  buildPropertyFilterBreadcrumbs,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/mocks/pageSeoFaq";
import { getPropertyGalleryImages, getPropertyThumbnailUrl, mockProperties } from "@/mocks/properties";
import { mockUsers } from "@/mocks/users";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function getPropertyDetail(slug: string) {
  return mockProperties.find((property) => property.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = slug.join("-");
  const property = getPropertyDetail(rawSlug);

  if (property) {
    const propertyDescription =
      property.content?.replace(/<[^>]+>/g, "").trim() ||
      "Chi tiết tin đăng cho thuê.";
    return createPageMetadata({
      title: property.title,
      description: propertyDescription,
      pathname: `/cho-thue/${property.slug}`,
      image: getPropertyThumbnailUrl(property.id),
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
  const rawSlug = slug.join("-");
  const property = getPropertyDetail(rawSlug);

  if (property) {
    const cookieStore = await cookies();
    const isLoggedIn =
      Boolean(cookieStore.get("accessToken")?.value) ||
      Boolean(cookieStore.get("token")?.value) ||
      Boolean(cookieStore.get("authToken")?.value);

    const poster = mockUsers.find((user) => user.id === property.userId);
    const locationText = [
      property.addressDetail,
      property.ward?.name,
      property.district?.name,
      property.city?.name,
    ]
      .filter(Boolean)
      .join(", ");

    const rentalOutProperties = mockProperties.filter(
      (item) => item.id !== property.id,
    );

    const featuredProperties = mockProperties
      .filter((item) => item.isFeatured)
      .slice(0, 6);

    const viewedProperties = rentalOutProperties.slice(0, 3);

    const galleryImages = getPropertyGalleryImages(property.id);

    const hasCoordinates =
      typeof property.latitude === "number" &&
      typeof property.longitude === "number";

    const mapSrc = hasCoordinates
      ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`
      : null;

    const citySlug = property.city?.slug;
    const relatedCategoryCityLinks = citySlug
      ? mockProperties
          .filter(
            (item) =>
              item.cityId === property.cityId &&
              item.category?.slug &&
              item.category?.name,
          )
          .map((item) => ({
            label: `${item.category?.name} khu vực ${property.city?.name}`,
            href: `/cho-thue/${item.category?.slug}-khu-vuc-tp-${citySlug}`,
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
            isLoggedIn={isLoggedIn}
            relatedCategoryCityLinks={relatedCategoryCityLinks}
          />
        </div>
      </article>
    );
  }

  const initialFilters = parsePropertyFilterSlug(rawSlug);
  const pageContent = pageSeoFaq["cho-thue"];
  const rentalOutProperties = mockProperties;

  if (!rentalOutProperties.length) {
    notFound();
  }

  return (
    <>
      <ListingFilterSection
        title="Cho thuê bất động sản"
        properties={rentalOutProperties}
        listingMode="property"
        basePath="/cho-thue"
        initialFilters={initialFilters}
        breadcrumbItems={buildPropertyFilterBreadcrumbs("/cho-thue", rawSlug)}
      />
      <PageSeoContent content={pageContent.seoContent} />
      <PageFaq
        title={pageContent.faqTitle}
        description={pageContent.faqDescription}
        items={pageContent.faqs}
      />
    </>
  );
}

