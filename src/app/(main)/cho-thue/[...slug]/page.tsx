import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/metadata";
import {
  buildPropertyFilterBreadcrumbs,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { mockProperties } from "@/mocks/properties";
import PropertyFilterSection from "@/components/filter/PropertyFilterSection";
import ContentSEO from "@/components/cho-thue/ContentSEO";
import FAQ from "@/components/cho-thue/FAQ";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function getPropertyDetail(slug: string) {
  return mockProperties.find(
    (property) => property.listingType === "RENT_OUT" && property.slug === slug,
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = slug.join("-");
  const property = getPropertyDetail(rawSlug);

  if (property) {
    return createPageMetadata({
      title: property.title,
      description: property.description || "Chi tiết tin đăng cho thuê.",
      pathname: `/cho-thue/${property.slug}`,
      image: property.thumbnailUrl || undefined,
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
    return (
      <article className="mx-auto max-w-4xl px-4 py-12 lg:py-20">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Cho thuê", href: "/cho-thue" },
            { label: property.title },
          ]}
        />
        <h1 className="text-3xl font-bold leading-tight">{property.title}</h1>
        <p className="mt-3 text-base text-gray-600">{property.description}</p>
        {property.content ? <div className="mt-6 text-base" dangerouslySetInnerHTML={{ __html: property.content }} /> : null}
      </article>
    );
  }

  const initialFilters = parsePropertyFilterSlug(rawSlug);
  const rentalOutProperties = mockProperties.filter(
    (item) => item.listingType === "RENT_OUT",
  );

  if (!rentalOutProperties.length) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <DynamicBreadcrumb
          items={buildPropertyFilterBreadcrumbs("/cho-thue", rawSlug)}
        />
      </div>
      <PropertyFilterSection
        title="Cho thuê bất động sản"
        properties={rentalOutProperties}
        basePath="/cho-thue"
        initialFilters={initialFilters}
        stickyFilter
      />
      <ContentSEO />
      <FAQ />
    </>
  );
}
