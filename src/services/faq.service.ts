import "server-only";

import { FaqByPageResponse, FaqItem } from "@/types/faq";
import { requestServerApi } from "./shared/server-api-client";

export const faqService = {
  getAll: async (params: { page?: string; isActive?: boolean } = {}) =>
    (() => {
      const query = new URLSearchParams();
      if (params.page) query.set("page", params.page);
      if (typeof params.isActive === "boolean") {
        query.set("isActive", String(params.isActive));
      }

      const path = query.toString() ? `/faqs?${query.toString()}` : "/faqs";
      return requestServerApi<FaqItem[]>(path, {
        cache: "no-store",
        tags: ["faqs"],
      });
    })(),

  getByPage: async (page: string) =>
    requestServerApi<FaqByPageResponse>(`/faqs/page/${encodeURIComponent(page)}`, {
      cache: "no-store",
      tags: ["faqs", `faqs-${page}`],
    }),
};
