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

export type FaqUpsertPayload = {
  page: string;
  question: string;
  answer: string;
  sortOrder?: number;
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

  getById: async (id: number) => {
    const response = await requestServerApi<FaqItem>(`/faqs/${id}`, {
      auth: "required",
      cache: "no-store",
      tags: ["faq-detail", String(id)],
    });
    return response.data;
  },

  create: async (payload: FaqUpsertPayload) => {
    const response = await requestServerApi<FaqItem>("/faqs", {
      method: "POST",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  update: async (id: number, payload: Partial<FaqUpsertPayload>) => {
    const response = await requestServerApi<FaqItem>(`/faqs/${id}`, {
      method: "PATCH",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  remove: async (id: number) => {
    const response = await requestServerApi<FaqItem>(`/faqs/${id}`, {
      method: "DELETE",
      auth: "required",
    });
    return response.data;
  },
};
