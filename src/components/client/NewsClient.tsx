"use client";

import Title from "@/components/common/Title";
import { Post } from "@/types/post";
import SeeMoreButton from "../common/SeeMoreButton";
import PostCard from "@/components/common/PostCard";

interface Props {
  posts: Post[];
}

export function NewsClient({ posts }: Props) {
  return (
    <section className="flex h-auto min-h-screen w-full items-center justify-center py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <Title
            title="Tin Tức"
            description="   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
        </div>

        {/* Grid 2 cột - Sử dụng PostCard */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Nút Xem thêm */}
        <div className="mt-16">
          <SeeMoreButton href="tin-tuc" />
        </div>
      </div>
    </section>
  );
}
