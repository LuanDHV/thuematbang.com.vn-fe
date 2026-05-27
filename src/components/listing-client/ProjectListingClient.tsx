"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { buildPagedPath, type BreadcrumbItem } from "@/lib/flat-url";
import { Pagination } from "@/components/common/Pagination";
import { ProjectCard } from "@/components/common/ProjectCard";
import { CategoryChips } from "@/components/common/CategoryChips";
import type { PaginationMeta } from "@/types/api";

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

  const orderedProjects = useMemo(() => {
    return [...projects].sort(
      (left, right) =>
        new Date(right.createdAt ?? 0).getTime() -
        new Date(left.createdAt ?? 0).getTime(),
    );
  }, [projects]);

  const totalPages = Math.max(1, paginationMeta?.totalPage ?? 1);
  const currentPage = Math.max(1, paginationMeta?.currentPage ?? 1);

  const targetPathFromCategory = (categorySlug: string) =>
    categorySlug === "du-an" ? "/du-an" : `/du-an/${categorySlug}`;

  const handlePageChange = (nextPage: number) => {
    router.replace(
      buildPagedPath(targetPathFromCategory(selectedCategorySlug), nextPage),
      {
        scroll: false,
      },
    );
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8">
      {breadcrumbItems?.length ? (
        <DynamicBreadcrumb items={breadcrumbItems} />
      ) : null}

      <div className="my-6">
        <CategoryChips
          activeValue={selectedCategorySlug}
          onChange={handleSelectCategory}
          items={categoryItems}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {orderedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      </div>
    </section>
  );
}
