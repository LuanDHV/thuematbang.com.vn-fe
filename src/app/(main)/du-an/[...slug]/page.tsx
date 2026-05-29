import type { Metadata } from "next";
import { cache } from "react";
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
import SafeFetch from "@/components/common/SafeFetch";
import PropertyImageGallery from "@/components/common/PropertyImageGallery";
import ProjectListingClient from "@/components/listing-client/ProjectListingClient";
import {
  buildProjectCategoryBreadcrumbs,
  parsePagedSlugSegments,
  parseProjectCategoryFromSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import { Project } from "@/types/project";
import { categoryService } from "@/services/category.service";
import { projectService } from "@/services/project.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

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

function extractProjectImages(project: Project) {
  const images =
    project.images
      ?.slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => image.imageUrl)
      .filter(Boolean) ?? [];

  return images.length > 0 ? images : ["/imgs/wallpaper-1.jpg"];
}

const resolveProject = cache(async (slug: string) => {
  try {
    return await projectService.getBySlug(slug);
  } catch {
    return null;
  }
});

const resolveProjectCategories = cache(async () => {
  return categoryService.getProjectCategories();
});

async function resolveProjectPageContext(slugSegments: string[]) {
  const { rawSlug, page } = parsePagedSlugSegments(slugSegments);
  const projectCategories = await resolveProjectCategories();

  const initialCategorySlug = parseProjectCategoryFromSlug(
    rawSlug,
    projectCategories,
  );

  const isCategoryListing = Boolean(rawSlug) && initialCategorySlug !== "du-an";

  const projectSlug = rawSlug ?? slugSegments.join("-");
  const project = isCategoryListing ? null : await resolveProject(projectSlug);

  return {
    rawSlug,
    page,
    projectCategories,
    initialCategorySlug,
    isCategoryListing,
    projectSlug,
    project,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await resolveProjectPageContext(slug);

  if (project) {
    return createPageMetadata({
      title: project.name,
      description: project.addressDetail || "Chi tiết dự án bất động sản.",
      pathname: `/du-an/${project.slug}`,
      image: extractProjectImages(project)[0],
      type: "article",
    });
  }

  return createPageMetadata({
    title: "Dự án",
    description: "Cập nhật thông tin dự án bất động sản nổi bật và mới nhất.",
    pathname: `/du-an/${slug.join("/")}`,
  });
}

export default async function DuAnDynamicPage({ params }: PageProps) {
  const { slug } = await params;

  const { rawSlug, page, projectCategories, initialCategorySlug, project } =
    await resolveProjectPageContext(slug);

  if (project) {
    const galleryImages = extractProjectImages(project);

    const hasCoordinates =
      typeof project.latitude === "number" &&
      typeof project.longitude === "number";

    const mapSrc = hasCoordinates
      ? `https://maps.google.com/maps?q=${project.latitude},${project.longitude}&z=15&output=embed`
      : null;

    let viewedProjects: Project[] = [];

    try {
      const { data } = await projectService.getAll({
        limit: 24,
      });

      viewedProjects = (data ?? [])
        .filter((item) => item.id !== project.id)
        .slice(0, 24);
    } catch {
      viewedProjects = [];
    }

    return (
      <article className="layout-container layout-section-sm">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Dự án", href: "/du-an" },
            { label: project.name },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-8 lg:gap-8">
            <section>
              <PropertyImageGallery
                title={project.name}
                images={galleryImages}
              />
            </section>

            <section>
              <h1 className="text-heading text-2xl leading-tight font-semibold tracking-[-0.03em] lg:text-4xl">
                {project.name}
              </h1>

              <div className="text-secondary mt-3 flex flex-wrap items-center gap-2 text-sm">
                {project.category?.name ? (
                  <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                    <Layers size={12} className="text-primary" />
                    Danh mục: {project.category.name}
                  </span>
                ) : null}

                <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  <CalendarDays size={12} className="text-primary" />
                  Ngày đăng: {formatDate(project.createdAt)}
                </span>

                <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
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
                  className="premium-prose prose prose-sm prose-p:leading-relaxed prose-headings:font-semibold text-body max-w-none"
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
                <div className="surface-card flex items-center gap-3 rounded-xl px-3 py-3">
                  <Landmark className="text-primary mt-0.5 size-5 shrink-0" />
                  <div>
                    <p className="text-secondary text-xs tracking-wide uppercase">
                      Tổng mức đầu tư
                    </p>
                    <p className="text-heading text-sm font-semibold">
                      {formatProjectPrice(project.price)}
                    </p>
                  </div>
                </div>

                <div className="surface-card flex items-center gap-3 rounded-xl px-3 py-3">
                  <Maximize className="text-primary mt-0.5 size-5 shrink-0" />
                  <div>
                    <p className="text-secondary text-xs tracking-wide uppercase">
                      Quy mô
                    </p>
                    <p className="text-heading text-sm font-semibold">
                      {formatProjectArea(project.area)}
                    </p>
                  </div>
                </div>

                <div className="surface-card flex items-center gap-3 rounded-xl px-3 py-3">
                  <Building2 className="text-primary mt-0.5 size-5 shrink-0" />
                  <div>
                    <p className="text-secondary text-xs tracking-wide uppercase">
                      Chủ đầu tư
                    </p>
                    <p className="text-heading text-sm font-semibold">
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
                  className="h-80 w-full rounded-2xl border border-black/6 shadow-[0_18px_36px_rgba(36,26,10,0.08)]"
                />
              ) : (
                <div className="surface-card text-secondary rounded-2xl p-4 text-sm">
                  Dự án chưa có tọa độ để hiển thị bản đồ.
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              <section className="surface-card rounded-2xl border p-5 md:p-6">
                <h2 className="text-heading text-base font-medium">
                  <span className="bg-primary mr-2 inline-block h-4 w-0.5 rounded-full align-middle" />
                  Dự án khác
                </h2>

                <div className="mt-3 grid divide-y divide-gray-100">
                  {viewedProjects.map((item) => (
                    <Link
                      key={item.id}
                      href={`/du-an/${item.slug}`}
                      className="group text-body hover:text-primary py-2.5 text-sm font-medium transition-all duration-200"
                    >
                      <span className="line-clamp-2">{item.name}</span>
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

  if (slug.length > 2) {
    notFound();
  }

  const categoryFetch =
    initialCategorySlug === "du-an"
      ? projectService.getAll({
          page,
          limit: 24,
        })
      : projectService.getAll({
          categorySlug: initialCategorySlug,
          page,
          limit: 24,
        });

  return (
    <SafeFetch fetcher={categoryFetch} debugLabel="Projects Dynamic Response">
      {(response) => (
        <ProjectListingClient
          projects={response.data ?? []}
          categories={projectCategories}
          initialCategorySlug={initialCategorySlug}
          breadcrumbItems={buildProjectCategoryBreadcrumbs(
            rawSlug,
            projectCategories,
          )}
          paginationMeta={response.meta}
        />
      )}
    </SafeFetch>
  );
}
