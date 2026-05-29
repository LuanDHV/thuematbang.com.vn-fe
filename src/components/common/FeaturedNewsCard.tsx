"use client";

import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { News } from "@/types/news";
import { formatDate } from "@/lib/utils";

interface FeaturedNewsCardProps {
  news: News;
}

export default function FeaturedNewsCard({ news }: FeaturedNewsCardProps) {
  return (
    <Link
      href={`/tin-tuc/${news.slug}`}
      className="surface-card interactive-lift group flex flex-col overflow-hidden rounded-xl"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-50">
        <Image
          src="/imgs/wallpaper-1.jpg"
          alt={news.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex grow flex-col justify-between p-4 md:p-5">
        <div>
          <h3 className="text-heading group-hover:text-primary line-clamp-2 text-lg leading-snug font-semibold tracking-[-0.02em] transition-colors md:text-xl">
            {news.title}
          </h3>
          <p className="text-secondary my-2 line-clamp-3 text-sm leading-7">
            {news.summary}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-[rgba(61,32,10,0.12)] pt-2">
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
    </Link>
  );
}
