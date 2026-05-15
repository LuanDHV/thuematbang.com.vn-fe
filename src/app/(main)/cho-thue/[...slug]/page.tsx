import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Bath,
  Bed,
  MapPin,
  Maximize,
  Navigation,
} from "lucide-react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import { PropertyCard } from "@/components/common/PropertyCard";
import PropertyImageGallery from "@/components/common/PropertyImageGallery";
import PosterContactCard from "@/components/common/PosterContactCard";
import PropertyFilterSection from "@/components/filter/PropertyFilterSection";
import {
  buildPropertyFilterBreadcrumbs,
  parsePropertyFilterSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { formatDate, formatPrice } from "@/lib/utils";
import { DIRECTION_OPTIONS } from "@/mocks/filter";
import { pageSeoFaq } from "@/mocks/pageSeoFaq";
import { mockProperties } from "@/mocks/properties";
import { mockUsers } from "@/mocks/users";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function getPropertyDetail(slug: string) {
  return mockProperties.find(
    (property) => property.listingType === "RENT_OUT" && property.slug === slug,
  );
}

function getDirectionLabel(direction?: string | null) {
  if (!direction) return "Đang cập nhật";
  const normalized = direction.toString().toUpperCase();
  return (
    DIRECTION_OPTIONS.find((option) => option.id === normalized)?.label ??
    direction
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
      (item) => item.listingType === "RENT_OUT" && item.id !== property.id,
    );

    const featuredProperties = mockProperties
      .filter((item) => item.listingType === "RENT_OUT" && item.isFeatured)
      .slice(0, 6);

    const viewedProperties = rentalOutProperties.slice(0, 3);

    const galleryImages = [
      property.thumbnailUrl || "/imgs/wallpaper-1.jpg",
      ...rentalOutProperties
        .slice(0, 6)
        .map((item) => item.thumbnailUrl || "/imgs/wallpaper-1.jpg"),
    ];

    const hasCoordinates =
      typeof property.latitude === "number" &&
      typeof property.longitude === "number";

    const mapSrc = hasCoordinates
      ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`
      : null;
    const hasArea = typeof property.area === "number" && property.area > 0;
    const hasBathrooms =
      typeof property.bathrooms === "number" && property.bathrooms > 0;
    const hasBedrooms =
      typeof property.bedrooms === "number" && property.bedrooms > 0;
    const hasDirection = Boolean(property.direction);
    const hasPriorityStatus = Boolean(property.priorityStatus);
    const citySlug = property.city?.slug;
    const relatedCategoryCityLinks = citySlug
      ? mockProperties
          .filter(
            (item) =>
              item.listingType === "RENT_OUT" &&
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
          <div className="w-full space-y-6 lg:w-3/4 lg:space-y-8">
            <section>
              <PropertyImageGallery
                title={property.title}
                images={galleryImages}
              />

              <div className="mt-5">
                <h1 className="text-2xl leading-tight font-bold text-gray-900 lg:text-4xl">
                  {property.title}
                </h1>
                <p className="text-primary mt-2 text-3xl font-bold tracking-tight">
                  {formatPrice(property.price || 0)}
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gray-500" />
                  <span>{locationText || "Đang cập nhật địa chỉ"}</span>
                </p>
                <p className="mt-4 text-base leading-8 text-gray-700">
                  {property.description || "Đang cập nhật mô tả"}
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3">
                <span className="bg-primary h-6 w-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Đặc điểm bất động sản
                </h2>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {hasArea ? (
                  <div className="rounded-2xl bg-gray-50 px-4 py-3">
                    <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                      <Maximize size={14} className="text-gray-500" />
                      Diện tích
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {property.area} m²
                    </p>
                  </div>
                ) : null}
                {hasBathrooms ? (
                  <div className="rounded-2xl bg-gray-50 px-4 py-3">
                    <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                      <Bath size={14} className="text-gray-500" />
                      Phòng tắm
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {property.bathrooms}
                    </p>
                  </div>
                ) : null}
                {hasBedrooms ? (
                  <div className="rounded-2xl bg-gray-50 px-4 py-3">
                    <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                      <Bed size={14} className="text-gray-500" />
                      Phòng ngủ
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {property.bedrooms}
                    </p>
                  </div>
                ) : null}
                {hasDirection ? (
                  <div className="rounded-2xl bg-gray-50 px-4 py-3">
                    <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                      <Navigation size={14} className="text-gray-500" />
                      Hướng
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {getDirectionLabel(property.direction?.toString())}
                    </p>
                  </div>
                ) : null}
              </div>

              {property.content ? (
                <div
                  className="prose prose-sm mt-5 max-w-none text-gray-700"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{ __html: property.content }}
                />
              ) : null}
            </section>

            <section>
              <div className="flex items-center gap-3">
                <span className="bg-primary h-6 w-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Xem trên bản đồ
                </h2>
              </div>
              {mapSrc ? (
                <iframe
                  title={`Bản đồ vị trí ${property.title}`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="mt-4 h-80 w-full rounded-2xl"
                />
              ) : (
                <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                  Tin đăng chưa có tọa độ để hiển thị bản đồ.
                </div>
              )}

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-gray-50 px-4 py-3">
                  <p className="text-xs tracking-wide text-gray-500 uppercase">
                    Ngày đăng
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatDate(property.createdAt)}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 px-4 py-3">
                  <p className="text-xs tracking-wide text-gray-500 uppercase">
                    Ngày hết hạn
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatDate(property.boostEndAt || property.updatedAt)}
                  </p>
                </div>
                {hasPriorityStatus ? (
                  <div className="rounded-2xl bg-gray-50 px-4 py-3">
                    <p className="text-xs tracking-wide text-gray-500 uppercase">
                      Loại tin
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 capitalize">
                      {property.priorityStatus}
                    </p>
                  </div>
                ) : null}
                <div className="rounded-2xl bg-gray-50 px-4 py-3">
                  <p className="text-xs tracking-wide text-gray-500 uppercase">
                    Mã tin
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    #{property.id}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3">
                <span className="bg-primary h-6 w-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Bất động sản dành cho bạn
                </h2>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {featuredProperties.map((item) => (
                  <PropertyCard
                    key={`suggested-${item.id}`}
                    property={item}
                    variant="featured"
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3">
                <span className="bg-primary h-6 w-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Tin đã xem
                </h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Hiện đang hiển thị mẫu. Có thể thay bằng dữ liệu lịch sử xem
                thật từ localStorage/cookie.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {viewedProperties.map((item) => (
                  <PropertyCard
                    key={`viewed-${item.id}`}
                    property={item}
                    variant="featured"
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="w-full space-y-6 lg:w-1/4">
            <div className="shadow-primary/50 self-start rounded-xl bg-white p-4 shadow lg:sticky lg:top-18">
              <PosterContactCard
                fullName={poster?.fullName}
                phone={poster?.phone}
                canRevealPhone={isLoggedIn}
              />
            </div>

            <section className="hidden rounded-2xl bg-white p-4 shadow-sm lg:block">
              <h3 className="text-base font-semibold text-gray-700">
                Gợi ý theo khu vực
              </h3>
              {relatedCategoryCityLinks.length > 0 ? (
                <div className="mt-3">
                  <div className="grid divide-y divide-gray-100">
                    {relatedCategoryCityLinks.map((item) => (
                      <Link
                        href={item.href}
                        key={item.href}
                        className="group hover:text-primary flex items-center justify-between py-2.5 text-sm text-gray-700 transition-colors duration-200 ease-in-out"
                      >
                        <span className="line-clamp-1 font-medium">
                          {item.label}
                        </span>

                        <ArrowRight size={12} />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </aside>
        </div>
      </article>
    );
  }

  const initialFilters = parsePropertyFilterSlug(rawSlug);
  const pageContent = pageSeoFaq["cho-thue"];
  const rentalOutProperties = mockProperties.filter(
    (item) => item.listingType === "RENT_OUT",
  );

  if (!rentalOutProperties.length) {
    notFound();
  }

  return (
    <>
      <PropertyFilterSection
        title="Cho thuê bất động sản"
        properties={rentalOutProperties}
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
