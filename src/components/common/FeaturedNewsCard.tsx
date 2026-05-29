"use client";

import { Calendar } from "lucide-react";
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
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-heading transition-colors group-hover:text-primary md:text-xl">
            {news.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-7 text-secondary">
            {news.summary}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} strokeWidth={2.5} className="text-primary/70" />
            <span>{formatDate(news.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}


