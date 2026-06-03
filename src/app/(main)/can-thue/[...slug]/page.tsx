import type { Metadata } from "next";
import { cache } from "react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
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
  parsePagedSlugSegments,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { readAuthCookies } from "@/lib/server/auth-cookies";
import { pageSeoFaqService } from "@/services/page-seo-faq.service";
import { RentRequest } from "@/types/rent-request";
import { rentRequestService } from "@/services/rent-request.service";
import { locationService } from "@/services/location.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

type LocationContext = {
  provinces: { name: string; slug: string }[];
  wards: { name: string; slug: string }[];
};

function buildLocationContextFromRentRequests(
  requests: RentRequest[],
): LocationContext {
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
  const { slug } = await params;
  const { rawSlug, page } = parsePagedSlugSegments(slug);
  const { accessToken } = await readAuthCookies();
  const isLoggedIn = Boolean(accessToken);
  const pageContent = await pageSeoFaqService.getPageSeoFaq("can-thue");
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
      <article className="layout-container layout-section-sm">
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
              contactPhone={rentRequest.contactPhone}
              isLoggedIn={isLoggedIn}
              latestWantedProperties={latestWantedRequests}
            />
          }
        />
      </article>
    );
  }

  const initialFilters = parsePropertyFilterSlug(rawSlug);

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
  const locationContext = await resolveLocationContext();

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

          const breadcrumbLocationContext =
            locationContext.provinces.length || locationContext.wards.length
              ? locationContext
              : fallbackLocationContext;

          return (
            <ListingFilterSection
              properties={rentRequests}
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
