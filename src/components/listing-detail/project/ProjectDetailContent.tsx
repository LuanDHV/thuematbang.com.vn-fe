import {
  Bookmark,
  Building2,
  CalendarDays,
  Eye,
  Heart,
  Landmark,
  Layers,
  Maximize,
} from "lucide-react";
import FavoriteButton from "@/components/common/FavoriteButton";
import PropertyImageGallery from "@/components/common/PropertyImageGallery";
import {
  formatAreaValue,
  formatDate,
  formatNumber,
  formatNegotiablePrice,
} from "@/lib/format";
import { Project } from "@/types/project";

type ProjectDetailContentProps = {
  project: Project;
  galleryImages: string[];
  mapSrc: string | null;
};

export default function ProjectDetailContent({
  project,
  galleryImages,
  mapSrc,
}: ProjectDetailContentProps) {
  return (
    <div className="surface-card flex flex-col gap-6 p-5 lg:gap-8">
      <section>
        <PropertyImageGallery title={project?.name} images={galleryImages} />
      </section>

      <section>
        <h1 className="text-heading text-2xl leading-tight font-semibold tracking-[-0.03em] lg:text-4xl">
          {project?.name}
        </h1>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-secondary flex flex-wrap items-center gap-2 text-sm">
            <span className="surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <Bookmark size={14} className="text-primary" />
              Mã tin: {project?.displayCode}
            </span>

            <span className="surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <Layers size={14} className="text-primary" />
              Danh mục: {project?.category?.name}
            </span>

            <span className="surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <CalendarDays size={14} className="text-primary" />
              Ngày đăng: {formatDate(project?.createdAt)}
            </span>

            <span className="surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <Eye size={14} className="text-primary" />
              Lượt xem: {formatNumber(project?.viewCount, { fallback: "0" })}
            </span>

            <span className="surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <Heart size={14} className="text-primary" />
              Lượt quan tâm:{" "}
              {formatNumber(project?.favoriteCount ?? 0, { fallback: "0" })}
            </span>
          </div>

          <FavoriteButton
            entityType="PROJECT"
            entityId={project.id}
            initialFavoriteCount={project.favoriteCount ?? 0}
            className="relative z-0 self-center"
          />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-heading text-xl font-semibold">
            Thông tin chi tiết
          </h2>
        </div>

        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className="surface-card flex items-center gap-3 px-3 py-3">
            <Landmark className="text-primary mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-secondary text-xs tracking-wide uppercase">
                Tổng mức đầu tư
              </p>
              <p className="text-heading text-sm font-semibold">
                {formatNegotiablePrice(project?.price, project?.isNegotiable, {
                  fallback: "Liên hệ",
                  amount: project?.priceAmount,
                  unit: project?.priceUnit,
                })}
              </p>
            </div>
          </div>

          <div className="surface-card flex items-center gap-3 px-3 py-3">
            <Maximize className="text-primary mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-secondary text-xs tracking-wide uppercase">
                Quy mô
              </p>
              <p className="text-heading text-sm font-semibold">
                {formatAreaValue(project?.area)}
              </p>
            </div>
          </div>

          <div className="surface-card flex items-center gap-3 px-3 py-3">
            <Building2 className="text-primary mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-secondary text-xs tracking-wide uppercase">
                Chủ đầu tư
              </p>
              <p className="text-heading text-sm font-semibold">
                {project?.developer || "Đang cập nhật"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-heading text-xl font-semibold">
            Thông tin mô tả
          </h2>
        </div>

        {project?.content ? (
          <div
            className="premium-prose prose prose-sm prose-p:leading-relaxed prose-headings:font-semibold text-body max-w-none"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: project?.content }}
          />
        ) : (
          <p className="text-secondary text-sm">
            Nội dung dự án đang được cập nhật.
          </p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-heading text-xl font-semibold">
            Xem trên bản đồ
          </h2>
        </div>

        {mapSrc ? (
          <iframe
            title={`Bản đồ vị trí ${project?.name}`}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-hairline h-80 w-full rounded-2xl border shadow-xl"
          />
        ) : (
          <div className="surface-card text-secondary p-4 text-sm">
            Dự án chưa có tọa độ để hiển thị bản đồ.
          </div>
        )}
      </section>
    </div>
  );
}
