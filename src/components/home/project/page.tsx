import { Building2 } from "lucide-react";

import EmptyStateCard from "@/components/common/EmptyStateCard";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import SafeFetch from "@/components/common/SafeFetch";
import Title from "@/components/common/Title";
import SectionBand from "@/components/home/SectionBand";
import HomeCarousel from "@/components/home/HomeCarousel";
import { ProjectCard } from "@/components/common/ProjectCard";
import { projectService } from "@/services/project.service";
import type { Project } from "@/types/project";

const FEATURED_PROJECTS_LIMIT = 8;

export default async function ProjectSection() {
  const featuredProjectsFetch = projectService.getAll({
    filters: {
      status: "PUBLISHED",
      sortBy: "viewCount",
      sortOrder: "desc",
    },
    limit: FEATURED_PROJECTS_LIMIT,
  });

  return (
    <SectionBand tone="app">
      <div className="layout-section w-full px-4">
        <div className="layout-container w-full">
          <div className="section-intro-tight">
            <Title
              eyebrow="Dự án nổi bật"
              title="Dự án đang thu hút quan tâm"
              description="Khám phá các dự án bất động sản nổi bật và mới nhất, giúp bạn xem nhanh vị trí, quy mô, tiện ích và tình trạng dự án."
              variant="home"
            />
          </div>

          <SafeFetch
            fetcher={featuredProjectsFetch}
            debugLabel="Featured Projects Response"
          >
            {(response) => {
              const featuredProjects = (response.data ?? []) as Project[];
              const isEmpty = featuredProjects.length === 0;

              if (isEmpty) {
                return (
                  <EmptyStateCard
                    icon={<Building2 size={20} strokeWidth={2} />}
                    title="Dự án nổi bật sẽ sớm được cập nhật"
                    description="Hệ thống sẽ hiển thị các dự án phù hợp ngay khi có dữ liệu."
                  />
                );
              }

              return (
                <>
                  <HomeCarousel className="py-4" options={{ align: "center" }}>
                    {featuredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="min-w-0 shrink-0 basis-11/12 pl-3"
                      >
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </HomeCarousel>

                  <div className="mt-6 hidden grid-cols-1 gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
                    {featuredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </>
              );
            }}
          </SafeFetch>

          <SeeMoreButton href="/du-an" />
        </div>
      </div>
    </SectionBand>
  );
}
