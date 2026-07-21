"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Eye, Heart, Images, MapPin, Maximize } from "lucide-react";

import CloudinaryImage from "@/components/common/CloudinaryImage";
import FavoriteButton from "@/components/common/FavoriteButton";
import {
  formatAreaValue,
  formatDate,
  formatLocationParts,
  formatNumber,
  formatNegotiablePrice,
} from "@/lib/format";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track-event";
import { Project } from "@/types/project";

const DEFAULT_PROJECT_IMAGE = "/imgs/fallback.webp";
const CARD_HOVER_CLASSES =
  "group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl";

function getProjectThumbnailUrl(project: Project) {
  const sortedImages =
    project?.images
      ?.slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((image) => image.imageUrl)
      .filter(Boolean) ?? [];

  return sortedImages[0] || DEFAULT_PROJECT_IMAGE;
}

function getProjectImageCount(project: Project) {
  return (
    project?.images
      ?.slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((image) => image.imageUrl)
      .filter(Boolean).length ?? 0
  );
}

function CardFooter({
  createdAt,
  viewCount,
  favoriteCount,
}: {
  createdAt: Date | string;
  viewCount: number;
  favoriteCount: number;
}) {
  return (
    <div className="text-secondary border-hairline mt-auto flex items-center justify-between gap-2 border-t border-dashed pt-3 text-xs">
      <span className="inline-flex items-center gap-1">
        <Calendar size={14} />
        {formatDate(createdAt)}
      </span>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span className="inline-flex items-center gap-1">
          <Heart size={14} />
          {formatNumber(favoriteCount, { fallback: "0" })}
        </span>
        <span>|</span>
        <span className="inline-flex items-center gap-1">
          <Eye size={14} />
          {formatNumber(viewCount, { fallback: "0" })}
        </span>
      </span>
    </div>
  );
}

function BadgeBase({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div
      className={`absolute top-14 z-30 inline-flex h-7 min-w-10 items-center justify-center gap-1 rounded-lg px-2 text-xs font-semibold shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function ImageCountBadge({ count }: { count: number }) {
  return (
    <BadgeBase className="right-3 bg-slate-900 text-white">
      <Images size={14} />
      {count}
    </BadgeBase>
  );
}

function CardHoverBar() {
  return (
    <div className="from-primary to-primary/70 h-0.5 w-0 bg-linear-to-r transition-[width] duration-300 group-hover:w-full" />
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const thumbnailImageUrl = getProjectThumbnailUrl(project);
  const imageCount = getProjectImageCount(project);
  const [favoriteCount, setFavoriteCount] = useState(
    project.favoriteCount ?? 0,
  );
  const location = formatLocationParts(
    [project?.ward?.name, project?.province?.name],
    "Đang cập nhật vị trí",
  );

  return (
    <div className="relative h-full">
      <FavoriteButton
        entityType="PROJECT"
        entityId={project.id}
        initialFavoriteCount={project.favoriteCount ?? 0}
        className="absolute top-3 right-3 z-10"
        analytics={{
          source: "project_card",
          listingType: "project",
          listingTitle: project.name,
          listingCode: project.displayCode,
          categoryId: project.categoryId,
          categoryName: project.category?.name,
          provinceId: project.provinceId,
          provinceName: project.province?.name,
          wardId: project.wardId,
          wardName: project.ward?.name,
          priceAmount: project.priceAmount,
          priceUnit: project.priceUnit,
        }}
        onToggleResult={(_, nextFavoriteCount) => {
          setFavoriteCount(nextFavoriteCount);
        }}
      />

      <Link
        href={`/du-an/${project?.slug}`}
        className="block h-full"
        onClick={() =>
          trackEvent(ANALYTICS_EVENTS.clickProjectListing, {
            source: "project_card",
            listing_type: "project",
            listing_id: project.id,
            listing_title: project.name,
            display_code: project.displayCode,
            category_id: project.categoryId,
            category_name: project.category?.name,
            province_id: project.provinceId,
            province_name: project.province?.name,
            ward_id: project.wardId,
            ward_name: project.ward?.name,
            price_amount: project.priceAmount,
            price_unit: project.priceUnit,
          })
        }
      >
        <article className={`surface-editorial ${CARD_HOVER_CLASSES}`}>
          <div className="bg-surface-alt relative h-56 overflow-hidden">
            <CloudinaryImage
              src={thumbnailImageUrl}
              alt={project?.name}
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              cldQuality="auto:good"
              className="h-full w-full object-cover"
              fallbackSrc={DEFAULT_PROJECT_IMAGE}
            />
            <ImageCountBadge count={imageCount} />
          </div>

          <div className="flex h-full flex-1 flex-col p-4">
            <span className="text-primary mb-2 inline-flex text-xs font-semibold lg:text-sm">
              {project?.displayCode} - {project?.category?.name}
            </span>

            <h3 className="text-heading group-hover:text-primary mb-2 line-clamp-2 text-base leading-snug font-semibold tracking-[-0.02em] transition-colors duration-200 md:text-lg">
              {project?.name}
            </h3>

            <p className="group-hover:text-primary text-heading text-base font-semibold transition-colors duration-200">
              {formatNegotiablePrice(project?.price, project?.isNegotiable, {
                fallback: "Liên hệ",
                amount: project?.priceAmount,
                unit: project?.priceUnit,
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
                  {formatAreaValue(project?.area, "Đang cập nhật diện tích")}
                </span>
              </p>
            </div>

            <CardFooter
              createdAt={project?.createdAt}
              viewCount={project?.viewCount || 0}
              favoriteCount={favoriteCount}
            />
          </div>

          <CardHoverBar />
        </article>
      </Link>
    </div>
  );
}
