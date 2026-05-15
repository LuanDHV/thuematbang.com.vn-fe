import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import RentRequestDetailContent from "@/components/listing-detail/rent-request/RentRequestDetailContent";
import RentRequestDetailSidebar from "@/components/listing-detail/rent-request/RentRequestDetailSidebar";
import {
  buildPropertyFilterBreadcrumbs,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/mocks/pageSeoFaq";
import { mockRentRequests } from "@/mocks/rentRequests";
import { mockUsers } from "@/mocks/users";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function getRentRequestDetail(slug: string) {
  return mockRentRequests.find((request) => request.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = slug.join("-");
  const rentRequest = getRentRequestDetail(rawSlug);

  if (rentRequest) {
    return createPageMetadata({
      title: rentRequest.title,
      description: rentRequest.requirementText || "Chi tiết nhu cầu cần thuê.",
      pathname: `/can-thue/${rentRequest.slug}`,
      image: rentRequest.thumbnailUrl || undefined,
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
  const rentRequest = getRentRequestDetail(rawSlug);

  if (rentRequest) {
    const cookieStore = await cookies();
    const isLoggedIn =
      Boolean(cookieStore.get("accessToken")?.value) ||
      Boolean(cookieStore.get("token")?.value) ||
      Boolean(cookieStore.get("authToken")?.value);

    const poster = mockUsers.find((user) => user.id === rentRequest.userId);
    const locationText = [
      rentRequest.desiredStreet?.name,
      rentRequest.desiredWard?.name,
      rentRequest.desiredDistrict?.name,
      rentRequest.desiredCity?.name,
    ]
      .filter(Boolean)
      .join(", ");

    const relatedRequests = mockRentRequests.filter(
      (item) => item.id !== rentRequest.id,
    );

    const viewedRequests = relatedRequests.slice(0, 3);
    const latestWantedRequests = relatedRequests
      .slice()
      .sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 10);

    return (
      <article className="mx-auto max-w-7xl px-4 py-8">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Cần thuê", href: "/can-thue" },
            { label: rentRequest.title },
          ]}
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          <RentRequestDetailContent
            rentRequest={rentRequest}
            locationText={locationText}
            viewedRequests={viewedRequests}
          />
          <RentRequestDetailSidebar
            poster={poster}
            isLoggedIn={isLoggedIn}
            latestWantedProperties={latestWantedRequests}
            companyPhone={rentRequest.contactPhone ?? "0968688081"}
          />
        </div>
      </article>
    );
  }

  const initialFilters = parsePropertyFilterSlug(rawSlug);
  const pageContent = pageSeoFaq["can-thue"];
  const rentalDemandProperties = mockRentRequests;

  if (!rentalDemandProperties.length) {
    notFound();
  }

  return (
    <>
      <ListingFilterSection
        title="Cần thuê bất động sản"
        properties={rentalDemandProperties}
        listingMode="rentRequest"
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
