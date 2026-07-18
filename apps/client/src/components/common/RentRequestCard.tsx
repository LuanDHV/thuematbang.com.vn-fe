"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Eye, Heart, MapPin, Maximize } from "lucide-react";

import CloudinaryImage from "@/components/common/CloudinaryImage";
import FavoriteButton from "@/components/common/FavoriteButton";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track-event";
import { getRentRequestCoverImage } from "@/constants/rent-request";
import {
  formatDate,
  formatAreaValue,
  formatListingPrice,
  formatLocationParts,
  formatNumber,
} from "@/lib/format";
import { RentRequest } from "@/types/rent-request";

const CARD_HOVER_CLASSES =
  "group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl";

function CardFooter({
  request,
  favoriteCount,
}: {
  request: RentRequest;
  favoriteCount: number;
}) {
  return (
    <div className="text-secondary border-hairline mt-auto flex items-center justify-between gap-2 border-t border-dashed pt-3 text-xs">
      <span className="inline-flex items-center gap-1">
        <Calendar size={14} />
        {formatDate(request?.createdAt)}
      </span>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span className="inline-flex items-center gap-1">
          <Heart size={14} />
          {formatNumber(favoriteCount, { fallback: "0" })}
        </span>
        <span>|</span>
        <span className="inline-flex items-center gap-1">
          <Eye size={14} />
          {formatNumber(request?.viewCount, { fallback: "0" })}
        </span>
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
    [request?.desiredWard?.name, request?.desiredProvince?.name],
    "Toàn quốc",
  );
  const isFeatured = variant === "featured";
  const coverImage = getRentRequestCoverImage(request.category?.slug);
  const [favoriteCount, setFavoriteCount] = useState(
    request.favoriteCount ?? 0,
  );

  return (
    <div className="relative h-full">
      <FavoriteButton
        entityType="RENT_REQUEST"
        entityId={request.id}
        initialFavoriteCount={request.favoriteCount ?? 0}
        className="absolute top-3 right-3 z-10"
        analytics={{
          source: "rent_request_card",
          listingType: "rent_request",
          listingTitle: request.title,
          listingCode: request.displayCode,
          categoryId: request.categoryId,
          categoryName: request.category?.name,
          provinceId: request.desiredProvinceId,
          provinceName: request.desiredProvince?.name,
          wardId: request.desiredWardId,
          wardName: request.desiredWard?.name,
          priceAmount: request.budgetAmount,
          priceUnit: request.budgetUnit,
        }}
        onToggleResult={(_, nextFavoriteCount) => {
          setFavoriteCount(nextFavoriteCount);
        }}
      />

      <Link
        href={`/can-thue/${request?.slug}`}
        className="block h-full"
        onClick={() =>
          trackEvent(ANALYTICS_EVENTS.clickRentRequestListing, {
            source: "rent_request_card",
            listing_type: "rent_request",
            listing_id: request.id,
            listing_title: request.title,
            display_code: request.displayCode,
            category_id: request.categoryId,
            province_id: request.desiredProvinceId,
            ward_id: request.desiredWardId,
            ward_name: request.desiredWard?.name,
            is_express: request.isExpress,
            budget_amount: request.budgetAmount,
          })
        }
      >
        <article className={`surface-utility ${CARD_HOVER_CLASSES}`}>
          <div
            className={`bg-surface-alt relative overflow-hidden ${isFeatured ? "h-52" : "h-40"}`}
          >
            <CloudinaryImage
              src={coverImage}
              alt={request?.title}
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 33vw"
              cldQuality="auto:good"
              className="h-full w-full object-cover"
              fallbackSrc={coverImage}
            />
          </div>

          <div className="flex h-full flex-1 flex-col p-4">
            <span className="text-primary mb-2 inline-flex text-xs font-semibold lg:text-sm">
              {request?.displayCode} - {request?.category?.name}
            </span>

            <h3 className="text-heading group-hover:text-primary mb-2 line-clamp-2 text-base leading-snug font-semibold tracking-[-0.02em] transition-colors duration-200 md:text-lg">
              {request?.title}
            </h3>

            <p className="group-hover:text-primary text-heading text-base font-semibold transition-colors duration-200">
              {formatListingPrice(request?.budget, {
                fallback: "Đang cập nhật",
                amount: request?.budgetAmount,
                unit: request?.budgetUnit,
                negotiable: request?.isNegotiable,
                negotiableLabel: "Thỏa thuận",
              })}
            </p>

            <div className="text-secondary my-2 grid grid-cols-1 gap-y-1.5">
              <p className="flex items-start gap-1.5">
                <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                <span className="text-secondary line-clamp-1 text-sm">
                  {location}
                </span>
              </p>
              <p className="flex items-start gap-1.5">
                <Maximize size={14} className="text-primary mt-0.5 shrink-0" />
                <span className="text-secondary line-clamp-1 text-sm">
                  {formatAreaValue(request?.desiredArea)}
                </span>
              </p>
            </div>

            <CardFooter request={request} favoriteCount={favoriteCount} />
          </div>

          <CardHoverBar />
        </article>
      </Link>
    </div>
  );
}
