"use client";

import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/post";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className="group hover:border-primary/20 hover:shadow-primary/5 flex flex-row items-center gap-5 rounded-2xl border border-slate-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:p-4"
    >
      {/* Thumbnail - Chỉnh tỉ lệ ngang hơn (Aspect 16:10 hoặc 16:9) */}
      <div className="relative aspect-16/10 w-44 shrink-0 overflow-hidden rounded-xl bg-slate-50 md:w-52 lg:w-60">
        <Image
          //   src={post.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
          src={"/imgs/wallpaper-1.jpg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Info - Giảm padding để chữ dàn trải đều hơn */}
      <div className="flex grow flex-col justify-between py-1 pr-2">
        <div>
          <h3 className="group-hover:text-primary line-clamp-2 text-sm leading-snug font-extrabold text-slate-800 transition-colors md:text-base">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed font-light text-slate-400 md:text-xs">
            {post.summary}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-4 text-[10px] font-medium text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} strokeWidth={2.5} className="text-primary/70" />
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
