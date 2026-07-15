"use client";

import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

import CloudinaryImage from "@/components/common/CloudinaryImage";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { formatDate } from "@/lib/format";
import { trackEvent } from "@/lib/analytics/track-event";
import { News } from "@/types/news";

interface NewsCardProps {
  news: News;
  category?: string | null;
  priority?: boolean;
}

export default function NewsCard({
  news,
  category,
  priority = false,
}: NewsCardProps) {
  return (
    <Link
      href={`/tin-tuc/${news.slug}`}
      className="surface-utility group flex flex-col items-stretch overflow-hidden transition-shadow duration-300 ease-out hover:shadow-2xl md:flex-row"
      onClick={() =>
        trackEvent(ANALYTICS_EVENTS.clickNewsListing, {
          source: "news_card",
          listing_type: "news",
          listing_id: news.id,
          listing_title: news.title,
          category_id: news.categoryId,
          category_name: news.category?.name ?? category,
          is_featured: news.isFeatured,
        })
      }
    >
      <div className="bg-surface-alt relative aspect-[16/10] w-full shrink-0 overflow-hidden md:aspect-auto md:w-2/5">
        <CloudinaryImage
          src={news.imageUrl || "/imgs/wallpaper-1.jpg"}
          alt={news.title}
          width={960}
          height={720}
          sizes="(max-width: 768px) 100vw, 20vw"
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div>
          {category ? (
            <span className="border-primary/25 bg-primary/10 text-primary mb-1.5 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-[0.11em] uppercase">
              {category}
            </span>
          ) : null}

          <h3 className="text-heading group-hover:text-primary line-clamp-2 text-base leading-snug font-semibold tracking-[-0.02em] transition-colors duration-200 md:text-lg">
            {news.title}
          </h3>

          {news.summary ? (
            <p className="text-secondary my-2 line-clamp-2 text-sm leading-relaxed">
              {news.summary}
            </p>
          ) : null}
        </div>

        <div className="border-hairline flex flex-wrap items-center justify-between gap-2 border-t border-dashed pt-2">
          <span className="text-secondary flex min-w-0 items-center gap-1.5 text-xs">
            <Calendar size={14} strokeWidth={2} className="text-primary" />
            {formatDate(news.createdAt)}
          </span>
          <span className="group-hover:text-primary text-secondary flex items-center gap-1 whitespace-nowrap text-xs font-medium tracking-wide">
            Đọc tiếp
            <ArrowRight size={14} strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
