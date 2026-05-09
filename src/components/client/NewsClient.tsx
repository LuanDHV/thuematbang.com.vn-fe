"use client";

import Title from "@/components/common/Title";
import { Post } from "@/types/post";
import SeeMoreButton from "../common/SeeMoreButton";
import PostCard from "@/components/common/PostCard";
import FeaturedPostCard from "@/components/common/FeaturedPostCard";

interface Props {
  posts: Post[];
}

export function NewsClient({ posts }: Props) {
  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 4);

  return (
    <section className="w-full py-12 lg:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <Title
            title="Tin Tức"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
        </div>

        {/* Layout 1 bài lớn trái + 3 bài nhỏ phải */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="min-h-105">
            {featuredPost && <FeaturedPostCard post={featuredPost} />}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {sidePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Nút Xem thêm */}
        <div className="mt-16">
          <SeeMoreButton href="tin-tuc" />
        </div>
      </div>
    </section>
  );
}
