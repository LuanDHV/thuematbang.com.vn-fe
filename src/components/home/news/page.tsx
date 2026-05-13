import { NewsClient } from "@/components/client/NewsClient";
import { mockPosts } from "../../../../mocks/post";

// TODO: Replace mockPosts with API call when ready
// import { postService } from "@/services/post.service";
// const response = await postService.getByCategorySlug("tin-tuc");
// const posts = response.data?.slice(0, 4) || [];

export default async function NewsSection() {
  // Using mockData for demo - replace with API call above when ready
  const posts = mockPosts.slice(0, 4);

  return <NewsClient posts={posts} />;
}
