import { Project } from "@/types/project";
import { Calendar, Eye, MapPin, Maximize } from "lucide-react";
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
  return new Date(value).toLocaleDateString("vi-VN");
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/du-an/${project.slug}`}
      className="group border-primary/20 hover:border-primary/40 block cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={project.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-4">
        {project.category?.name ? (
          <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-[11px] font-semibold tracking-wide uppercase">
            {project.category.name}
          </span>
        ) : null}

        <h3 className="group-hover:text-primary line-clamp-2 text-lg leading-snug font-bold text-gray-800 transition-colors">
          {project.name}
        </h3>

        <p className="text-primary text-base font-semibold">
          {formatProjectPrice(project.price)}
        </p>

        <div className="space-y-1 text-sm text-gray-500">
          <p className="line-clamp-1 flex items-center gap-1">
            <MapPin size={13} />
            {[project.ward?.name, project.district?.name, project.city?.name]
              .filter(Boolean)
              .join(", ") || "Đang cập nhật vị trí"}
          </p>
          <p className="flex items-center gap-1">
            <Maximize size={13} />
            {project.area ? `${project.area.toLocaleString("vi-VN")} m²` : "Đang cập nhật diện tích"}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(project.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {(project.viewCount || 0).toLocaleString("vi-VN")}
          </span>
        </div>
      </div>
    </Link>
  );
}
