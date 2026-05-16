import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  CalendarDays,
  Eye,
  Landmark,
  Layers,
  Maximize,
} from "lucide-react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PropertyImageGallery from "@/components/common/PropertyImageGallery";
import ProjectListingClient from "@/components/listing-client/ProjectListingClient";
import {
  buildProjectCategoryBreadcrumbs,
  parseProjectCategoryFromSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import {
  getProjectGalleryImages,
  getProjectThumbnailUrl,
  mockProjects,
} from "@/mocks/projects";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const getProjectBySlug = (slug: string) =>
  mockProjects.find((project) => project.slug === slug);

const formatProjectPrice = (value?: number | null) => {
  if (!value) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatProjectArea = (value?: number | null) => {
  if (!value) return "Đang cập nhật";
  return `${value.toLocaleString("vi-VN")} m²`;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const joined = slug.join("/");
  const projectSlug = slug.join("-");
  const project = getProjectBySlug(projectSlug);

  if (project) {
    return createPageMetadata({
      title: project.name,
      description: project.addressDetail || "Chi tiết dự án bất động sản.",
      pathname: `/du-an/${project.slug}`,
      image: getProjectThumbnailUrl(project.id),
      type: "article",
    });
  }

  return createPageMetadata({
    title: "Dự án",
    description: "Cập nhật thông tin dự án bất động sản nổi bật và mới nhất.",
    pathname: `/du-an/${joined}`,
  });
}

export default async function DuAnDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const projectSlug = slug.join("-");
  const project = getProjectBySlug(projectSlug);

  if (project) {
    const galleryImages = getProjectGalleryImages(project.id);
    const hasCoordinates =
      typeof project.latitude === "number" &&
      typeof project.longitude === "number";

    const mapSrc = hasCoordinates
      ? `https://maps.google.com/maps?q=${project.latitude},${project.longitude}&z=15&output=embed`
      : null;

    const viewedProjects = mockProjects
      .filter((item) => item.id !== project.id)
      .slice(0, 10);

    return (
      <article className="mx-auto max-w-7xl px-4 py-8">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Dự án", href: "/du-an" },
            { label: project.name },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-8">
            <section>
              <PropertyImageGallery
                title={project.name}
                images={galleryImages}
              />
            </section>

            <section>
              <h1 className="text-2xl leading-tight font-bold text-gray-800 lg:text-4xl">
                {project.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                {project.category?.name ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    <Layers size={12} className="text-primary" />
                    Danh mục: {project.category.name}
                  </span>
                ) : null}

                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  <CalendarDays size={12} className="text-primary" />
                  Ngày đăng: {formatDate(project.createdAt)}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  <Eye size={12} className="text-primary" />
                  Lượt xem: {(project.viewCount || 0).toLocaleString("vi-VN")}
                </span>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-3">
                <span className="bg-primary h-6 w-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Thông tin mô tả
                </h2>
              </div>
              {project.content ? (
                <div
                  className="prose prose-gray prose-headings:font-semibold prose-p:leading-relaxed max-w-none text-gray-700"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              ) : (
                <p className="text-sm text-gray-600">
                  Nội dung dự án đang được cập nhật.
                </p>
              )}
            </section>

            <section>
              <div className="mb-3 flex items-center gap-3">
                <span className="bg-primary h-6 w-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Thông tin chi tiết
                </h2>
              </div>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2">
                  <Landmark className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-xs tracking-wide text-gray-500 uppercase">
                      Tổng mức đầu tư
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatProjectPrice(project.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2">
                  <Maximize className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-xs tracking-wide text-gray-500 uppercase">
                      Quy mô
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatProjectArea(project.area)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2">
                  <Building2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-xs tracking-wide text-gray-500 uppercase">
                      Chủ đầu tư
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {project.developer || "Đang cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-3">
                <span className="bg-primary h-6 w-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Xem trên bản đồ
                </h2>
              </div>

              {mapSrc ? (
                <iframe
                  title={`Bản đồ vị trí ${project.name}`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-80 w-full rounded-2xl"
                />
              ) : (
                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                  Dự án chưa có tọa độ để hiển thị bản đồ.
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-24">
              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800">
                  Dự án khác
                </h2>

                <div className="mt-3 grid divide-y divide-gray-100">
                  {viewedProjects.map((item) => (
                    <Link
                      key={item.id}
                      href={`/du-an/${item.slug}`}
                      className="group hover:text-primary py-2.5 text-sm text-gray-700 transition-colors duration-200 ease-in-out"
                    >
                      <span className="line-clamp-2 font-medium">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </article>
    );
  }

  if (slug.length !== 1) {
    notFound();
  }

  const initialCategorySlug = parseProjectCategoryFromSlug(slug[0]);

  return (
    <ProjectListingClient
      initialCategorySlug={initialCategorySlug}
      breadcrumbItems={buildProjectCategoryBreadcrumbs(slug[0])}
    />
  );
}
