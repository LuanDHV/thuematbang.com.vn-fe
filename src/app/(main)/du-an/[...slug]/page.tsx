import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PropertyImageGallery from "@/components/common/PropertyImageGallery";
import ProjectListingClient from "@/components/listing-client/ProjectListingClient";
import {
  buildProjectCategoryBreadcrumbs,
  parseProjectCategoryFromSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
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
    description:
      "Cập nhật thông tin dự án bất động sản nổi bật và mới nhất.",
    pathname: `/du-an/${joined}`,
  });
}

export default async function DuAnDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const projectSlug = slug.join("-");
  const project = getProjectBySlug(projectSlug);

  if (project) {
    const galleryImages = getProjectGalleryImages(project.id);

    return (
      <article className="mx-auto max-w-4xl px-4 py-8">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Dự án", href: "/du-an" },
            { label: project.name },
          ]}
        />
        <h1 className="text-3xl leading-tight font-bold">{project.name}</h1>
        <p className="mt-3 text-base text-gray-600">{project.addressDetail}</p>
        <div className="mt-6">
          <PropertyImageGallery title={project.name} images={galleryImages} />
        </div>
        {project.content ? (
          <div
            className="mt-6 text-base"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        ) : null}
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
