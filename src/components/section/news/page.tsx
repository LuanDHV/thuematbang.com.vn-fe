import { NewsClient } from "@/components/client/NewsClient";
import { postService } from "@/services/post.service";

export default async function NewsSection() {
  const response = await postService.getByCategorySlug("tin-tuc");
  // Lấy 8 bài mới nhất từ server
  const posts = response.data?.slice(0, 4) || [];

  return <NewsClient posts={posts} />;
}
