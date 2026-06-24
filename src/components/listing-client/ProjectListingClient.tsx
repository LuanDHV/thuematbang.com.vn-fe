"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { buildPagedPath, type BreadcrumbItem } from "@/lib/listing/flat-url";
import { resolvePaginationClientMeta } from "@/lib/client-side";
import { Pagination } from "@/components/common/Pagination";
import { ProjectCard } from "@/components/common/ProjectCard";
import { CategoryChips } from "@/components/common/CategoryChips";
import type { PaginationMeta } from "@/types/api";
import Title from "../common/Title";

export default function ProjectListingClient({
  projects,
  categories = [],
  initialCategorySlug = "du-an",
  breadcrumbItems,
  paginationMeta,
}: {
  projects: Project[];
  categories?: Category[];
  initialCategorySlug?: string;
  breadcrumbItems?: BreadcrumbItem[];
  paginationMeta?: PaginationMeta;
}) {
  const router = useRouter();
  const [selectedCategorySlug, setSelectedCategorySlug] =
    useState(initialCategorySlug);

  const categoryItems = useMemo(
    () => [
      { id: "all", label: "Tất cả", value: "du-an" },
      ...categories.map((category) => ({
        id: String(category.id),
        label: category.name,
        value: category.slug,
      })),
    ],
    [categories],
  );

  const handleSelectCategory = (value: string) => {
    setSelectedCategorySlug(value);
    const targetPath = value === "du-an" ? "/du-an" : `/du-an/${value}`;
    router.replace(targetPath, { scroll: false });
  };

  const resolvedPaginationMeta = resolvePaginationClientMeta(paginationMeta);
  const totalPages = Math.max(1, resolvedPaginationMeta.totalPage ?? 1);
  const currentPage = Math.max(1, resolvedPaginationMeta.currentPage ?? 1);

  const targetPathFromCategory = (categorySlug: string) =>
    categorySlug === "du-an" ? "/du-an" : `/du-an/${categorySlug}`;

  return (
    <section className="layout-container pt-4 pb-0 md:pt-5">
      <div className="layout-container layout-section-sm pb-0">
        <Title title="Dự án bất động sản" level={1} />
      </div>
      {breadcrumbItems?.length ? (
        <DynamicBreadcrumb items={breadcrumbItems} />
      ) : null}

      <div className="mt-4">
        <CategoryChips
          activeValue={selectedCategorySlug}
          onChange={handleSelectCategory}
          items={categoryItems}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={(nextPage) =>
            router.replace(
              buildPagedPath(
                targetPathFromCategory(selectedCategorySlug),
                nextPage,
              ),
              {
                scroll: false,
              },
            )
          }
        />
      </div>
    </section>
  );
}
