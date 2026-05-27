import { Project } from "@/types/project";
import { Building2, Calendar, Eye, MapPin } from "lucide-react";
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
          <span className="absolute top-4 left-4 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
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

      <div className="flex flex-col gap-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-app px-4 py-3">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
              Tổng mức
            </p>
            <p className="metric-mono mt-1 text-sm font-semibold text-heading">
              {formatProjectPrice(project.price)}
            </p>
          </div>
          <div className="rounded-xl bg-app px-4 py-3">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
              Quy mô
            </p>
            <p className="metric-mono mt-1 text-sm font-semibold text-heading">
              {project.area
                ? `${project.area.toLocaleString("vi-VN")} m²`
                : "Đang cập nhật"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-body">
          <p className="flex items-start gap-2">
            <MapPin size={15} className="mt-0.5 shrink-0 text-primary/70" />
            <span className="line-clamp-2">{location}</span>
          </p>
          <p className="flex items-center gap-2">
            <Building2 size={15} className="shrink-0 text-primary/70" />
            <span>{project.developer || "Đang cập nhật chủ đầu tư"}</span>
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-black/8 pt-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5 metric-mono">
            <Calendar size={12} />
            {formatDate(project.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5 metric-mono">
            <Eye size={12} />
            {(project.viewCount || 0).toLocaleString("vi-VN")}
          </span>
        </div>

        <p className="text-sm font-semibold text-primary group-hover:underline">
          Xem chi tiết dự án
        </p>
      </div>

      <div className="h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
