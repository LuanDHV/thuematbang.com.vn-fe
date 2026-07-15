import { Building2 } from "lucide-react";
import EmptyStateCard from "@/components/common/EmptyStateCard";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import SafeFetch from "@/components/common/SafeFetch";
import Title from "@/components/common/Title";
import SectionBand from "@/components/home/SectionBand";
import HomeCarousel from "@/components/home/HomeCarousel";
import { ProjectCard } from "@/components/common/ProjectCard";
import Reveal from "@/components/home/Reveal";
import { projectService } from "@/services/project.service";
import type { Project } from "@/types/project";

const FEATURED_PROJECTS_REVALIDATE_SECONDS = 300;
const FEATURED_PROJECTS_LIMIT = 8;

export default async function ProjectSection() {
  const featuredProjectsFetch = projectService.getAll(
    {
      filters: {
        status: "PUBLISHED",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      limit: FEATURED_PROJECTS_LIMIT,
    },
    {
      cache: "force-cache",
      revalidate: FEATURED_PROJECTS_REVALIDATE_SECONDS,
      tags: ["projects", "homepage-featured-projects"],
    },
  );

  return (
    <SectionBand tone="secondary">
      <div className="layout-section w-full">
        <div className="layout-container w-full">
          <div className="section-intro-tight">
            <Reveal>
              <Title
                eyebrow="Tiềm năng"
                title="Dự án mới nổi bật"
                description="Khám phá các dự án bất động sản nổi bật và mới nhất, giúp bạn xem nhanh vị trí, quy mô, tiện ích và tình trạng dự án."
                variant="home"
              />
            </Reveal>
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
                  <Reveal delay={80}>
                    <HomeCarousel
                      className="py-4"
                      options={{ align: "center" }}
                    >
                      {featuredProjects.map((project) => (
                        <div
                          key={project.id}
                          className="min-w-0 shrink-0 basis-11/12 pl-3"
                        >
                          <ProjectCard project={project} />
                        </div>
                      ))}
                    </HomeCarousel>
                  </Reveal>

                  <div className="mt-6 hidden grid-cols-1 gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
                    {featuredProjects.map((project, index) => (
                      <Reveal key={project.id} delay={index * 70}>
                        <ProjectCard project={project} />
                      </Reveal>
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
