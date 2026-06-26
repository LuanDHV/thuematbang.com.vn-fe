import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PageStructuredData from "@/components/common/PageStructuredData";
import SafeFetch from "@/components/common/SafeFetch";
import DetailTwoColumnLayout from "@/components/listing-detail/DetailTwoColumnLayout";
import ProjectDetailContent from "@/components/listing-detail/project/ProjectDetailContent";
import ProjectDetailSidebar from "@/components/listing-detail/project/ProjectDetailSidebar";
import ProjectListingClient from "@/components/listing-client/ProjectListingClient";
import {
  buildProjectCategoryBreadcrumbs,
  parsePagedSlugSegments,
  parseProjectCategoryFromSlug,
} from "@/lib/listing/flat-url";
import {
  buildLatestListingTitle,
  buildPageTitle,
  createPageMetadata,
} from "@/lib/metadata";
import { buildMetaDescription, buildWebPageSchema } from "@/lib/seo";
import { Project } from "@/types/project";
import { categoryService } from "@/services/category.service";
import { projectService } from "@/services/project.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
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
      title: buildPageTitle(project.name),
      description: buildMetaDescription(
        [project.content, project.addressDetail, project.category?.name],
        "Xem chi tiết dự án bất động sản, gồm vị trí, quy mô, tiện ích, tiến độ và thông tin tổng quan để bạn dễ so sánh trước khi quan tâm hoặc liên hệ.",
      ),
      pathname: `/du-an/${project.slug}`,
      image: extractProjectImages(project)[0],
      type: "article",
    });
  }

  return createPageMetadata({
    title: buildLatestListingTitle("Dự án bất động sản"),
    description:
      "Danh sách dự án bất động sản nổi bật và mới nhất, giúp bạn xem nhanh vị trí, quy mô, tiện ích và tình trạng dự án trước khi đánh giá.",
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
        <PageStructuredData
          schemas={[
            buildWebPageSchema({
              title: buildPageTitle(project.name),
              description: buildMetaDescription(
                [
                  project.content,
                  project.addressDetail,
                  project.category?.name,
                ],
                "Xem chi tiết dự án bất động sản, gồm vị trí, quy mô, tiện ích, tiến độ và thông tin tổng quan để bạn dễ so sánh trước khi quan tâm hoặc liên hệ.",
              ),
              url: `/du-an/${project.slug}`,
              image: galleryImages[0],
              datePublished: project.createdAt,
              dateModified: project.updatedAt,
            }),
          ]}
        />
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Dự án", href: "/du-an" },
            { label: project.name },
          ]}
        />

        <DetailTwoColumnLayout
          main={
            <ProjectDetailContent
              project={project}
              galleryImages={galleryImages}
              mapSrc={mapSrc}
            />
          }
          aside={<ProjectDetailSidebar viewedProjects={viewedProjects} />}
        />
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
