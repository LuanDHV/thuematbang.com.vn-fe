"use client";

import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/post";

interface FeaturedNewsCardProps {
  post: Post;
}

export default function FeaturedNewsCard({ post }: FeaturedNewsCardProps) {
  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className="group hover:border-primary/20 hover:shadow-primary/5 hover:-trangray-y-1 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-50">
        <Image
          // src={post.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
          src="/imgs/wallpaper-1.jpg"
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="flex grow flex-col justify-between p-4 md:p-5">
        <div>
          <h3 className="group-hover:text-primary line-clamp-2 text-lg leading-snug font-extrabold text-gray-800 transition-colors md:text-xl">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-400">
            {post.summary}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} strokeWidth={2.5} className="text-primary/70" />
            <span>
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("vi-VN")
                : "Gần đây"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
