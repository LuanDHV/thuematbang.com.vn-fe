"use client";

import CloudinaryImage from "@/components/common/CloudinaryImage";
import { formatDate } from "@/lib/utils";
import { Project } from "@/types/project";
import { Building2, Calendar, Eye, MapPin, Maximize } from "lucide-react";
import Link from "next/link";

const DEFAULT_PROJECT_IMAGE = "/imgs/wallpaper-2.jpg";
const CARD_HOVER_CLASSES =
  "group flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(26,18,8,0.13)]";

function getProjectThumbnailUrl(project: Project) {
  const sortedImages =
    project.images
      ?.slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((image) => image.imageUrl)
      .filter(Boolean) ?? [];

  return sortedImages[0] || DEFAULT_PROJECT_IMAGE;
}

function formatProjectPrice(value?: number | null) {
  if (!value) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function CardFooter({
  createdAt,
  viewCount,
}: {
  createdAt: Date | string;
  viewCount: number;
}) {
  return (
    <div className="text-secondary mt-auto grid grid-cols-2 gap-2 border-t border-dashed border-black/10 pt-3 text-xs">
      <span className="inline-flex items-center gap-1 font-mono">
        <Calendar size={12} />
        {formatDate(createdAt)}
      </span>
      <span className="inline-flex items-center justify-end gap-1 font-mono">
        <Eye size={12} />
        {viewCount.toLocaleString("vi-VN")}
      </span>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const thumbnailImageUrl = getProjectThumbnailUrl(project);
  const location =
    [project.ward?.name, project.province?.name].filter(Boolean).join(", ") ||
    "Đang cập nhật vị trí";
  const contentPreview = project.content?.replace(/<[^>]+>/g, "").trim() || "";

  return (
    <Link
      href={`/du-an/${project.slug}`}
      className="surface-card interactive-lift group block overflow-hidden rounded-2xl"
    >
      <article className={`surface-card ${CARD_HOVER_CLASSES} rounded-2xl`}>
        <div className="bg-elevated relative h-56 overflow-hidden">
          <CloudinaryImage
            src={thumbnailImageUrl}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            cldQuality="auto:best"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute right-3 bottom-3 left-3 z-20">
            {project.category?.name ? (
              <span className="border-primary/30 bg-primary/14 text-primary inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold tracking-[0.18em] uppercase">
                {project.category.name}
              </span>
            ) : null}
            <h3 className="mt-2 line-clamp-2 font-serif text-xl leading-snug font-medium tracking-[-0.015em] text-white">
              {project.name}
            </h3>
          </div>
        </div>

        <div className="flex h-full flex-1 flex-col p-5">
          <p className="group-hover:text-primary text-heading font-serif text-2xl font-semibold tracking-[-0.01em] transition-colors duration-200">
            {formatProjectPrice(project.price)}
          </p>

          <div className="text-secondary my-2 grid grid-cols-1 gap-y-1.5">
            <p className="flex items-start gap-1.5">
              <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
              <span className="line-clamp-1 font-mono text-sm">{location}</span>
            </p>
            <p className="flex items-start gap-1.5">
              <Building2 size={14} className="text-primary mt-0.5 shrink-0" />
              <span className="line-clamp-1 font-mono text-sm">
                {project.developer || "Đang cập nhật chủ đầu tư"}
              </span>
            </p>
            <p className="flex items-start gap-1.5">
              <Maximize size={14} className="text-primary mt-0.5 shrink-0" />
              <span className="line-clamp-1 font-mono text-sm">
                {project.area
                  ? `${project.area.toLocaleString("vi-VN")} m²`
                  : "Đang cập nhật diện tích"}
              </span>
            </p>
          </div>

          {contentPreview ? (
            <p className="text-secondary mb-2 line-clamp-2 text-xs leading-relaxed">
              {contentPreview}
            </p>
          ) : null}

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
