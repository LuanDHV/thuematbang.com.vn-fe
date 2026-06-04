import "server-only";

import { FaqByPageResponse, FaqItem } from "@/types/faq";
import { buildListPath, buildListTags } from "./shared/list-service";
import { requestServerApi } from "./shared/server-api-client";

export type FaqListFilters = {
  q?: string;
};

export type FaqGetAllParams = {
  page?: number;
  limit?: number;
  filters?: FaqListFilters;
};

export const faqService = {
  getAll: async (params: FaqGetAllParams = {}) =>
    requestServerApi<FaqItem[]>(
      buildListPath("/faqs", params),
      {
        auth: "required",
        cache: "no-store",
        tags: buildListTags("faqs", {
          page: params.page,
          limit: params.limit,
        }),
      },
    ),

  getByPage: async (page: string) =>
    requestServerApi<FaqByPageResponse>(
      `/faqs/page/${encodeURIComponent(page)}`,
      {
        cache: "no-store",
        tags: ["faqs", `faqs-${page}`],
      },
    ),
};
