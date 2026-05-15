import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import PropertyFilterSection from "@/components/filter/PropertyFilterSection";
import PropertyDetailMain from "@/components/property-detail/PropertyDetailMain";
import PropertyDetailSidebarRentWanted from "@/components/property-detail/PropertyDetailSidebarRentWanted";
import {
  buildPropertyFilterBreadcrumbs,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/mocks/pageSeoFaq";
import { mockProperties } from "@/mocks/properties";
import { mockUsers } from "@/mocks/users";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function getPropertyDetail(slug: string) {
  return mockProperties.find(
    (property) => property.listingType === "RENT_WANTED" && property.slug === slug,
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = slug.join("-");
  const property = getPropertyDetail(rawSlug);

  if (property) {
    return createPageMetadata({
      title: property.title,
      description: property.description || "Chi tiết nhu cầu cần thuê.",
      pathname: `/can-thue/${property.slug}`,
      image: property.thumbnailUrl || undefined,
      type: "article",
    });
  }

  return createPageMetadata({
    title: "Cần thuê mặt bằng",
    description: "Danh sách cần thuê bất động sản theo bộ lọc.",
    pathname: `/can-thue/${slug.join("/")}`,
  });
}

export default async function DynamicCanThuePage({ params }: PageProps) {
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

    const rentalWantedProperties = mockProperties.filter(
      (item) => item.listingType === "RENT_WANTED" && item.id !== property.id,
    );

    const featuredProperties = mockProperties
      .filter((item) => item.listingType === "RENT_WANTED" && item.isFeatured)
      .slice(0, 6);

    const viewedProperties = rentalWantedProperties.slice(0, 3);
    const latestWantedProperties = mockProperties
      .filter(
        (item) => item.listingType === "RENT_WANTED" && item.id !== property.id,
      )
      .sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 10);

    const galleryImages = [
      property.thumbnailUrl || "/imgs/wallpaper-1.jpg",
      ...rentalWantedProperties
        .slice(0, 6)
        .map((item) => item.thumbnailUrl || "/imgs/wallpaper-1.jpg"),
    ];

    const hasCoordinates =
      typeof property.latitude === "number" &&
      typeof property.longitude === "number";

    const mapSrc = hasCoordinates
      ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`
      : null;

    return (
      <article className="mx-auto max-w-7xl px-4 py-8">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Cần thuê", href: "/can-thue" },
            { label: property.title },
          ]}
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          <PropertyDetailMain
            property={property}
            locationText={locationText}
            galleryImages={galleryImages}
            mapSrc={mapSrc}
            featuredProperties={featuredProperties}
            viewedProperties={viewedProperties}
          />
          <PropertyDetailSidebarRentWanted
            poster={poster}
            isLoggedIn={isLoggedIn}
            latestWantedProperties={latestWantedProperties}
          />
        </div>
      </article>
    );
  }

  const initialFilters = parsePropertyFilterSlug(rawSlug);
  const pageContent = pageSeoFaq["can-thue"];
  const rentalDemandProperties = mockProperties.filter(
    (item) => item.listingType === "RENT_WANTED",
  );

  if (!rentalDemandProperties.length) {
    notFound();
  }

  return (
    <>
      <PropertyFilterSection
        title="Cần thuê bất động sản"
        properties={rentalDemandProperties}
        basePath="/can-thue"
        initialFilters={initialFilters}
        breadcrumbItems={buildPropertyFilterBreadcrumbs("/can-thue", rawSlug)}
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

