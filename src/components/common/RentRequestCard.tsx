"use client";

import Link from "next/link";
import { Calendar, Eye, MapPin, Maximize } from "lucide-react";

import CloudinaryImage from "@/components/common/CloudinaryImage";
import {
  formatAreaRange,
  formatBudgetRange,
  formatDate,
  formatLocationParts,
} from "@/lib/utils";
import { RentRequest } from "@/types/rent-request";

const CARD_HOVER_CLASSES =
  "group flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(26,18,8,0.13)]";

function CardFooter({ request }: { request: RentRequest }) {
  return (
    <div className="text-secondary mt-auto grid grid-cols-2 gap-2 border-t border-dashed border-black/10 pt-3 text-xs">
      <span className="inline-flex items-center gap-1">
        <Calendar size={14} />
        {formatDate(request.createdAt)}
      </span>
      <span className="inline-flex items-center justify-end gap-1">
        <Eye size={14} />
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
  const location = formatLocationParts(
    [request.desiredWard?.name, request.desiredProvince?.name],
    "Toàn quốc",
  );
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
            <h3 className="mt-2 line-clamp-2 text-2xl leading-snug font-medium text-white">
              {request.title}
            </h3>
          </div>
        </div>

        <div className="flex h-full flex-1 flex-col p-5">
          {categoryName ? (
            <span className="text-primary mb-2 inline-flex w-fit items-center self-start text-base font-semibold uppercase">
              {categoryName}
            </span>
          ) : null}
          <p className="group-hover:text-primary text-heading text-xl font-semibold tracking-[-0.01em] transition-colors duration-200">
            {formatBudgetRange(request.minBudget, request.maxBudget, {
              fallback: "Thỏa thuận",
              upperBoundPrefix: "Dưới",
            })}
          </p>

          <div className="text-secondary my-2 grid grid-cols-1 gap-y-1.5">
            <p className="flex items-start gap-1.5">
              <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
              <span className="line-clamp-1 text-sm">{location}</span>
            </p>
            <p className="flex items-start gap-1.5">
              <Maximize size={14} className="text-primary mt-0.5 shrink-0" />
              <span className="line-clamp-1 text-sm">
                {formatAreaRange(request.minArea, request.maxArea)}
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
