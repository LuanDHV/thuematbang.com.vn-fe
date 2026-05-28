import { Project } from "@/types/project";
import { Building2, Calendar, Eye, MapPin, Maximize } from "lucide-react";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import Link from "next/link";

const DEFAULT_PROJECT_IMAGE = "/imgs/wallpaper-2.jpg";

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

function formatDate(value?: Date | string | null) {
  if (!value) return "Vừa cập nhật";
  return new Intl.DateTimeFormat("vi-VN", { timeZone: "UTC" }).format(
    new Date(value),
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const thumbnailImageUrl = getProjectThumbnailUrl(project);
  const location =
    [project.ward?.name, project.ward?.name, project.province?.name]
      .filter(Boolean)
      .join(", ") || "Đang cập nhật vị trí";

  return (
    <Link
      href={`/du-an/${project.slug}`}
      className="surface-card interactive-lift group block overflow-hidden rounded-2xl"
    >
      <div className="relative h-64 overflow-hidden">
        <CloudinaryImage
          src={thumbnailImageUrl}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          cldQuality="auto:best"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {project.category?.name ? (
          <span className="text-primary absolute top-4 left-4 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            {project.category.name}
          </span>
        ) : null}

        <div className="absolute right-4 bottom-4 left-4">
          <p className="text-[11px] font-medium tracking-[0.14em] text-white/80 uppercase">
            Dự án nổi bật
          </p>
          <h3 className="line-clamp-2 text-xl leading-tight font-semibold tracking-[-0.02em] text-white">
            {project.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5">
        <p className="text-heading mt-1 gap-1.5 text-base font-semibold uppercase transition-colors duration-200 group-hover:text-primary md:text-lg">
          <span> {formatProjectPrice(project.price)}</span>
        </p>

        <div className="text-muted flex flex-col gap-2 text-sm">
          <p className="flex items-start gap-2">
            <MapPin className="text-primary/70 size-5 shrink-0" />
            <span className="line-clamp-2 font-mono">{location}</span>
          </p>
          <p className="flex items-center gap-2">
            <Building2 className="text-primary/70 size-5 shrink-0" />
            <span className="font-mono">
              {project.developer || "Đang cập nhật chủ đầu tư"}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Maximize className="text-primary/70 size-5 shrink-0" />
            <span className="font-mono">
              {project.area
                ? `${project.area.toLocaleString("vi-VN")} m²`
                : "Đang cập nhật"}
            </span>
          </p>
        </div>

        <div className="text-muted flex items-center justify-between border-t border-dashed border-black/8 pt-2 text-sm">
          <span className="inline-flex items-center gap-1.5 font-mono">
            <Calendar size={12} />
            {formatDate(project.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono">
            <Eye size={12} />
            {(project.viewCount || 0).toLocaleString("vi-VN")}
          </span>
        </div>
      </div>

      <div className="bg-primary h-1 w-0 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
