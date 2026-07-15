import "server-only";

import { StaticPage } from "@/types/static-page";
import { buildListPath, buildListTags } from "./shared/list-service";
import { requestServerApi } from "./shared/server-api-client";

export type StaticPageListFilters = {
  q?: string;
};

export type StaticPageGetAllParams = {
  page?: number;
  limit?: number;
  filters?: StaticPageListFilters;
};

export type StaticPageUpsertPayload = {
  siteCode: string;
  content?: string | null;
  isPublished?: boolean;
};

export const staticPageService = {
  getAll: async (params: StaticPageGetAllParams = {}) =>
    requestServerApi<StaticPage[]>(buildListPath("/static-pages", params), {
      auth: "required",
      cache: "no-store",
      tags: buildListTags("static-pages", {
        page: params.page,
        limit: params.limit,
      }),
    }),

  getBySiteCode: async (siteCode: string) => {
    const response = await requestServerApi<StaticPage>(
      `/static-pages/site-code/${encodeURIComponent(siteCode)}`,
      {
        cache: "no-store",
        tags: ["static-pages", `static-pages-${siteCode}`],
      },
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await requestServerApi<StaticPage>(`/static-pages/${id}`, {
      auth: "required",
      cache: "no-store",
      tags: ["static-page-detail", String(id)],
    });
    return response.data;
  },

  create: async (payload: StaticPageUpsertPayload) => {
    const response = await requestServerApi<StaticPage>("/static-pages", {
      method: "POST",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  update: async (id: number, payload: Partial<StaticPageUpsertPayload>) => {
    const response = await requestServerApi<StaticPage>(`/static-pages/${id}`, {
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
    const response = await requestServerApi<StaticPage>(`/static-pages/${id}`, {
      method: "DELETE",
      auth: "required",
    });
    return response.data;
  },
};
