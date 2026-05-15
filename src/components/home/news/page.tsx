import Title from "@/components/common/Title";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import NewsCard from "@/components/common/NewsCard";
import FeaturedNewsCard from "@/components/common/FeaturedNewsCard";
import { mockPosts } from "../../../mocks/post";

// TODO: Replace mockPosts with API call when ready
// import { postService } from "@/services/post.service";
// const response = await postService.getByCategorySlug("tin-tuc");
// const posts = response.data?.slice(0, 4) || [];

export default async function NewsSection() {
  // Using mockData for demo - replace with API call above when ready
  const posts = mockPosts.slice(0, 4);
  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 4);

  return (
    <section className="w-full px-4 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <Title
            title="Tin tức"
            description="Tổng hợp tin tức, kiến thức và xu hướng bất động sản mới nhất."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="min-h-105">
            {featuredPost && <FeaturedNewsCard post={featuredPost} />}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {sidePosts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <SeeMoreButton href="tin-tuc" />
        </div>
      </div>
    </section>
  );
}
