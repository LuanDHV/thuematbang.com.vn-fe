import type { Metadata } from "next";
import { cache } from "react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PageStructuredData from "@/components/common/PageStructuredData";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ListingFilterSection from "@/components/listing-filter/ListingFilterSection";
import DetailTwoColumnLayout from "@/components/listing-detail/DetailTwoColumnLayout";
import RentRequestDetailContent from "@/components/listing-detail/rent-request/RentRequestDetailContent";
import RentRequestDetailSidebar from "@/components/listing-detail/rent-request/RentRequestDetailSidebar";
import {
  buildPropertyFilterBreadcrumbs,
  isLikelyPropertyFilterSlug,
  parseListingPagedSlugSegments,
  parsePropertyFilterSlug,
} from "@/lib/listing/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { buildMetaDescription, buildWebPageSchema } from "@/lib/seo";
import { readAuthCookies } from "@/lib/server/auth-cookies";
import { faqService } from "@/services/faq.service";
import { RENT_REQUEST_COVER_IMAGE } from "@/constants/rent-request";
import { RentRequest } from "@/types/rent-request";
import { rentRequestService } from "@/services/rent-request.service";
import { locationService } from "@/services/location.service";
import { seoContentService } from "@/services/seo-content.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function buildLocationContextFromRentRequests(
  requests: RentRequest[],
): Awaited<
  ReturnType<typeof locationService.resolvePropertyFilterLocationContext>
> {
  const provinces = Array.from(
    new Map(
      requests
        .filter(
          (item) => item.desiredProvince?.name && item.desiredProvince?.slug,
        )
        .map((item) => [item.desiredProvince!.slug, item.desiredProvince!]),
    ).values(),
  ).map((province) => ({
    id: province.id,
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
    provinceId: ward.provinceId,
  }));

  return { provinces, wards };
}

const resolveRentRequest = cache(async (rawSlug: string) => {
  try {
    return await rentRequestService.getBySlug(rawSlug);
  } catch {
    return null;
  }
});

async function resolveRentRequestIfDetailSlug(rawSlug?: string) {
  if (!rawSlug) {
    return null;
  }

  try {
    return await resolveRentRequest(rawSlug);
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
  const rentRequest = await resolveRentRequestIfDetailSlug(rawSlug);

  if (rentRequest) {
    const locationText = [
      rentRequest.desiredWard?.name,
      rentRequest.desiredProvince?.name,
    ]
      .filter(Boolean)
      .join(", ");

    return createPageMetadata({
      title: rentRequest.title,
      description: buildMetaDescription(
        [rentRequest.requirementText, locationText],
        "Chi tiết nhu cầu cần thuê.",
      ),
      pathname: `/can-thue/${rentRequest.slug}`,
      image: RENT_REQUEST_COVER_IMAGE,
      type: "article",
    });
  }

  return createPageMetadata({
    title: "Cần thuê mặt bằng",
    description: "Danh sách cần thuê bất động sản theo bộ lọc.",
    pathname: rawSlug ? `/can-thue/${rawSlug}` : "/can-thue",
  });
}

export default async function DynamicCanThuePage({ params }: PageProps) {
  const { slug } = await params;
  const { rawSlug, page } = parseListingPagedSlugSegments(slug);
  const { accessToken } = await readAuthCookies();
  const isLoggedIn = Boolean(accessToken);

  const [seoRes, faqRes] = await Promise.all([
    seoContentService.getByPage("can-thue").catch(() => ({ data: null })),
    faqService
      .getByPage("can-thue")
      .catch(() => ({ data: { page: "can-thue", faqs: [] } })),
  ]);

  const rentRequest = await resolveRentRequestIfDetailSlug(rawSlug);

  if (rentRequest) {
    let rentRequests: RentRequest[] = [];

    try {
      const { data } = await rentRequestService.getAll({
        page: 1,
        limit: 24,
      });

      rentRequests = data ?? [];
    } catch {
      rentRequests = [];
    }

    const locationText = [
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
      <article className="layout-container layout-section-sm">
        <PageStructuredData
          schemas={[
            buildWebPageSchema({
              title: rentRequest.title,
              description: buildMetaDescription(
                [rentRequest.requirementText, locationText],
                "Chi tiết nhu cầu cần thuê.",
              ),
              url: `/can-thue/${rentRequest.slug}`,
              image: RENT_REQUEST_COVER_IMAGE,
              datePublished: rentRequest.createdAt,
              dateModified: rentRequest.updatedAt,
            }),
          ]}
        />
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Cần thuê", href: "/can-thue" },
            { label: rentRequest.title },
          ]}
        />

        <DetailTwoColumnLayout
          main={
            <RentRequestDetailContent
              rentRequest={rentRequest}
              locationText={locationText}
              viewedRequests={viewedRequests}
            />
          }
          aside={
            <RentRequestDetailSidebar
              contactName={rentRequest.contactName}
              isLoggedIn={isLoggedIn}
              latestWantedProperties={latestWantedRequests}
            />
          }
        />
      </article>
    );
  }

  const locationContext =
    await locationService.resolvePropertyFilterLocationContext(rawSlug);

  const listFetcher = rawSlug
    ? rentRequestService.getAllByFlatSlug({
        flatSlug: rawSlug,
        page,
        limit: 24,
      })
    : rentRequestService.getAll({
        page,
        limit: 24,
      });

  const paginationBasePath = rawSlug ? `/can-thue/${rawSlug}` : "/can-thue";

  return (
    <>
      <SafeFetch
        fetcher={listFetcher}
        debugLabel="Rent-Requests Dynamic Response"
      >
        {(response) => {
          const rentRequests = response.data ?? [];

          const fallbackLocationContext =
            buildLocationContextFromRentRequests(rentRequests);

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
              properties={rentRequests}
              listingMode="rentRequest"
              basePath="/can-thue"
              paginationBasePath={paginationBasePath}
              initialFilters={initialFilters}
              initialLocationContext={resolvedLocationContext}
              breadcrumbItems={buildPropertyFilterBreadcrumbs(
                "/can-thue",
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
