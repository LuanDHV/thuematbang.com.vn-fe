import "server-only";

import { SeoContent } from "@/types/seo-content";
import { requestServerApi } from "./shared/server-api-client";

export const seoContentService = {
  getAll: async () =>
    requestServerApi<SeoContent[]>("/seo-contents", {
      cache: "no-store",
      tags: ["seo-contents"],
    }),

  getByPage: async (page: string) =>
    requestServerApi<SeoContent>(`/seo-contents/page/${encodeURIComponent(page)}`, {
      cache: "no-store",
      tags: ["seo-contents", `seo-contents-${page}`],
    }),
};
