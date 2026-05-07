import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Post } from "@/types/post";

export const postService = {
  getByCategorySlug: async (slug: string, page: number = 1) => {
    return await axiosClient.get<unknown, ApiResponse<Post[]>>(
      `posts/category/slug/${slug}`,
      { params: { page } },
    );
  },
};
