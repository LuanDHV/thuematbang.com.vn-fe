"use client";

import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import { News } from "@/types/news";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track-event";

interface FeaturedNewsCardProps {
  news: News;
  className?: string;
  priority?: boolean;
}

export default function FeaturedNewsCard({
  news,
  className,
  priority = false,
}: FeaturedNewsCardProps) {
  return (
    <Link
      href={`/tin-tuc/${news.slug}`}
      className={cn(
        "surface-editorial interactive-lift group relative block aspect-4/3 overflow-hidden",
        className,
      )}
      onClick={() =>
        trackEvent(ANALYTICS_EVENTS.clickNewsListing, {
          source: "featured_news_card",
          listing_type: "news",
          listing_id: news.id,
          listing_title: news.title,
          category_id: news.categoryId,
          category_name: news.category?.name,
          is_featured: news.isFeatured,
        })
      }
    >
      <CloudinaryImage
        src={news.imageUrl || "/imgs/fallback.webp"}
        alt={news.title}
        width={1200}
        height={900}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        className="h-full w-full object-cover"
        fallbackSrc="/imgs/fallback.webp"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-black/5" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 md:p-5">
        <div className="space-y-3 rounded-lg bg-black/22 p-3 ring-1 ring-white/10 drop-shadow-lg backdrop-blur-[2px] sm:p-4">
          <h3 className="group-hover:text-primary line-clamp-2 text-lg leading-snug font-semibold text-white transition-colors md:text-xl">
            {news.title}
          </h3>
          {news.summary ? (
            <p className="line-clamp-2 text-sm leading-6 text-white/85">
              {news.summary}
            </p>
          ) : null}

          <div className="flex items-center justify-between border-t border-white/20 pt-2">
            <span className="flex items-center gap-1.5 text-xs text-white/85">
              <Calendar size={14} strokeWidth={2} className="text-primary" />
              {formatDate(news.createdAt)}
            </span>
            <span className="group-hover:text-primary flex items-center gap-1 text-xs font-medium tracking-wide text-white transition-colors">
              Đọc tiếp
              <ArrowRight size={14} strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
