import { getProjectThumbnailUrl } from "@/mocks/projects";
import { Project } from "@/types/project";
import { Building2, Calendar, Eye, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  const thumbnailUrl = getProjectThumbnailUrl(project.id);
  const location =
    [project.ward?.name, project.district?.name, project.city?.name]
      .filter(Boolean)
      .join(", ") || "Đang cập nhật vị trí";

  return (
    <Link
      href={`/du-an/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {project.category?.name ? (
          <span className="bg-primary absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase">
            {project.category.name}
          </span>
        ) : null}

        <div className="absolute right-4 bottom-4 left-4">
          <p className="text-[11px] font-medium text-white/80 uppercase">
            Dự án nổi bật
          </p>
          <h3 className="line-clamp-2 text-xl leading-tight font-bold text-white">
            {project.name}
          </h3>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
            <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
              Tổng mức
            </p>
            <p className="text-primary mt-1 text-sm font-bold">
              {formatProjectPrice(project.price)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
            <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
              Quy mô
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-700">
              {project.area
                ? `${project.area.toLocaleString("vi-VN")} m²`
                : "Đang cập nhật"}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-start gap-2">
            <MapPin size={15} className="mt-0.5 shrink-0 text-gray-400" />
            <span className="line-clamp-2">{location}</span>
          </p>
          <p className="flex items-center gap-2">
            <Building2 size={15} className="shrink-0 text-gray-400" />
            <span>{project.developer || "Đang cập nhật chủ đầu tư"}</span>
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={12} />
            {formatDate(project.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye size={12} />
            {(project.viewCount || 0).toLocaleString("vi-VN")}
          </span>
        </div>

        <p className="text-primary text-sm font-semibold group-hover:underline">
          Xem chi tiết dự án
        </p>
      </div>

      <div className="bg-primary h-1 w-0 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}


