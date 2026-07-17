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
import {
  buildLatestListingTitle,
  buildPageTitle,
  createPageMetadata,
} from "@/lib/metadata";
import { buildMetaDescription, buildWebPageSchema } from "@/lib/seo";
import { faqService } from "@/services/faq.service";
import { RENT_REQUEST_COVER_IMAGE } from "@/constants/rent-request";
import { RentRequest } from "@/types/rent-request";
import { rentRequestService } from "@/services/rent-request.service";
import { locationService } from "@/services/location.service";
import { seoContentService } from "@/services/seo-content.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const RENT_REQUEST_BASE_PATH = "/can-thue";
const RENT_REQUEST_LISTING_TITLE = buildLatestListingTitle(
  "Nhu cầu thuê bất động sản",
);
const RENT_REQUEST_LISTING_DESCRIPTION =
  "Danh sách nhu cầu thuê bất động sản mới nhất, giúp bạn tìm nhanh các yêu cầu theo khu vực, ngân sách và diện tích để kết nối đúng đối tượng.";

function buildSeoPath(rawSlug?: string) {
  return rawSlug
    ? `${RENT_REQUEST_BASE_PATH}/${rawSlug}`
    : RENT_REQUEST_BASE_PATH;
}

const resolveSeoContent = cache(async (path: string) => {
  const response = await seoContentService
    .resolveByPath(path)
    .catch(() => ({ data: null }));
  return response.data;
});

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
      title: buildPageTitle(rentRequest.title),
      description: buildMetaDescription(
        [rentRequest.requirementText, locationText],
        "Xem chi tiết nhu cầu cần thuê, bao gồm khu vực mong muốn, ngân sách, diện tích và thông tin liên hệ để bạn gửi đề xuất phù hợp hơn.",
      ),
      pathname: `/can-thue/${rentRequest.slug}`,
      image: RENT_REQUEST_COVER_IMAGE,
      type: "article",
    });
  }

  const seoData = await resolveSeoContent(buildSeoPath(rawSlug));

  return createPageMetadata({
    title: seoData?.metaTitle || RENT_REQUEST_LISTING_TITLE,
    description: seoData?.metaDescription || RENT_REQUEST_LISTING_DESCRIPTION,
    pathname: seoData?.targetPath || buildSeoPath(rawSlug),
  });
}

export default async function DynamicCanThuePage({ params }: PageProps) {
  const { slug } = await params;
  const { rawSlug, page } = parseListingPagedSlugSegments(slug);

  const faqRes = await faqService
    .getByPage("can-thue")
    .catch(() => ({ data: { page: "can-thue", faqs: [] } }));

  const rentRequest = await resolveRentRequestIfDetailSlug(rawSlug);

  if (rentRequest) {
    let rentRequests: RentRequest[] = [];

    try {
      const { data } = await rentRequestService.getAll({
        page: 1,
        limit: 24,
        filters: {
          status: "PUBLISHED",
        },
      });

      rentRequests = (data ?? [])
        .filter((item) => item.status === "PUBLISHED")
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
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
              title: buildPageTitle(rentRequest.title),
              description: buildMetaDescription(
                [rentRequest.requirementText, locationText],
                "Xem chi tiết nhu cầu cần thuê, bao gồm khu vực mong muốn, ngân sách, diện tích và thông tin liên hệ để bạn gửi đề xuất phù hợp hơn.",
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
              rentRequestId={rentRequest.id}
              latestWantedProperties={latestWantedRequests}
            />
          }
        />
      </article>
    );
  }

  const seoPath = buildSeoPath(rawSlug);
  const [seoRes, locationContext] = await Promise.all([
    resolveSeoContent(seoPath).then((data) => ({ data })),
    locationService.resolvePropertyFilterLocationContext(rawSlug),
  ]);

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
      <PageStructuredData
        schemas={[
          buildWebPageSchema({
            title: seoRes.data?.metaTitle || RENT_REQUEST_LISTING_TITLE,
            description:
              seoRes.data?.metaDescription || RENT_REQUEST_LISTING_DESCRIPTION,
            url: seoRes.data?.targetPath || seoPath,
            schemaType: "CollectionPage",
          }),
        ]}
      />

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

      <PageFaq faqData={faqRes.data} />
      <PageSeoContent seoData={seoRes.data} />
    </>
  );
}
