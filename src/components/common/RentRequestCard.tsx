"use client";

import Link from "next/link";
import { Calendar, Eye, MapPin, Maximize } from "lucide-react";

import CloudinaryImage from "@/components/common/CloudinaryImage";
import { RENT_REQUEST_COVER_IMAGE } from "@/constants/rent-request";
import {
  formatDate,
  formatAreaValue,
  formatListingPrice,
  formatLocationParts,
  formatNumber,
} from "@/lib/format";
import { RentRequest } from "@/types/rent-request";

const CARD_HOVER_CLASSES =
  "group flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]";

function CardFooter({ request }: { request: RentRequest }) {
  return (
    <div className="text-secondary border-hairline mt-auto grid grid-cols-2 gap-2 border-t border-dashed pt-3 text-xs">
      <span className="inline-flex items-center gap-1">
        <Calendar size={14} />
        {formatDate(request.createdAt)}
      </span>
      <span className="inline-flex items-center justify-end gap-1">
        <Eye size={14} />
        {formatNumber(request.viewCount, { fallback: "0" })}
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
        className={`surface-utility ${CARD_HOVER_CLASSES} ${isFeatured ? "rounded-3xl" : "rounded-[1.25rem]"}`}
      >
        <div
          className={`bg-surface-alt relative overflow-hidden ${isFeatured ? "h-52" : "h-40"}`}
        >
          <CloudinaryImage
            src={RENT_REQUEST_COVER_IMAGE}
            alt={request.title}
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, 33vw"
            cldQuality="auto:best"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-(--editorial-scrim)" />

          <div className="absolute right-3 bottom-3 left-3 z-20">
            <h3 className="mt-2 line-clamp-2 text-xl leading-snug font-semibold text-white md:text-2xl">
              {request.title}
            </h3>
          </div>
        </div>

        <div className="flex h-full flex-1 flex-col p-5">
          {categoryName ? (
            <span className="text-primary mb-2 inline-flex w-fit items-center self-start text-[0.8rem] font-semibold tracking-[0.18em] uppercase">
              {categoryName}
            </span>
          ) : null}
          <p className="group-hover:text-primary text-heading text-xl font-semibold tracking-[-0.02em] transition-colors duration-200">
            {formatListingPrice(request.budget, {
              fallback: "Đang cập nhật",
              amount: request.budgetAmount,
              unit: request.budgetUnit,
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
                {formatAreaValue(request.desiredArea)}
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
