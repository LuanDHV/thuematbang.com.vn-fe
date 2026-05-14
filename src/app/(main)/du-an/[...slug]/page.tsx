import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectListingClient from "@/components/client/ProjectListingClient";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { createPageMetadata } from "@/lib/metadata";
import { parseProjectCategoryFromSlug } from "@/lib/flat-url";
import { mockCategoryProject } from "@/mocks/categories";
import { mockProjects } from "@/mocks/projects";

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
      image: project.thumbnailUrl || undefined,
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
    return (
      <article className="mx-auto max-w-4xl px-4 py-12 lg:py-20">
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
        {project.content ? (
          <div
            className="mt-6 text-base"
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
  const category = mockCategoryProject.find(
    (item) => item.slug === initialCategorySlug,
  );

  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <DynamicBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Dự án", href: "/du-an" },
            ...(category ? [{ label: category.name }] : []),
          ]}
        />
      </div>
      <ProjectListingClient initialCategorySlug={initialCategorySlug} />
    </>
  );
}
