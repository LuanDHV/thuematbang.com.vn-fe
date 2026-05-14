"use client";

import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  post: Post;
}

export default function NewsCard({ post }: NewsCardProps) {
  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className="group hover:border-primary/20 hover:shadow-primary/5 flex flex-row items-stretch overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative w-2/5 shrink-0 overflow-hidden bg-gray-50">
        <Image
          src={"/imgs/wallpaper-1.jpg"}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="flex w-3/5 grow flex-col justify-between p-3 md:p-4">
        <div>
          <h3 className="group-hover:text-primary line-clamp-2 text-sm leading-snug font-extrabold text-gray-700 transition-colors md:text-base">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-400">
            {post.summary}
          </p>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-medium text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} strokeWidth={2.5} className="text-primary/70" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
