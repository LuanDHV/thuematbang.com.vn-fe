"use client";

import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { News } from "@/types/news";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Link
      href={`/tin-tuc/${news.slug}`}
      className="surface-card interactive-lift group flex flex-row items-stretch overflow-hidden rounded-2xl"
    >
      <div className="relative w-2/5 shrink-0 overflow-hidden bg-gray-50">
        <Image
          src={"/imgs/wallpaper-1.jpg"}
          alt={news.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex w-3/5 grow flex-col justify-between p-4 md:p-5">
        <div>
          <h3 className="text-heading group-hover:text-primary line-clamp-2 text-sm leading-snug font-semibold tracking-[-0.02em] transition-colors md:text-base">
            {news.title}
          </h3>
          <p className="text-muted mt-2 line-clamp-2 text-xs leading-6">
            {news.summary}
          </p>
        </div>

        <div className="text-muted font-mono flex items-center gap-4 text-[10px] font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} strokeWidth={2.5} className="text-primary/70" />
            <span>{formatDate(news.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
