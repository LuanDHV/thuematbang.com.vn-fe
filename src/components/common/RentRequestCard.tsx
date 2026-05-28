import { formatDate, formatPrice } from "@/lib/utils";
import { RentRequest } from "@/types/rent-request";
import { Calendar, Eye, MapPin, Maximize } from "lucide-react";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import Link from "next/link";

function formatBudgetRange(request: RentRequest) {
  const min = request.minBudget ?? 0;
  const max = request.maxBudget ?? 0;

  if (min > 0 && max > 0) {
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  }
  if (min > 0) return `Từ ${formatPrice(min)}`;
  if (max > 0) return `Dưới ${formatPrice(max)}`;
  return "Thỏa thuận";
}

function formatAreaRange(request: RentRequest) {
  const min = request.minArea ?? 0;
  const max = request.maxArea ?? 0;

  if (min > 0 && max > 0) return `${min} - ${max} m²`;
  if (min > 0) return `Từ ${min} m²`;
  if (max > 0) return `Dưới ${max} m²`;
  return "Đang cập nhật";
}

function getLocationText(request: RentRequest) {
  return [request.desiredWard?.name, request.desiredProvince?.name]
    .filter(Boolean)
    .join(", ");
}

export function RentRequestCard({
  request,
  variant = "default",
}: {
  request: RentRequest;
  variant?: "default" | "featured";
}) {
  const location = getLocationText(request) || "Toàn quốc";
  const image = request.imageUrl || "/imgs/wallpaper-1.jpg";
  const isFeatured = variant === "featured";
  const categoryName = request.category?.name ?? "";

  return (
    <Link href={`/can-thue/${request.slug}`} className="block h-full">
      <article
        className={`surface-card interactive-lift group flex h-full flex-col overflow-hidden ${
          isFeatured ? "rounded-2xl" : "rounded-xl"
        }`}
      >
        <div
          className={`relative overflow-hidden ${isFeatured ? "h-52" : "h-40"}`}
        >
          <CloudinaryImage
            src={image}
            alt={request.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            cldQuality="auto:best"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/24 to-transparent" />
          {categoryName ? (
            <span className="text-primary absolute top-3 left-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold uppercase">
              {categoryName}
            </span>
          ) : null}
          <h3 className="absolute right-3 bottom-3 left-3 line-clamp-2 text-lg leading-tight font-semibold tracking-[-0.02em] text-white">
            {request.title}
          </h3>
        </div>

        <div className="flex h-full flex-1 flex-col p-5">
          <p className="text-heading mt-1 gap-1.5 text-base font-semibold uppercase transition-colors duration-200 group-hover:text-primary md:text-lg">
            <span>{formatBudgetRange(request)}</span>
          </p>

          <div className="text-muted my-2 flex flex-col gap-1 text-sm">
            <p className="flex items-start gap-1">
              <MapPin size={12} className="text-primary/70 mt-0.5" />
              <span className="line-clamp-1">{location}</span>
            </p>
            <p className="flex items-start gap-1">
              <Maximize size={12} className="text-primary/70 mt-0.5" />
              <span className="font-mono">{formatAreaRange(request)}</span>
            </p>
            {request.requirementText ? (
              <p className="line-clamp-2">{request.requirementText}</p>
            ) : null}
          </div>

          <div className="text-muted mt-auto flex items-center justify-between border-t border-dashed border-black/8 pt-3 text-sm">
            <span className="inline-flex items-center gap-1 font-mono">
              <Calendar size={11} />
              {formatDate(request.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Eye size={11} />
              {(request.viewCount || 0).toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
        <div className="bg-primary h-1 w-0 transition-all duration-300 group-hover:w-full" />
      </article>
    </Link>
  );
}
