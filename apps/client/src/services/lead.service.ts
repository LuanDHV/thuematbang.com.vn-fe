import "server-only";

import { Lead } from "@/types/lead";
import type { LeadSourceFilter } from "@/types/lead";
import { LeadStatus } from "@/types/enums";
import { HttpError } from "@/lib/http";
import { readAuthCookies } from "@/lib/server/auth-cookies";
import { requestServerApi } from "./shared/server-api-client";
import { buildListPath } from "./shared/list-service";

export type LeadListFilters = {
  q?: string;
  status?: LeadStatus;
  source?: LeadSourceFilter;
  propertyId?: number;
  rentRequestId?: number;
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
  status?: LeadStatus | null;
  userId?: number | null;
  propertyId?: number | null;
  rentRequestId?: number | null;
  // Counterpart selection
  selectedRentRequestIds?: number[];
  selectedPropertyIds?: number[];
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

  createPublic: async (payload: LeadUpsertPayload) => {
    const { accessToken, refreshToken } = await readAuthCookies();
    const hasAuthCookies = Boolean(accessToken || refreshToken);

    const submit = async (auth: "none" | "required") => {
      const response = await requestServerApi<Lead>("/leads", {
        method: "POST",
        auth,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return response.data;
    };

    if (!hasAuthCookies) {
      return submit("none");
    }

    try {
      return await submit("required");
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) {
        return submit("none");
      }
      throw error;
    }
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
