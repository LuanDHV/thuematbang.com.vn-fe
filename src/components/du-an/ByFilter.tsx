"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { mockProjects } from "../../mocks/projects";
import { Project } from "@/types/project";
import Title from "../common/Title";
import { Pagination } from "../common/Pagination";
import { ProjectCard } from "../common/ProjectCard";
import { mockCategoryProject } from "@/mocks/categories";

const PAGE_SIZE = 6;

export default function ProjectByFilter({
  projects = mockProjects,
  initialCategorySlug = "du-an",
}: {
  projects?: Project[];
  initialCategorySlug?: string;
}) {
  const router = useRouter();
  const [selectedCategorySlug, setSelectedCategorySlug] =
    useState(initialCategorySlug);

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
    <section className="w-full bg-gray-50/50 py-12 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        <Title
          title="Dự án bất động sản"
          description="Danh sách dự án nổi bật được cập nhật theo khu vực và phân khúc mới nhất."
        />

        <div className="mt-6 mb-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedCategorySlug("du-an");
              router.replace("/du-an", { scroll: false });
            }}
            className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition ${
              selectedCategorySlug === "du-an"
                ? "bg-primary text-white"
                : "border-primary text-primary hover:bg-primary/10 border bg-white"
            }`}
          >
            Tất cả
          </button>

          {mockCategoryProject.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setSelectedCategorySlug(category.slug);
                router.replace(`/du-an/${category.slug}`, { scroll: false });
              }}
              className={`cursor-pointer rounded-xl px-4 py-2 font-medium transition ${
                selectedCategorySlug === category.slug
                  ? "bg-primary text-white"
                  : "border-primary text-primary hover:bg-primary/10 border bg-white"
              }`}
            >
              {category.name}
            </button>
          ))}
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
