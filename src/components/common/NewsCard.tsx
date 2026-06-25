"use client";

import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import { News } from "@/types/news";
import { formatDate } from "@/lib/format";

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
      className="surface-utility group flex flex-row items-stretch overflow-hidden transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-2xl"
    >
      {/* Thumbnail */}
      <div className="bg-surface-alt relative w-2/5 shrink-0 overflow-hidden">
        <CloudinaryImage
          src={news.imageUrl || "/imgs/wallpaper-1.jpg"}
          alt={news.title}
          width={960}
          height={720}
          sizes="(max-width: 768px) 40vw, 20vw"
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Category badge */}
          {category ? (
            <span className="border-primary/25 bg-primary/10 text-primary mb-1.5 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-[0.11em] uppercase">
              {category}
            </span>
          ) : null}

          {/* Title */}
          <h3 className="text-heading group-hover:text-primary line-clamp-2 text-base leading-snug font-semibold tracking-[-0.02em] transition-colors duration-200 md:text-lg">
            {news.title}
          </h3>

          {/* Summary */}
          {news.summary ? (
            <p className="text-secondary my-2 line-clamp-2 text-sm leading-relaxed">
              {news.summary}
            </p>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-hairline flex items-center justify-between border-t border-dashed pt-2">
          <span className="text-secondary flex items-center gap-1.5 text-xs">
            <Calendar size={14} strokeWidth={2} className="text-primary" />
            {formatDate(news.createdAt)}
          </span>
          <span className="group-hover:text-primary text-secondary flex items-center gap-1 text-xs font-medium tracking-wide">
            Đọc tiếp
            <ArrowRight size={14} strokeWidth={2} />
          </span>
        </div>
      </div>

      {/* Gold bar */}
      {/* <div className="from-primary absolute inset-x-0 bottom-0 h-[1.5px] w-0 rounded-b-2xl bg-linear-to-r to-primary transition-all duration-300 group-hover:w-full" /> */}
    </Link>
  );
}
