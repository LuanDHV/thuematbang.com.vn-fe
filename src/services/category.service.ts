import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Category } from "@/types/category";

export const categoryService = {
  getAll: async () => {
    return await axiosClient.get<unknown, ApiResponse<Category[]>>(
      `/categories`,
    );
  },
};
