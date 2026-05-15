import { formatDate, formatPrice } from "@/lib/utils";
import { RentRequest } from "@/types/rent-request";
import { Calendar, Eye, MapPin, Maximize, Wallet } from "lucide-react";
import Image from "next/image";
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
  return [request.desiredDistrict?.name, request.desiredCity?.name]
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
  const image = request.thumbnailUrl || "/imgs/wallpaper-1.jpg";
  const isFeatured = variant === "featured";
  const categoryName = request.category?.name ?? "";

  return (
    <Link href={`/can-thue/${request.slug}`}>
      <article
        className={`group overflow-hidden border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
          isFeatured ? "rounded-2xl border-gray-200" : "rounded-xl border-gray-200"
        }`}
      >
        <div className={`relative overflow-hidden ${isFeatured ? "h-52" : "h-40"}`}>
          <Image
            src={image}
            alt={request.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          {categoryName ? (
            <span className="text-primary absolute top-3 left-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase">
              {categoryName}
            </span>
          ) : null}
          <h3 className="absolute right-3 bottom-3 left-3 line-clamp-2 text-lg leading-tight font-bold text-white">
            {request.title}
          </h3>
        </div>

        <div className="flex min-h-55 flex-col p-4">
          <p className="text-primary mt-1 flex items-start gap-1 text-sm font-bold">
            <Wallet size={14} className="mt-0.5 shrink-0" />
            <span>{formatBudgetRange(request)}</span>
          </p>

          <div className="my-2 space-y-1 text-sm text-gray-500">
            <p className="flex items-start gap-1">
              <MapPin size={12} className="mt-0.5 text-gray-400" />
              <span className="line-clamp-1">{location}</span>
            </p>
            <p className="flex items-start gap-1">
              <Maximize size={12} className="mt-0.5 text-gray-400" />
              {formatAreaRange(request)}
            </p>
            {request.requirementText ? (
              <p className="line-clamp-2">{request.requirementText}</p>
            ) : null}
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-dashed border-gray-200 pt-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(request.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye size={11} />
              {(request.viewCount || 0).toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
