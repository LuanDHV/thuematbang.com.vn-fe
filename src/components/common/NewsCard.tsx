"use client";

import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { News } from "@/types/news";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  news: News;
  category?: string | null;
}

export default function NewsCard({ news, category }: NewsCardProps) {
  return (
    <Link
      href={`/tin-tuc/${news.slug}`}
      className="group flex flex-row items-stretch overflow-hidden rounded-2xl border border-[rgba(61,32,10,0.12)] bg-[#fbfaf7] shadow-[0_2px_10px_rgba(61,32,10,0.06)] transition-[transform,box-shadow] duration-260 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(61,32,10,0.11)]"
    >
      {/* Thumbnail */}
      <div className="bg-elevated relative w-[38%] shrink-0 overflow-hidden">
        <Image
          src={"/imgs/wallpaper-1.jpg"}
          alt={news.title}
          fill
          sizes="(max-width: 768px) 40vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {/* fade edge sang body */}
        <div className="absolute inset-y-0 right-0 w-6 bg-linear-to-r from-transparent to-[#fbfaf7]/50" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Category badge */}
          {category ? (
            <span className="border-primary/25 bg-primary/10 text-primary mb-1.5 inline-block rounded-full border px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.11em] uppercase">
              {category}
            </span>
          ) : null}

          {/* Title */}
          <h3 className="text-heading group-hover:text-primary line-clamp-2 font-serif text-base leading-snug font-semibold tracking-[-0.01em] transition-colors duration-200 md:text-base">
            {news.title}
          </h3>

          {/* Summary */}
          {news.summary ? (
            <p className="text-secondary mt-2 line-clamp-2 text-sm leading-relaxed">
              {news.summary}
            </p>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-dashed border-[rgba(61,32,10,0.12)] pt-2">
          <span className="text-secondary flex items-center gap-1.5 font-mono text-xs">
            <Calendar size={12} strokeWidth={2} className="text-primary" />
            {formatDate(news.createdAt)}
          </span>
          <span className="text-primary flex items-center gap-1 text-xs font-medium tracking-wide">
            Đọc tiếp
            <ArrowRight size={12} strokeWidth={2} />
          </span>
        </div>
      </div>

      {/* Gold bar */}
      {/* <div className="from-primary absolute inset-x-0 bottom-0 h-[1.5px] w-0 rounded-b-2xl bg-linear-to-r to-primary transition-all duration-300 group-hover:w-full" /> */}
    </Link>
  );
}
