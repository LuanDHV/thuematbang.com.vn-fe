import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import RentRequestDetailContent from "@/components/listing-detail/rent-request/RentRequestDetailContent";
import RentRequestDetailSidebar from "@/components/listing-detail/rent-request/RentRequestDetailSidebar";
import {
  buildPropertyFilterBreadcrumbs,
  parsePagedSlugSegments,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/constants/pageSeoFaq";
import { RentRequest } from "@/types/rent-request";
import { rentRequestService } from "@/services/rent-request.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

async function resolveRentRequest(rawSlug: string) {
  try {
    return await rentRequestService.getBySlug(rawSlug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { rawSlug } = parsePagedSlugSegments(slug);
  const rentRequest = rawSlug ? await resolveRentRequest(rawSlug) : null;

  if (rentRequest) {
    return createPageMetadata({
      title: rentRequest.title,
      description: rentRequest.requirementText || "Chi tiết nhu cầu cần thuê.",
      pathname: `/can-thue/${rentRequest.slug}`,
      image: rentRequest.imageUrl || undefined,
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
  const { rawSlug, page } = parsePagedSlugSegments(slug);
  const limit = 12;
  const pageContent = pageSeoFaq["can-thue"];
  const rentRequest = rawSlug ? await resolveRentRequest(rawSlug) : null;

  if (rentRequest) {
    let rentRequests: RentRequest[] = [];
    try {
      const pagePayload = await rentRequestService.getAll({
        page: 1,
        limit: 24,
      });
      rentRequests = pagePayload.data ?? [];
    } catch {
      rentRequests = [];
    }

    const poster = rentRequest.user ?? undefined;
    const locationText = [
      rentRequest.desiredStreet?.name,
      rentRequest.desiredWard?.name,
      rentRequest.desiredProvince?.name,
    ]
      .filter(Boolean)
      .join(", ");

    const relatedRequests = rentRequests.filter(
      (item) => item.id !== rentRequest.id,
    );
    const viewedRequests = relatedRequests.slice(0, 3);
    const latestWantedRequests = relatedRequests
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
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
            isLoggedIn
            latestWantedProperties={latestWantedRequests}
            companyPhone={rentRequest.contactPhone ?? "0968688081"}
          />
        </div>
      </article>
    );
  }

  const initialFilters = parsePropertyFilterSlug(rawSlug);
  const listFetcher = rawSlug
    ? rentRequestService.getAllByFlatSlug({ flatSlug: rawSlug, page, limit })
    : rentRequestService.getAll({ page, limit });
  const paginationBasePath = rawSlug ? `/can-thue/${rawSlug}` : "/can-thue";

  return (
    <>
      <SafeFetch fetcher={listFetcher}>
        {(response) => {
          const rentRequests = response.data ?? [];
          if (!rentRequests.length) {
            notFound();
          }

          return (
            <ListingFilterSection
              title="Cần thuê bất động sản"
              properties={rentRequests}
              listingMode="rentRequest"
              serverDriven
              basePath="/can-thue"
              paginationBasePath={paginationBasePath}
              initialFilters={initialFilters}
              breadcrumbItems={buildPropertyFilterBreadcrumbs(
                "/can-thue",
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
