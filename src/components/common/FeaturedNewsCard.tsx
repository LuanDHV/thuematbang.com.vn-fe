"use client";

import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import { News } from "@/types/news";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

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
    >
      <CloudinaryImage
        src={news.imageUrl || "/imgs/wallpaper-1.jpg"}
        alt={news.title}
        width={1200}
        height={900}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 space-y-3 p-4 md:p-5">
        <h3 className="group-hover:text-primary line-clamp-2 text-lg leading-snug font-semibold tracking-[-0.02em] text-white transition-colors md:text-xl">
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
    </Link>
  );
}
