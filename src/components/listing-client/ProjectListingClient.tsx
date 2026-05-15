"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { mockProjects } from "@/mocks/projects";
import { Project } from "@/types/project";
import type { BreadcrumbItem } from "@/lib/flat-url";
import { Pagination } from "@/components/common/Pagination";
import { ProjectCard } from "@/components/common/ProjectCard";
import { mockCategoryProject } from "@/mocks/categories";
import { CategoryChips } from "@/components/common/CategoryChips";

const PAGE_SIZE = 6;

export default function ProjectListingClient({
  projects = mockProjects,
  initialCategorySlug = "du-an",
  breadcrumbItems,
}: {
  projects?: Project[];
  initialCategorySlug?: string;
  breadcrumbItems?: BreadcrumbItem[];
}) {
  const router = useRouter();
  const [selectedCategorySlug, setSelectedCategorySlug] =
    useState(initialCategorySlug);
  const categoryItems = useMemo(
    () => [
      { id: "all", label: "Tất cả", value: "du-an" },
      ...mockCategoryProject.map((category) => ({
        id: category.id,
        label: category.name,
        value: category.slug,
      })),
    ],
    [],
  );

  const handleSelectCategory = (value: string) => {
    setSelectedCategorySlug(value);
    router.replace(value === "du-an" ? "/du-an" : `/du-an/${value}`, {
      scroll: false,
    });
  };

  const filteredProjects = useMemo(() => {
    if (selectedCategorySlug === "du-an") return projects;
    return projects.filter(
      (project) => project.category?.slug === selectedCategorySlug,
    );
  }, [projects, selectedCategorySlug]);

  const orderedProjects = useMemo(() => {
    return [...filteredProjects].sort(
      (left, right) =>
        new Date(right.createdAt ?? 0).getTime() -
        new Date(left.createdAt ?? 0).getTime(),
    );
  }, [filteredProjects]);

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(orderedProjects.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageItems = orderedProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <section className="w-full px-4 py-8">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
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
          {pageItems.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-8">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </div>
    </section>
  );
}
