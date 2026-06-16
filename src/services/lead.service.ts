import "server-only";

import { Lead } from "@/types/lead";
import { LeadStatus } from "@/types/enums";
import { requestServerApi } from "./shared/server-api-client";
import { buildListPath } from "./shared/list-service";

export type LeadListFilters = {
  q?: string;
  status?: LeadStatus;
  propertyId?: number;
  userId?: number;
};

export type LeadGetAllParams = {
  filters?: LeadListFilters;
  page?: number;
  limit?: number;
};

export type LeadUpsertPayload = {
  fullName: string;
  phone: string;
  message?: string;
  status?: LeadStatus | null;
  userId?: number | null;
  propertyId?: number | null;
};

export const leadService = {
  getAll: async (params: LeadGetAllParams = {}) =>
    requestServerApi<Lead[]>(buildListPath("/leads", params), {
      auth: "required",
      cache: "no-store",
      tags: ["leads"],
    }),

  getById: async (id: number) => {
    const response = await requestServerApi<Lead>(`/leads/${id}`, {
      auth: "required",
      cache: "no-store",
      tags: ["lead-detail", String(id)],
    });
    return response.data;
  },

  create: async (payload: LeadUpsertPayload) => {
    const response = await requestServerApi<Lead>("/leads", {
      method: "POST",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  update: async (id: number, payload: Partial<LeadUpsertPayload>) => {
    const response = await requestServerApi<Lead>(`/leads/${id}`, {
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
    const response = await requestServerApi<Lead>(`/leads/${id}`, {
      method: "DELETE",
      auth: "required",
    });
    return response.data;
  },
};
