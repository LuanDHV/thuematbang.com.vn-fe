import "server-only";

import type { ListingMatchSummary } from "@/types/listing-match";
import { requestServerApi } from "./shared/server-api-client";
import { buildListPath } from "./shared/list-service";

export type ListingMatchListFilters = {
  status?: string;
  leadId?: number;
  propertyId?: number;
  rentRequestId?: number;
};

export type ListingMatchGetAllParams = {
  filters?: ListingMatchListFilters;
  page?: number;
  limit?: number;
};

export type CreateListingMatchPayload = {
  propertyId: number;
  rentRequestId: number;
  leadId?: number;
  note?: string;
};

export const listingMatchService = {
  getAll: async (params: ListingMatchGetAllParams = {}) =>
    requestServerApi<ListingMatchSummary[]>(
      buildListPath("/listing-matches", params),
      {
        auth: "required",
        cache: "no-store",
        tags: ["listing-matches"],
      },
    ),

  getById: async (id: number) => {
    const response = await requestServerApi<ListingMatchSummary>(
      `/listing-matches/${id}`,
      {
        auth: "required",
        cache: "no-store",
        tags: ["listing-match-detail"],
      },
    );
    return response.data;
  },

  getByLeadId: async (leadId: number) => {
    const response = await requestServerApi<ListingMatchSummary[]>(
      `/listing-matches/by-lead/${leadId}`,
      {
        auth: "required",
        cache: "no-store",
        tags: ["listing-matches", `lead-${leadId}-matches`],
      },
    );
    return response.data;
  },

  create: async (payload: CreateListingMatchPayload) => {
    const response = await requestServerApi<ListingMatchSummary>(
      "/listing-matches",
      {
        method: "POST",
        auth: "required",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    return response.data;
  },

  promote: async (id: number, leadId: number) => {
    const response = await requestServerApi<ListingMatchSummary>(
      `/listing-matches/${id}/promote`,
      {
        method: "POST",
        auth: "required",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      },
    );
    return response.data;
  },

  reject: async (id: number) => {
    const response = await requestServerApi<ListingMatchSummary>(
      `/listing-matches/${id}/reject`,
      {
        method: "POST",
        auth: "required",
      },
    );
    return response.data;
  },

  unmatch: async (id: number) => {
    const response = await requestServerApi<ListingMatchSummary>(
      `/listing-matches/${id}/unmatch`,
      {
        method: "POST",
        auth: "required",
      },
    );
    return response.data;
  },

  remove: async (id: number) => {
    const response = await requestServerApi<ListingMatchSummary>(
      `/listing-matches/${id}`,
      {
        method: "DELETE",
        auth: "required",
      },
    );
    return response.data;
  },
};
