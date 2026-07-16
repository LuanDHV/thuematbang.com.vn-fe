"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import EmptyStateCard from "@/components/common/EmptyStateCard";
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
    router.replace(targetPath);
  };

  const resolvedPaginationMeta = resolvePaginationClientMeta(paginationMeta);
  const totalPages = Math.max(1, resolvedPaginationMeta.totalPage ?? 1);
  const currentPage = Math.max(1, resolvedPaginationMeta.currentPage ?? 1);

  const targetPathFromCategory = (categorySlug: string) =>
    categorySlug === "du-an" ? "/du-an" : `/du-an/${categorySlug}`;

  return (
    <section className="layout-container layout-section-sm pb-0">
      <div className="flex flex-col gap-4">
        <Title title="Dự án bất động sản" level={1} />

        {breadcrumbItems?.length ? (
          <DynamicBreadcrumb items={breadcrumbItems} />
        ) : null}

        <CategoryChips
          activeValue={selectedCategorySlug}
          onChange={handleSelectCategory}
          items={categoryItems}
        />

        {projects.length === 0 ? (
          <EmptyStateCard
            icon={<Search size={20} strokeWidth={2} />}
            title="Không có dự án phù hợp"
            description="hệ thống sẽ hiển thị các dự án phù hợp ngay khi có dữ liệu."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
        <>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={(nextPage) =>
              router.replace(
                buildPagedPath(
                  targetPathFromCategory(selectedCategorySlug),
                  nextPage,
                ),
              )
            }
          />
        </>
      </div>
    </section>
  );
}
