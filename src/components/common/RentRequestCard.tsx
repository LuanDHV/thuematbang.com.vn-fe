"use client";

import CloudinaryImage from "@/components/common/CloudinaryImage";
import { formatDate, formatPrice } from "@/lib/utils";
import { RentRequest } from "@/types/rent-request";
import { Calendar, Eye, MapPin, Maximize } from "lucide-react";
import Link from "next/link";

const CARD_HOVER_CLASSES =
  "group flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(26,18,8,0.13)]";

function formatBudgetRange(request: RentRequest) {
  const min = request.minBudget ?? 0;
  const max = request.maxBudget ?? 0;

  if (min > 0 && max > 0) return `${formatPrice(min)} - ${formatPrice(max)}`;
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

function CardFooter({ request }: { request: RentRequest }) {
  return (
    <div className="text-secondary mt-auto grid grid-cols-2 gap-2 border-t border-dashed border-black/10 pt-3 text-xs">
      <span className="inline-flex items-center gap-1 font-mono">
        <Calendar size={12} />
        {formatDate(request.createdAt)}
      </span>
      <span className="inline-flex items-center justify-end gap-1 font-mono">
        <Eye size={12} />
        {(request.viewCount || 0).toLocaleString("vi-VN")}
      </span>
    </div>
  );
}

function CardHoverBar() {
  return (
    <div className="from-primary to-primary/70 h-0.5 w-0 bg-linear-to-r transition-[width] duration-300 group-hover:w-full" />
  );
}

export function RentRequestCard({
  request,
  variant = "default",
}: {
  request: RentRequest;
  variant?: "default" | "featured";
}) {
  const location = getLocationText(request) || "Toàn quốc";
  const isFeatured = variant === "featured";
  const categoryName = request.category?.name ?? "";

  return (
    <Link href={`/can-thue/${request.slug}`} className="block h-full">
      <article
        className={`surface-card ${CARD_HOVER_CLASSES} ${isFeatured ? "rounded-2xl" : "rounded-xl"}`}
      >
        <div
          className={`bg-elevated relative overflow-hidden ${isFeatured ? "h-52" : "h-40"}`}
        >
          <CloudinaryImage
            src={request.imageUrl || "/imgs/wallpaper-1.jpg"}
            alt={request.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            cldQuality="auto:best"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/24 to-transparent" />

          <div className="absolute right-3 bottom-3 left-3 z-20">
            {categoryName ? (
              <span className="border-primary/30 bg-primary/14 text-primary inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold tracking-[0.18em] uppercase">
                {categoryName}
              </span>
            ) : null}
            <h3 className="mt-2 line-clamp-2 font-serif leading-snug font-medium tracking-[-0.015em] text-white">
              {request.title}
            </h3>
          </div>
        </div>

        <div className="flex h-full flex-1 flex-col p-5">
          <p className="group-hover:text-primary text-heading font-serif font-semibold tracking-[-0.01em] transition-colors duration-200">
            {formatBudgetRange(request)}
          </p>

          <div className="text-secondary my-2 grid grid-cols-1 gap-y-1.5">
            <p className="flex items-start gap-1.5">
              <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
              <span className="line-clamp-1 font-mono text-sm">{location}</span>
            </p>
            <p className="flex items-start gap-1.5">
              <Maximize size={14} className="text-primary mt-0.5 shrink-0" />
              <span className="line-clamp-1 font-mono text-sm">
                {formatAreaRange(request)}
              </span>
            </p>
          </div>

          {request.requirementText ? (
            <p className="text-secondary mb-2 line-clamp-2 text-xs leading-relaxed">
              {request.requirementText}
            </p>
          ) : null}

          <CardFooter request={request} />
        </div>

        <CardHoverBar />
      </article>
    </Link>
  );
}
