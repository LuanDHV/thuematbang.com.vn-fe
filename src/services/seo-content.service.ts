import "server-only";

import { SeoContent } from "@/types/seo-content";
import { buildListPath, buildListTags } from "./shared/list-service";
import { requestServerApi } from "./shared/server-api-client";

export type SeoContentGetAllParams = {
  page?: number;
  limit?: number;
};

export const seoContentService = {
  getAll: async (params: SeoContentGetAllParams = {}) =>
    requestServerApi<SeoContent[]>(
      buildListPath("/seo-contents", {
        page: params.page,
        limit: params.limit,
      }),
      {
        auth: "required",
        cache: "no-store",
        tags: buildListTags("seo-contents", {
          page: params.page,
          limit: params.limit,
        }),
      },
    ),

  getByPage: async (page: string) =>
    requestServerApi<SeoContent>(
      `/seo-contents/page/${encodeURIComponent(page)}`,
      {
        cache: "no-store",
        tags: ["seo-contents", `seo-contents-${page}`],
      },
    ),
};
