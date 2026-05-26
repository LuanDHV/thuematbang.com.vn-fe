import type { Metadata } from "next";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import RentRequestDetailContent from "@/components/listing-detail/rent-request/RentRequestDetailContent";
import RentRequestDetailSidebar from "@/components/listing-detail/rent-request/RentRequestDetailSidebar";
import {
  buildPropertyFilterBreadcrumbs,
  isLikelyPropertyFilterSlug,
  parsePagedSlugSegments,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/constants/pageSeoFaq";
import { RentRequest } from "@/types/rent-request";
import { rentRequestService } from "@/services/rent-request.service";
import { locationService } from "@/services/location.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};
const RELATED_ITEMS_LIMIT = 24;

// Build province/ward label sources from current payload as breadcrumb fallback.
function buildLocationContextFromRentRequests(requests: RentRequest[]) {
  const provinces = Array.from(
    new Map(
      requests
        .filter(
          (item) => item.desiredProvince?.name && item.desiredProvince?.slug,
        )
        .map((item) => [item.desiredProvince!.slug, item.desiredProvince!]),
    ).values(),
  ).map((province) => ({
    name: province.name,
    slug: province.slug,
  }));

  const wards = Array.from(
    new Map(
      requests
        .filter((item) => item.desiredWard?.name && item.desiredWard?.slug)
        .map((item) => [item.desiredWard!.slug, item.desiredWard!]),
    ).values(),
  ).map((ward) => ({
    name: ward.name,
    slug: ward.slug,
  }));

  return { provinces, wards };
}

async function resolveRentRequest(rawSlug: string) {
  try {
    return await rentRequestService.getBySlug(rawSlug);
  } catch {
    return null;
  }
}

async function resolveRentRequestIfDetailSlug(rawSlug?: string) {
  // A filter-like slug should be handled by listing mode, not detail mode.
  if (!rawSlug || isLikelyPropertyFilterSlug(rawSlug)) {
    return null;
  }
  return resolveRentRequest(rawSlug);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { rawSlug } = parsePagedSlugSegments(slug);
  const rentRequest = await resolveRentRequestIfDetailSlug(rawSlug);

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
  // Parse slug + optional /pN segment from dynamic route.
  const { slug } = await params;
  const { rawSlug, page } = parsePagedSlugSegments(slug);
  const pageContent = pageSeoFaq["can-thue"];
  const rentRequest = await resolveRentRequestIfDetailSlug(rawSlug);

  // Detail branch: render a single rent request page when slug is a real detail slug.
  if (rentRequest) {
    let rentRequests: RentRequest[] = [];
    try {
      // Fetch related rent requests for detail sidebar blocks.
      const pagePayload = await rentRequestService.getAll({
        page: 1,
        limit: RELATED_ITEMS_LIMIT,
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
  // Listing branch: fetch paginated data from API using parsed page.
  const listFetcher = rawSlug
    ? rentRequestService.getAllByFlatSlug({
        flatSlug: rawSlug,
        page,
        limit: RELATED_ITEMS_LIMIT,
      })
    : rentRequestService.getAll({ page, limit: RELATED_ITEMS_LIMIT });
  const paginationBasePath = rawSlug ? `/can-thue/${rawSlug}` : "/can-thue";
  let locationContext: ReturnType<typeof buildLocationContextFromRentRequests> =
    {
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
          const fallbackLocationContext = buildLocationContextFromRentRequests(
            response.data ?? [],
          );
          const breadcrumbLocationContext =
            locationContext.provinces.length || locationContext.wards.length
              ? locationContext
              : fallbackLocationContext;
          return (
            <ListingFilterSection
              title="Cần thuê bất động sản"
              properties={response.data ?? []}
              listingMode="rentRequest"
              serverDriven
              basePath="/can-thue"
              paginationBasePath={paginationBasePath}
              initialFilters={initialFilters}
              breadcrumbItems={buildPropertyFilterBreadcrumbs(
                "/can-thue",
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
