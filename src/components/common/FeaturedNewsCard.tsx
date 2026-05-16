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
      className="group hover:border-primary/20 hover:shadow-primary/5 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-50">
        <Image
          src="/imgs/wallpaper-1.jpg"
          alt={news.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="flex grow flex-col justify-between p-4 md:p-5">
        <div>
          <h3 className="group-hover:text-primary line-clamp-2 text-lg leading-snug font-extrabold text-gray-700 transition-colors md:text-xl">
            {news.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-400">
            {news.summary}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} strokeWidth={2.5} className="text-primary/70" />
            <span>{formatDate(news.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
