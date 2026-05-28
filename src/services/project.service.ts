import { Project } from "@/types/project";
import { PublishStatus } from "@/types/enums";
import { getApiResponse } from "./shared/api-client";
import { buildListPath, buildListTags, buildScopedListPath } from "./shared/list-service";

export type ProjectSortBy = "createdAt" | "price" | "area" | "viewCount";

export type ProjectListFilters = {
  categoryId?: number;
  categorySlug?: string;
  slug?: string;
  name?: string;
  developer?: string;
  provinceId?: number;
  wardId?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  status?: PublishStatus;
  sortBy?: ProjectSortBy;
  sortOrder?: "asc" | "desc";
};

export type ProjectGetAllParams = {
  filters?: ProjectListFilters;
  categorySlug?: string;
  page?: number;
  limit?: number;
};

export const projectService = {
  getAll: async (params: ProjectGetAllParams = {}) => {
    const filters = {
      ...params.filters,
      categorySlug: params.categorySlug ?? params.filters?.categorySlug,
    };

    return getApiResponse<Project[]>(
      buildListPath("/projects", {
        filters,
        page: params.page,
        limit: params.limit,
      }),
      {
        cache: "no-store",
        tags: buildListTags("projects", {
          page: params.page,
          limit: params.limit,
          scope: filters.categorySlug
            ? { key: "category", value: String(filters.categorySlug) }
            : undefined,
        }),
      },
    );
  },

  getByCategorySlug: async (
    slug: string,
    params: Omit<ProjectGetAllParams, "filters" | "categorySlug"> = {},
  ) =>
    getApiResponse<Project[]>(
      buildScopedListPath("/projects/category", slug, {
        page: params.page,
        limit: params.limit,
      }),
      {
        cache: "no-store",
        tags: buildListTags("projects", {
          page: params.page,
          limit: params.limit,
          scope: { key: "category", value: slug },
        }),
      },
    ),

  getBySlug: async (slug: string) => {
    const response = await getApiResponse<Project>(
      `/projects/slug/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        tags: ["project-detail", slug],
      },
    );
    return response.data;
  },
};


