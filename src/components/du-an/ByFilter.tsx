"use client";

import { useMemo, useState } from "react";
import { mockProjects } from "../../mocks/projects";
import { Project } from "@/types/project";
import Title from "../common/Title";
import { Pagination } from "../common/Pagination";
import { ProjectCard } from "../common/ProjectCard";

const PAGE_SIZE = 6;

export default function ProjectByFilter({
  projects = mockProjects,
}: {
  projects?: Project[];
}) {
  const orderedProjects = useMemo(() => {
    return [...projects].sort(
      (left, right) =>
        new Date(right.createdAt ?? 0).getTime() -
        new Date(left.createdAt ?? 0).getTime(),
    );
  }, [projects]);

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
