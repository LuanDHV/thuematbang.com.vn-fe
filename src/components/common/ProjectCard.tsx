"use client";

import Link from "next/link";
import { Building2, Calendar, Eye, MapPin, Maximize } from "lucide-react";

import CloudinaryImage from "@/components/common/CloudinaryImage";
import {
  formatAreaValue,
  formatDate,
  formatLocationParts,
  formatNumber,
  formatNegotiablePrice,
} from "@/lib/format";
import { Project } from "@/types/project";

const DEFAULT_PROJECT_IMAGE = "/imgs/wallpaper-2.jpg";
const CARD_HOVER_CLASSES =
  "group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl";

function getProjectThumbnailUrl(project: Project) {
  const sortedImages =
    project.images
      ?.slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((image) => image.imageUrl)
      .filter(Boolean) ?? [];

  return sortedImages[0] || DEFAULT_PROJECT_IMAGE;
}

function CardFooter({
  createdAt,
  viewCount,
}: {
  createdAt: Date | string;
  viewCount: number;
}) {
  return (
    <div className="text-secondary border-hairline mt-auto grid grid-cols-2 gap-2 border-t border-dashed pt-3 text-xs">
      <span className="inline-flex items-center gap-1">
        <Calendar size={14} />
        {formatDate(createdAt)}
      </span>
      <span className="inline-flex items-center justify-end gap-1">
        <Eye size={14} />
        {formatNumber(viewCount, { fallback: "0" })}
      </span>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const thumbnailImageUrl = getProjectThumbnailUrl(project);
  const location = formatLocationParts(
    [project.ward?.name, project.province?.name],
    "Đang cập nhật vị trí",
  );
  // const contentPreview = project.content?.replace(/<[^>]+>/g, "").trim() || "";

  return (
    <Link
      href={`/du-an/${project.slug}`}
      className="surface-editorial group block overflow-hidden"
    >
      <article
        className={`surface-editorial ${CARD_HOVER_CLASSES}`}
      >
        <div className="bg-surface-alt relative h-56 overflow-hidden">
          <CloudinaryImage
            src={thumbnailImageUrl}
            alt={project.name}
          width={1200}
          height={900}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          cldQuality="auto:good"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        </div>

        <div className="flex h-full flex-1 flex-col p-4">
          <h3 className="text-heading group-hover:text-primary mb-2 line-clamp-2 text-base leading-snug font-semibold tracking-[-0.02em] transition-colors duration-200 md:text-lg">
            {project.name}
          </h3>

          {project.category?.name ? (
            <span className="text-primary mb-2 inline-flex w-fit items-center self-start text-xs font-semibold tracking-[0.18em] uppercase">
              {project.category.name}
            </span>
          ) : null}
          <p className="group-hover:text-primary text-heading text-lg font-semibold tracking-[-0.02em] transition-colors duration-200 md:text-xl">
            {formatNegotiablePrice(project.price, project.isNegotiable, {
              fallback: "Liên hệ",
              amount: project.priceAmount,
              unit: project.priceUnit,
            })}
          </p>

          <div className="text-secondary my-2 grid grid-cols-1 gap-y-1.5">
            <p className="flex items-start gap-1.5">
              <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
              <span className="text-secondary line-clamp-1 text-sm">
                {location}
              </span>
            </p>
            <p className="flex items-start gap-1.5">
              <Building2 size={14} className="text-primary mt-0.5 shrink-0" />
              <span className="text-secondary line-clamp-1 text-sm">
                {project.developer || "Đang cập nhật chủ đầu tư"}
              </span>
            </p>
            <p className="flex items-start gap-1.5">
              <Maximize size={14} className="text-primary mt-0.5 shrink-0" />
              <span className="text-secondary line-clamp-1 text-sm">
                {formatAreaValue(project.area, "Đang cập nhật diện tích")}
              </span>
            </p>
          </div>

          {/* {contentPreview ? (
            <p className="text-secondary mb-2 line-clamp-2 text-sm leading-relaxed">
              {contentPreview}
            </p>
          ) : null} */}

          <CardFooter
            createdAt={project.createdAt}
            viewCount={project.viewCount || 0}
          />
        </div>

        <div className="from-primary to-primary/70 h-0.5 w-0 bg-linear-to-r transition-[width] duration-300 group-hover:w-full" />
      </article>
    </Link>
  );
}
