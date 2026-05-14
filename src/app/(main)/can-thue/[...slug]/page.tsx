import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/metadata";
import {
  buildPropertyFilterBreadcrumbs,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { mockProperties } from "@/mocks/properties";
import PropertyFilterSection from "@/components/filter/PropertyFilterSection";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PageSeoContent from "@/components/common/PageSeoContent";
import PageFaq from "@/components/common/PageFaq";
import { pageSeoFaq } from "@/mocks/pageSeoFaq";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function getPropertyDetail(slug: string) {
  return mockProperties.find(
    (property) => property.listingType === "RENT_WANTED" && property.slug === slug,
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
    return (
      <article className="mx-auto max-w-4xl px-4 py-12 lg:py-20">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Cần thuê", href: "/can-thue" },
            { label: property.title },
          ]}
        />
        <h1 className="text-3xl font-bold leading-tight">{property.title}</h1>
        <p className="mt-3 text-base text-gray-600">{property.description}</p>
        {property.content ? (
          <div
            className="mt-6 text-base"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: property.content }}
          />
        ) : null}
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
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <DynamicBreadcrumb
          items={buildPropertyFilterBreadcrumbs("/can-thue", rawSlug)}
        />
      </div>
      <PropertyFilterSection
        title="Cần thuê bất động sản"
        properties={rentalDemandProperties}
        basePath="/can-thue"
        initialFilters={initialFilters}
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
