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
}

export default function FeaturedNewsCard({
  news,
  className,
}: FeaturedNewsCardProps) {
  return (
    <Link
      href={`/tin-tuc/${news.slug}`}
      className={cn(
        "interactive-lift group relative block aspect-4/3 overflow-hidden rounded-2xl border border-hairline",
        className,
      )}
    >
      <CloudinaryImage
        src={news.imageUrl || "/imgs/wallpaper-1.jpg"}
        alt={news.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />

      <div className="absolute inset-0 bg-linear-to-t from-[rgba(28,20,12,0.82)] via-[rgba(28,20,12,0.45)] to-[rgba(28,20,12,0.05)]" />
      <div className="absolute inset-0 bg-radial-[ellipse_at_top] from-white/10 via-transparent to-transparent opacity-80" />

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
