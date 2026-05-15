import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectListingClient from "@/components/listing-client/ProjectListingClient";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import {
  buildProjectCategoryBreadcrumbs,
  parseProjectCategoryFromSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
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
      description: project.addressDetail || "Chi tiáº¿t dá»± Ã¡n báº¥t Ä‘á»™ng sáº£n.",
      pathname: `/du-an/${project.slug}`,
      image: project.thumbnailUrl || undefined,
      type: "article",
    });
  }

  return createPageMetadata({
    title: "Dá»± Ã¡n",
    description: "Cáº­p nháº­t thÃ´ng tin dá»± Ã¡n báº¥t Ä‘á»™ng sáº£n ná»•i báº­t vÃ  má»›i nháº¥t.",
    pathname: `/du-an/${joined}`,
  });
}

export default async function DuAnDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const projectSlug = slug.join("-");
  const project = getProjectBySlug(projectSlug);

  if (project) {
    return (
      <article className="mx-auto max-w-4xl px-4 py-8">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chá»§", href: "/" },
            { label: "Dá»± Ã¡n", href: "/du-an" },
            { label: project.name },
          ]}
        />
        <h1 className="text-3xl leading-tight font-bold">{project.name}</h1>
        <p className="mt-3 text-base text-gray-600">{project.addressDetail}</p>
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
