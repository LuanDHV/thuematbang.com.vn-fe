import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectByFilter from "@/components/du-an/ByFilter";
import { createPageMetadata } from "@/lib/metadata";
import { parseProjectCategoryFromSlug } from "@/lib/flat-url";
import { mockProjects } from "@/mocks/projects";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const getProjectBySlug = (slug: string) => mockProjects.find((project) => project.slug === slug);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
        <h1 className="text-3xl font-bold leading-tight">{project.name}</h1>
        <p className="mt-3 text-base text-gray-600">{project.addressDetail}</p>
        {project.content ? <div className="mt-6 text-base" dangerouslySetInnerHTML={{ __html: project.content }} /> : null}
      </article>
    );
  }

  if (slug.length !== 1) {
    notFound();
  }

  const initialCategorySlug = parseProjectCategoryFromSlug(slug[0]);
  return <ProjectByFilter initialCategorySlug={initialCategorySlug} />;
}
