import type { CrudFilters, CrudSort, DataProvider } from "@refinedev/core";
import { axiosInstance } from "../auth/auth-client";

const ENDPOINT_MAP: Record<string, string> = {
  properties: "/properties",
  "rent-requests": "/rent-requests",
  leads: "/leads",
  "leads-property": "/leads",
  "leads-rent-request": "/leads",
  "listing-matches": "/listing-matches",
  users: "/admin/users",
  projects: "/projects",
  news: "/news",
  categories: "/categories",
  banners: "/banners",
  faqs: "/faqs",
  "static-pages": "/static-pages",
  "seo-contents": "/seo-contents",
  locations: "/locations/provinces",
  payments: "/payments",
  "property-package-orders": "/property-package-orders",
  "property-boost-orders": "/property-boost-orders",
  "rent-request-express-orders": "/rent-request-express-orders",
};

function buildUrl(resource: string): string {
  return ENDPOINT_MAP[resource] ?? `/${resource}`;
}

function resolveTotal(meta: Record<string, unknown>, fallback = 0): number {
  const candidates = [
    meta.total,
    meta.totalItems,
    meta.itemCount,
    meta.count,
    meta.totalCount,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "number") {
      return candidate;
    }
  }

  return fallback;
}

function unwrapList(payload: Record<string, unknown> | unknown[]): {
  items: unknown[];
  total: number;
} {
  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length };
  }

  if (Array.isArray(payload.items)) {
    const pagination = (payload.pagination as Record<string, unknown>) ?? {};
    const meta = (payload.meta as Record<string, unknown>) ?? {};
    return {
      items: payload.items,
      total: resolveTotal(pagination, resolveTotal(meta, payload.items.length)),
    };
  }

  if (Array.isArray(payload.data)) {
    const meta = (payload.meta as Record<string, unknown>) ?? {};
    const pagination = (payload.pagination as Record<string, unknown>) ?? {};
    return {
      items: payload.data,
      total: resolveTotal(meta, resolveTotal(pagination, payload.data.length)),
    };
  }

  return { items: [], total: 0 };
}

function appendFilters(sp: URLSearchParams, filters?: CrudFilters): void {
  if (!filters?.length) {
    return;
  }

  for (const filter of filters) {
    if (!("field" in filter)) {
      continue;
    }

    if (filter.value == null || filter.value === "") {
      continue;
    }

    const field = filter.field === "search" ? "q" : filter.field;
    sp.set(field, String(filter.value));
  }
}

function appendSorters(sp: URLSearchParams, sorters?: CrudSort[]): void {
  if (!sorters?.length) {
    return;
  }

  const primarySorter = sorters[0];
  sp.set("sortBy", primarySorter.field);
  sp.set("sortOrder", primarySorter.order === "desc" ? "desc" : "asc");
}

function notifyAdminDataChanged(resource: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("admin-data-changed", { detail: { resource } })
  );
}

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const sp = new URLSearchParams();

    if (pagination) {
      const paging = pagination as {
        current?: number;
        page?: number;
        currentPage?: number;
        pageSize?: number;
        limit?: number;
        perPage?: number;
        mode?: string;
      };
      const current = paging.current ?? paging.page ?? paging.currentPage ?? 1;
      const pageSize = paging.pageSize ?? paging.limit ?? paging.perPage ?? 10;

      if (current) {
        sp.set("page", String(current));
      }

      if (pageSize) {
        sp.set("limit", String(pageSize));
      }
    }

    appendFilters(sp, filters);
    appendSorters(sp, sorters);

    const queryString = sp.toString();
    const url = queryString ? `${buildUrl(resource)}?${queryString}` : buildUrl(resource);
    const { data } = await axiosInstance.get(url);
    const { items, total } = unwrapList(data as Record<string, unknown>);

    return { data: items as never[], total };
  },

  getOne: async ({ resource, id }) => {
    const { data } = await axiosInstance.get(`${buildUrl(resource)}/${id}`);
    const resolvedData = (data as Record<string, unknown>).data ?? data;
    return { data: resolvedData as never };
  },

  create: async ({ resource, variables }) => {
    const { data } = await axiosInstance.post(buildUrl(resource), variables);
    const resolvedData = (data as Record<string, unknown>).data ?? data;
    notifyAdminDataChanged(resource);
    return { data: resolvedData as never };
  },

  update: async ({ resource, id, variables }) => {
    const { data } = await axiosInstance.patch(`${buildUrl(resource)}/${id}`, variables);
    const resolvedData = (data as Record<string, unknown>).data ?? data;
    notifyAdminDataChanged(resource);
    return { data: resolvedData as never };
  },

  deleteOne: async ({ resource, id }) => {
    const { data } = await axiosInstance.delete(`${buildUrl(resource)}/${id}`);
    const resolvedData = (data as Record<string, unknown>).data ?? data;
    notifyAdminDataChanged(resource);
    return { data: resolvedData as never };
  },

  getApiUrl: () =>
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1",

  custom: async ({ url, method, payload, query }) => {
    const endpoint = url.startsWith("/") ? url : buildUrl(url);
    const { data } = await axiosInstance.request({
      url: endpoint,
      method,
      data: payload,
      params: query,
    });
    const resolvedData = (data as Record<string, unknown>).data ?? data;
    return { data: resolvedData as never };
  },
};
